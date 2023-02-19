import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { DefaultSeo, NextSeo } from 'next-seo'

const DEFAULT_SEO = {
  titleTemplate: '%s | Get in Couch 🏠',
  description: 'Get in Couch, una red social para encontrar tus compañeros de piso',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://getincouch.vercel.app/',
    site_name: 'Get in Couch'
  }
}

export default function App ({ Component, pageProps }) {
  return (
    <>

      <DefaultSeo {...DEFAULT_SEO} />
      <NextSeo title={pageProps.title} />
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1 flex justify-center'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  )
}
