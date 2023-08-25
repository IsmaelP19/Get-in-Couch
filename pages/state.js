import { useState, useEffect } from 'react'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'
// import propertiesService from '../services/properties'
import usersService from '../services/users'
import { Loading } from '@nextui-org/react'
import PropertyCard from '../components/PropertyCard'
import PropertyInfo from '../components/PropertyInfo'

export default function State () {
  /*
  * In this page we will show the actual state of the user
  * We will show if the user is living in a property or not and the information of the property ✅
  * As of the property, we will also show the profiles of our roommates
  * //FIXME: roblema: de momento el usuario no está restringido a que pueda vivir en una única propiedad. Habría que modificar la API para actualizar los tenants de la propiedad y comprobar esto.
  * Estaría bien mostrar un historial al final de la página con los PropertyCards de las propiedades en las que ha vivido el usuario
  * No mostraremos un historial de los roommates porque no tiene sentido
  * Sin embargo, sí que aparecerán los actuales roommates del usuario y podrá evaluarlos si cumple una serie de requisitos
  * Una vez se haya evaluado a un roommate se podrá volver a evaluar pasado un tiempo (por determinar aún).
  * Sin embargo, una vez se abandone la propiedad (o el roommate lo haga) no se podrá volver a evaluar a dicho roommate.
  * Como es normal, puede darse el caso de coincidir con el mismo roommate en otro piso. En este caso, detectaría que ya se ha hecho una evaluación y podría modificarla (siempre y cuando cumpla los requisitos iniciales de llevar X tiempo conviviendo como si de la primera evaluación se tratase).

  * */

  const { user, done } = useAppContext()
  const [livingProperty, setLivingProperty] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getLivingProperty () {
      const property = await usersService.getLivingProperty(user.username)
      setLivingProperty(property)
      setLoading(false)
    }

    if (done) {
      if (!user) router.push('/')
      else if (user.isOwner) router.push('/403')
      else {
        getLivingProperty()
      }
    }
  }, [router, done])

  useEffect(() => {
    if (livingProperty) {
      console.log(livingProperty)
    }
  }, [livingProperty])

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      {done && !user.isOwner && (
        <>

          {isLoading
            ? (
              <div className='flex flex-col items-center justify-center gap-3 my-10 w-full h-full'>
                <Loading color='primary' />
                <span>Cargando...</span>
              </div>
              )
            : (
              <>
                {livingProperty?.property
                  ? (
                    <div className='flex flex-col items-center justify-center gap-5 my-5 w-[90%]'>
                      <h1 className='text-3xl font-bold p-5'>Situación actual</h1>
                      <div className='flex flex-col md:flex-row gap-20  items-center justify-center px-2'>
                        <PropertyCard property={livingProperty.property} />
                        <PropertyInfo property={livingProperty.property} />
                      </div>
                      <div>
                        <h2 className='text-2xl font-bold p-5'>Compañeros de piso</h2>
                      </div>

                    </div>
                    )
                  : (
                    <div className='flex flex-col items-center justify-center gap-3 my-10 w-full'>
                      <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
                        <p className='font-bold text-xl'>Atención</p>
                        <p className='text-xl'>
                          Actualmente no se encuentra viviendo en ningún inmueble.
                          <br />
                          Si crees que es un error pídele al propietario que te añada como inquilino.
                        </p>
                      </div>
                    </div>
                    )}
              </>

              )}
        </>
      )}

    </div>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      title: 'Situación actual'
    }
  }
}
