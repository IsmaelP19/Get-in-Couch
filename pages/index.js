import Head from 'next/head'
import Feature from '../components/Feature'
import Footer from '../components/Footer'
import InfoCard from '../components/InfoCard'
import Navbar from '../components/Navbar'

export default function Home ({ registeredUsers }) {
  return (
    <>
      <Head>
        <title>Get in Couch</title>
        <meta name='description' content='Get in Couch, a social network to find your flat mates' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1'>
          <div className='md:h-[25.3rem] bg-index-img bg-center bg-cover flex flex-col md:flex-row justify-around items-center py-10 gap-4 shadow-lg shadow-gray-400'>
            <InfoCard title='Publica tu inmueble' description='Ideal si tienes una vivienda que deseas alquilar a terceros.' buttonName='Accede ya' buttonLink='/login' buttonStyle='bg-gray-200 hover:bg-slate-600 text-black hover:text-white' />
            <InfoCard title='¿Buscas habitación?' description='Ideal si quieres compartir vivienda y reducir gastos.' buttonName='Accede ya' buttonLink='/login' buttonStyle='bg-gray-200 hover:bg-slate-600 text-black hover:text-white' />
          </div>
          <div className='my-10'>
            <h1 className='text-2xl md:text-3xl font-bold text-center'>Lo que nos hace diferentes</h1>
            <Feature title={`Actualmente contamos con XXX ofertas de inmuebles y ${registeredUsers} usuarios registrados`} description='¡Tienes más que suficiente para encontrar el sitio ideal para compartir!' color='#047857' />
            <Feature title='Registro rápido' description='En tan solo unos minutos podrás utilizar Get in Couch al completo.' color='#0e7490' />
            <Feature title='Estadísticas' description='Podrás visualizar las estadísticas de cada usuario para determinar si es tu compañero ideal o no. Además, pasado un mes de estancia con tus compañeros, podrás votarlos sobre diferentes aspectos. Pero relax, que esto no es Gran Hermano 😉' color='#4338ca' />
            <Feature title='Mensajería' description='Podrás chatear con cualquier persona de forma instantánea. ¡Es la oportunidad perfecta para un primer encuentro!' color='#7e22ce' />
          </div>
        </main>
        <Footer className='mt-auto' />
      </div>

    </>
  )
}

export async function getServerSideProps (context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const registeredUsers = await fetch(`${process.env.API_URL}/users`)
  const registeredUsersJson = await registeredUsers.json()

  return {
    props: { registeredUsers: registeredUsersJson.length }
  }
}
