import { NextSeo } from 'next-seo'

export default function Contact () {
  return (
    <>
      <NextSeo title='Contacto' />
      <div className='flex flex-col gap-10 justify-start items-center w-full my-10'>
        <h1 className='text-4xl font-bold '>Contacto</h1>
        <p className='w-2/3 max-w-[800px] text-xl'>
          Por favor, no dudes en enviarnos tus preguntas, comentarios o sugerencias. Estamos encantados de escucharte.
        </p>
        <p className='w-2/3 max-w-[800px] text-xl'>
          Puedes ponerte en contacto con nosotros a través de correo electrónico, enviando un correo a la dirección <a className=' text-blue-700 hover:underline' href='mailto:getincouch.contact@gmail.com?Subject=SOPORTE%20Get%20in%20Couch'>getincouch.contact@gmail.com</a>.
        </p>
        <p className='w-2/3 max-w-[800px] text-xl'>
          Por último, si tienes alguna sugerencia también te animamos a que nos la hagas llegar a la misma dirección de correo electrónico con el asunto "Sugerencia Get in Couch". Para mayor comodidad, en el siguiente enlace ya está incluido el asunto del correo: <a className=' text-blue-700 hover:underline' href='mailto:getincouch.contact@gmail.com?Subject=Sugerencia%20Get%20in%20Couch'>getincouch.contact@gmail.com</a>.
        </p>
        <p className='w-2/3 max-w-[800px] text-xl'>
          ¡Gracias por tu colaboración!
        </p>
      </div>
    </>
  )
}
