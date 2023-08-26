import propertiesService from '../../../services/properties'
import { useAppContext } from '../../../context/state'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UserTag from '../../../components/UserTag'
import { useFormik } from 'formik'
import { showMessage } from '../../../utils/utils'
import Notification from '../../../components/Notification'
import UsersSearch from '../../../components/UserSearch'

export default function EditTenants ({ property }) {
  const { user, message, setMessage, done } = useAppContext()
  const [isOwner, setIsOwner] = useState(false)
  const [tenants, setTenants] = useState([]) // array of objects (users with its properties)
  const router = useRouter()

  useEffect(() => {
    if (done && (!user?.isOwner || !user?.properties.includes(property?.id))) {
      router.push('/403')
    } else if (done && user) {
      setIsOwner(user?.properties.includes(property.id))
    }
  }, [user, router, done, property])

  useEffect(() => {
    const fetchTenants = async () => {
      const fetchedTenants = await propertiesService.getTenants(property.id, user.id)
      setTenants(fetchedTenants)
    }
    if (isOwner) {
      fetchTenants()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, property])

  const updateTenants = async (values) => {
    try {
      if (values.tenants.length > property.features.numberOfBedrooms) {
        showMessage(`Has definido ${property.features.numberOfBedrooms} habitaciones en tu propiedad y añadiste ${values.tenants.length} inquilinos`, 'error', setMessage, 6000, true)
      } else {
        await propertiesService.updateTenants(property.id, user.id, values)
        showMessage('Inquilinos actualizados correctamente', 'success', setMessage, 4000, true)
        setTimeout(() => {
          router.push(`/properties/${property.id}`)
        }, 4000)
      }
    } catch (error) {
      if (error.response.data.error === 'new tenants cannot be owners') {
        showMessage('Los nuevos inquilinos no pueden ser propietarios', 'error', setMessage, 6000, true)
      } else if (error.response.data.error === 'there are some tenants that are already living in another property') {
        const tenants = error.response.data.alreadyTenants.map(t => `@${t.username}`)
        showMessage(`Algunos de los inquilinos seleccionados ya viven en otra propiedad (${tenants.join(', ')})`, 'error', setMessage, 6000, true)
      } else {
        showMessage('Ha ocurrido un error. Por favor, inténtelo más tarde.', 'error', setMessage, 6000, true)
      }
    }
  }

  const handleDelete = (id) => {
    setTenants(tenants.filter(t => t.id !== id))
  }

  const formik = useFormik({
    initialValues: {
      tenants: tenants.map(t => t.id)
    },
    onSubmit: values => updateTenants(values),
    enableReinitialize: true
  })

  return (user?.isOwner && property.owner.id === user?.id) && (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='px-10 py-5 font-bold text-3xl text-center'>Inquilinos</h1>
      <Notification message={message[0]} type={message[1]} className='w-max-fit' />
      <div>
        <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
          <p className='font-bold'>Atención</p>
          <p>Recuerda verificar el número de habitaciones disponibles en caso de contar con inquilinos ajenos a Get in Couch.</p>
        </div>
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
          <p className='font-bold'>Tenga en cuenta</p>
          <p>Los usuarios seleccionados van a pasar a formar parte de los inquilinos de su inmueble. Si decide eliminarlos como inquilinos seguirán en el historial y podrán comentar como antiguos inquilinos.</p>
        </div>
      </div>

      <div className='flex flex-row flex-wrap justify-center items-center  mx-[5%] gap-5'>
        {tenants.map(t => <UserTag key={t.id} user={t} action={() => handleDelete(t.id)} />)}
      </div>

      <UsersSearch tenants={tenants} setTenants={setTenants} onlyTenants />

      <form onSubmit={formik.handleSubmit}>
        <input type='hidden' name='tenants' value={tenants} />

        <div className='flex flex-col max-w-fit'>

          <span className={`text-xl ${tenants.length > property.features.numberOfBedrooms ? 'bg-red-400 border-red-600' : tenants.length === property.features.numberOfBedrooms ? 'bg-yellow-400 border-yellow-500' : 'bg-green-200 border-green-500'} border-2 p-2 `}>{tenants.length}/{property.features.numberOfBedrooms} habitaciones ocupadas</span>

          <button type='submit' className={`mt-5 max-w-fit self-center border-2 border-black bg-slate-700 rounded-2xl text-white font-bold py-2 px-4  hover:text-black ${tenants.length > property.features.numberOfBedrooms ? 'hover:cursor-not-allowed hover:bg-red-400' : 'hover:bg-green-400'}`} disabled={tenants.length > property.features.numberOfBedrooms}>
            Actualizar
          </button>
        </div>
      </form>

    </div>
  )
}

export async function getServerSideProps (context) {
  const id = context.params.id

  const property = await propertiesService.getProperty(id)
  if (property.error) {
    context.res.writeHead(302, { Location: '/404' })
    context.res.end()
  }

  return {
    props: {
      property,
      title: 'Detalles del inmueble'
    }
  }
}
