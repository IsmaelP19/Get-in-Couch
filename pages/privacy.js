import { NextSeo } from 'next-seo'

export default function PrivacyPolicy () {
  return (
    <>
      <NextSeo title='Política de privacidad' />
      <div className='flex flex-col gap-10 justify-start items-center w-full my-10'>
        <h1 className='w-2/3 max-w-[800px] text-4xl font-bold '>Política de privacidad</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Fecha de vigencia: 8 de octubre de 2023
        </p>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Esta Política de Privacidad describe cómo [Get in Couch] ("nosotros", "nuestra" o "la plataforma") recopila, utiliza y comparte información personal de los usuarios de nuestro servicio en línea. Al utilizar nuestra plataforma, aceptas las prácticas descritas en esta política.
        </p>
        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>1. Información que recopilamos</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Recopilamos información personal de diversas formas cuando los usuarios utilizan nuestra plataforma:
        </p>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'><strong>Información de registro:</strong> Cuando te registras en nuestra plataforma, recopilamos tu nombre, dirección de correo electrónico y otros detalles de registro.</li>
          <li className='list-disc'><strong>Información de perfil:</strong> Puedes proporcionar información adicional en tu perfil, como una foto de perfil, una breve descripción personal y detalles relacionados con la búsqueda de inmuebles o compañeros de piso.</li>
          <li className='list-disc'><strong>Anuncios:</strong> Si creas anuncios para alquilar habitaciones, recopilamos información sobre la ubicación y detalles del inmueble, así como el precio y los requisitos del inquilino.</li>
          <li className='list-disc'><strong>Comunicaciones:</strong> Registramos las comunicaciones entre los usuarios, incluidos los mensajes del chat y las valoraciones realizadas por los usuarios.</li>
        </ul>
        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>2. Uso de la información</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Utilizamos la información recopilada para los siguientes propósitos:
        </p>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'><strong>Proporcionar y mejorar nuestros servicios: </strong>Utilizamos la información para ofrecer nuestros servicios, personalizar la experiencia del usuario y mejorar la plataforma.</li>
          <li className='list-disc'><strong>Interacciones entre usuarios: </strong>Facilitamos la comunicación entre usuarios, como el envío de mensajes entre inquilinos y propietarios.</li>
          <li className='list-disc'><strong>Cumplimiento legal:</strong> Cumplimos con las obligaciones legales y regulaciones aplicables.</li>
          <li className='list-disc'><strong>Prevenir anuncios falsos:</strong> Una vez el propietario añada la información de su anuncio, aunque decida eliminarla de la plataforma mantendremos unos datos básicos de ella en nuestra base de datos para, en caso de que vuelva a publicarla, podamos recuperar el historial de inquilinos asociados y las antiguas valoraciones. En caso de que se encuentre en situación de haber publicado por primera vez su anuncio y ya se encuentre algunos de estos parámetros, por favor, contáctanos para solucionarlo a la mayor brevedad posible.</li>
        </ul>
        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>3. Compartir información</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Compartimos información personal con terceros en las siguientes situaciones:
        </p>
        <ul className='w-2/3 max-w-[800px]  text-xl flex flex-col gap-4'>
          <li className='list-disc'><strong>Usuarios: </strong>Compartimos información de perfil, incluidos nombres, fotos de perfil, estadísticas, descripción y otros parámetros, con otros usuarios para facilitar las interacciones en la plataforma. En el caso de las estadísticas, podrás seleccionar cuáles atributos quieres que permanezcan visibles públicamente. Además, podrás definir una zona de interés en la que sólo aquellos usuarios con tu misma zona podrán visualizar las estadísticas que hayas permitido.</li>
          <li className='list-disc'><strong>Anuncios: </strong>Los anuncios de inmuebles y los comentarios se comparten públicamente en la plataforma.</li>
        </ul>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>4. Seguridad de la información</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Tomamos medidas para proteger la información personal de los usuarios, incluyendo medidas técnicas y organizativas para prevenir el acceso no autorizado o la divulgación.
        </p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>5. Cambios en la Política de Privacidad</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Las actualizaciones se publicarán en nuestra plataforma, y se considerará que aceptas dichas modificaciones si continúas utilizando nuestros servicios.
        </p>

        <br />
        <h1 className='w-2/3 max-w-[800px] text-2xl font-bold'>6. Contacto</h1>
        <p className='w-2/3 max-w-[800px]  text-xl'>
          Si tienes alguna pregunta sobre esta Política de Privacidad o deseas ejercer tus derechos de privacidad, puedes ponerte en contacto con nosotros en  <a className=' text-blue-700 hover:underline' href='mailto:getincouch.contact@gmail.com?Subject=Privacidad%20Get%20in%20Couch'>getincouch.contact@gmail.com</a>
        </p>

      </div>
    </>
  )
}
