import Head from 'next/head'
// import Feature from '../components/Feature'
import Footer from '../../components/Footer'
// import InfoCard from '../components/InfoCard'
import Navbar from '../../components/Navbar'
import SignUpForm from '../../components/SignUpForm'
import { useState } from 'react'
import userService from '../../services/users'
import Notification from '../../components/Notification'
import { showMessage } from '../../utils/utils'

export default function SignUp () {
  const [message, setMessage] = useState([])
  const createUser = (userObject) => {
    userService.create(userObject)
      .then(response => {
        showMessage('Se ha registrado satisfactoriamente. Ya puede iniciar sesión 😎', 'success', setMessage, 9000)
      })
      .catch(error => {
        if (error.response.data.error.includes('`email` to be unique')) {
          showMessage('El email introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000)
        } else if (error.response.data.error.includes('`username` to be unique')) {
          showMessage('El nombre de usuario introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000)
        } else if (error.response.data.error.includes('`phoneNumber` to be unique')) {
          showMessage('El número de teléfono introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000)
        } else {
          showMessage('Ha ocurrido un error al registrar al usuario 😢. Por favor, prueba más tarde ⌛', 'error', setMessage, 9000)
        }
      })
  }

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
          <Notification message={message[0]} type={message[1]} />
          <SignUpForm createUser={createUser} />

        </main>

        <Footer className='mt-auto' />
      </div>

    </>
  )
}
