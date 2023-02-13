import Head from 'next/head'
// import Feature from '../components/Feature'
import Footer from '../../components/Footer'
// import InfoCard from '../components/InfoCard'
import Navbar from '../../components/Navbar'
import LoginForm from '../../components/LoginForm'
import { useState } from 'react'
import userService from '../../services/users'
import Notification from '../../components/Notification'
import { showMessage } from '../../utils/utils'

export default function SignUp () {
  const [message, setMessage] = useState([])
  const [user, setUser] = useState(null)
  const loginUser = async (credentials) => {
    try {
      const user = await userService.login(credentials)
      showMessage('Ha iniciado sesión correctamente', 'success', setMessage, 9000)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      console.log('user', user)
    } catch (error) {
      if (error.response.data.error.includes('invalid username or password')) {
        showMessage('Usuario o contraseña incorrectos', 'error', setMessage, 9000)
      } else {
        showMessage('Ha ocurrido un error al iniciar sesión 😢. Por favor, prueba más tarde ⌛', 'error', setMessage, 9000)
      }
    }
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
          <LoginForm user={user} setUser={setUser} setMessage={setMessage} loginUser={loginUser} />

        </main>

        <Footer className='mt-auto' />
      </div>

    </>
  )
}
