import Feature from '../components/Feature'
import InfoCard from '../components/InfoCard'
import { useAppContext } from '../context/state'
import propertiesService from '../services/properties'
import userService from '../services/users'
export default function Home ({ registeredUsers, properties }) {
  const { user } = useAppContext()
  // console.log(user == undefined)
  return (
    <>

      <div className='flex flex-col w-full'>

        <div className='md:h-[25.3rem] bg-index-img bg-center bg-cover flex flex-col md:flex-row justify-around items-center py-10 gap-4 shadow-lg shadow-gray-400'>
          {(!user || user?.isOwner) && (
            <InfoCard title='Publica tu inmueble' description='Ideal si tienes una vivienda que deseas alquilar a terceros.' buttonName='Accede ya' buttonLink='/login' buttonStyle='bg-gray-200 hover:bg-slate-600 text-black hover:text-white' />
          )}
          {(!user || !user?.isOwner) && (
            <InfoCard title='¿Buscas habitación?' description='Ideal si quieres compartir vivienda y reducir gastos.' buttonName='Accede ya' buttonLink='/login' buttonStyle='bg-gray-200 hover:bg-slate-600 text-black hover:text-white' />
          )}
        </div>

        <div className='my-10'>
          <h1 className='text-2xl md:text-3xl font-bold text-center'>Lo que nos hace diferentes</h1>
          <Feature title={`Actualmente contamos con ${properties} ofertas de inmuebles y ${registeredUsers} usuarios registrados`} description='¡Tienes más que suficiente para encontrar el sitio ideal para compartir!' color='#047857' />
          <Feature title='Registro rápido' description='En tan solo unos minutos podrás utilizar Get in Couch al completo.' color='#0e7490' />
          <Feature title='Estadísticas' description='Podrás visualizar las estadísticas de cada usuario para determinar si es tu compañero ideal o no. Además, pasado un mes de estancia con tus compañeros, podrás votarlos sobre diferentes aspectos. Pero relax, que esto no es Gran Hermano 😉' color='#4338ca' />
          <Feature title='Mensajería' description='Podrás chatear con cualquier persona de forma instantánea. ¡Es la oportunidad perfecta para un primer encuentro!' color='#7e22ce' />
        </div>
      </div>

    </>
  )
}

export async function getServerSideProps (context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const registeredUsers = await userService.getAll()

  const properties = await propertiesService.getAll()

  return {
    props: { registeredUsers: registeredUsers.total || 0, properties: properties?.total || 0, title: 'Inicio' }
  }
}
