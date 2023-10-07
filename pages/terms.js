import { NextSeo } from 'next-seo'
import Link from 'next/link'

export default function PrivacyPolicy () {
  return (
    <>
      <NextSeo title='Términos y condiciones' />
      <div className='flex flex-col gap-10 justify-start items-center w-full my-10'>
        <h1 className='w-2/3 max-w-[800px] text-4xl font-bold '>Términos y condiciones</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Fecha de vigencia: 8 de octubre de 2023
        </p>
        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>1. Aceptación de los Términos y Condiciones</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>Al utilizar nuestra plataforma, aceptas cumplir con estos Términos y Condiciones.</p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>2. Registro de cuenta</h1>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'>Debes ser mayor de edad para registrarte en nuestra plataforma.</li>
          <li className='list-disc'>Proporciona información precisa y actualizada durante el proceso de registro.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>3. Uso Adecuado</h1>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'>No utilices nuestra plataforma para actividades ilegales o inapropiadas.</li>
          <li className='list-disc'>No publiques contenido ofensivo, difamatorio o fraudulento en la plataforma.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>4. Anuncios</h1>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'>Los anuncios de habitaciones deben ser precisos y completos.</li>
          <li className='list-disc'>No publiques anuncios de habitaciones falsos o engañosos.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>5. Privacidad</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>Respetamos la privacidad de los usuarios. Consulta nuestra <Link className='text-blue-700 hover:underline' href='/privacy'>Política de Privacidad</Link> para obtener más información.</p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>6. Comunicación</h1>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'>Las comunicaciones entre usuarios deben ser respetuosas y no invasivas.</li>
          <li className='list-disc'>No compartas información personal con otros usuarios.</li>
          <li className='list-disc'>No utilices la plataforma para promocionar productos o servicios.</li>
          <li className='list-disc'>No envíes spam a otros usuarios.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>7. Contenido generado por el Usuario</h1>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'>Los usuarios son responsables del contenido que publican en la plataforma.</li>
          <li className='list-disc'>No utilices contenido protegido por derechos de autor sin permiso.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>8. Cancelación de Cuenta</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>Nos reservamos el derecho de cancelar cuentas que violen estos Términos y Condiciones.</p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>9. Modificaciones en los Términos</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios se notificarán a los usuarios.</p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>10. Contacto</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'> Si tienes alguna pregunta sobre esta Política de Privacidad o deseas ejercer tus derechos de privacidad, puedes ponerte en contacto con nosotros en  <a className=' text-blue-700 hover:underline' href='mailto:getincouch.contact@gmail.com?Subject=TyC%20Get%20in%20Couch'>getincouch.contact@gmail.com</a></p>

      </div>
    </>
  )
}
