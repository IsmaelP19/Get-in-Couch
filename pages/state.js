import { useState, useEffect } from 'react'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'
import usersService from '../services/users'
import { Loading } from '@nextui-org/react'
import PropertyCard from '../components/PropertyCard'
import PropertyInfo from '../components/PropertyInfo'
import Roommate from '../components/Roommate'
import Link from 'next/link'

export default function State () {
  /*
  * Mostraremos si el usuario está viviendo en un inmueble actualmente o no, y la información de dicho inmueble (PropertyCard y PropertyInfo básico) ✅
  * En cuanto al inmueble,mostraremos también los perfiles de nuestros compañeros de piso ✅
  *  Problema: de momento el usuario no está restringido a que pueda vivir en una única propiedad. Habría que modificar la API para actualizar los tenants de la propiedad y comprobar esto. ✅
  * Estaría bien mostrar un historial al final de la página con los PropertyCards de las propiedades en las que ha vivido el usuario✅
  * No mostraremos un historial de los roommates porque no tiene sentido ✅
  * Sin embargo, sí que aparecerán los actuales roommates del usuario y podrá evaluarlos si cumple una serie de requisitos ✅ (falta crear el formulario para evaluar)
  * Una vez se haya evaluado a un roommate se podrá volver a evaluar pasado un tiempo (7 días). ✅
  * Sin embargo, una vez se abandone la propiedad (o el roommate lo haga) no se podrá volver a evaluar a dicho roommate. ✅ (se comprueba justo antes de renderizar el formulario)
  * Como es normal, puede darse el caso de coincidir con el mismo roommate en otro piso. En este caso, detectaría que ya se ha hecho una evaluación y podría modificarla (siempre y cuando cumpla los requisitos iniciales de llevar X tiempo conviviendo como si de la primera evaluación se tratase).
  */

  const { user, done } = useAppContext()
  const [livingProperty, setLivingProperty] = useState(null)
  const [propertyHistory, setPropertyHistory] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getLivingProperty () {
      const property = await usersService.getLivingProperty(user.username)
      // we exclude the current user logged in from the tenants array
      if (property?.property) {
        const tenantSince = property.property.tenants.find(tenant => tenant.user.username === user.username).date

        property.property.tenants = property.property.tenants.filter(tenant => tenant.user.username !== user.username).map(tenant => {
          const daysLivingTogether = Math.floor((new Date() - new Date(Math.max(new Date(tenant.date), new Date(tenantSince)))) / (1000 * 60 * 60 * 24))

          return { ...tenant, daysLivingTogether }
        })

        delete property.property.location?.coordinates
        property.property.location.street = property.property.location.street.split(',')[0]
      }

      setLivingProperty(property)
      setLoading(false)
    }

    async function getPropertyHistory () {
      const { properties } = await usersService.getPropertyHistory(user.username)
      properties.forEach(property => {
        delete property.location?.coordinates
        property.location.street = property.location.street.split(',')[0]
      })
      setPropertyHistory(properties)
    }

    if (done) {
      if (!user) router.push('/')
      else if (user.isOwner) router.push('/403')
      else {
        getLivingProperty()
        getPropertyHistory()
      }
    }
  }, [router, done])

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      {done && !user?.isOwner && (
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
                <div className='flex flex-col items-center justify-center gap-5 my-5 w-[90%]'>
                  <h1 className='text-3xl font-bold p-5'>Situación actual</h1>

                  {livingProperty?.property
                    ? (
                      <>
                        <div className='flex flex-col md:flex-row gap-20  items-center justify-center px-2'>
                          <Link href={`/properties/${livingProperty.property.id}`}>
                            <PropertyCard property={livingProperty.property} />
                          </Link>
                          <PropertyInfo property={livingProperty.property} />
                        </div>
                        <div className='flex flex-col items-center justify-center w-full'>
                          <h2 className='text-2xl font-bold p-5'>Compañeros de piso</h2>
                          <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
                            <p className='font-bold text-xl'>Atención</p>
                            <p className='text-xl'>
                              Para poder evaluar a tus compañeros de piso debes haber convivido con ellos al menos 30 días.
                            </p>
                          </div>
                          <div className='flex gap-4 flex-wrap w-full items-center justify-center'>
                            {livingProperty.property.tenants.map(tenant => (
                              <Roommate key={tenant.user.id} user={tenant.user} days={tenant.daysLivingTogether} />
                            ))}
                          </div>
                        </div>
                      </>
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
                  <div className='flex flex-col items-center justify-center w-full mt-4'>
                    {propertyHistory?.length > 0 && (
                      <h2 className='text-2xl font-bold p-5'>Inmuebles en los que he vivido</h2>
                    )}
                    <div className='flex gap-8 flex-wrap w-[90%] items-center justify-center'>

                      {propertyHistory?.map(property => (

                        <Link href={`/properties/${property.id}`} key={property.id}>
                          <PropertyCard property={property} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
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
