import Head from 'next/head'
// import Feature from '../components/Feature'
import Footer from '../../components/Footer'
// import InfoCard from '../components/InfoCard'
import Navbar from '../../components/Navbar'

export default function SignUp () {
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
        <main className='flex-1' />
        <Footer className='mt-auto' />
      </div>

    </>
  )
}
