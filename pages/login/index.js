import LoginForm from '../../components/LoginForm'
import { useState } from 'react'
import userService from '../../services/users'
import Notification from '../../components/Notification'
import { showMessage } from '../../utils/utils'

export default function SignIn () {
  const [message, setMessage] = useState([])
  const [user, setUser] = useState(null)
  const loginUser = async (credentials) => {
    try {
      const user = await userService.login(credentials)
      showMessage('Ha iniciado sesión correctamente', 'success', setMessage, 9000)
      setUser(user)
      localStorage.setItem('loggedUser', JSON.stringify(user))
      location.replace('/')
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

      <main className='flex-1'>
        <Notification message={message[0]} type={message[1]} />
        <LoginForm user={user} setUser={setUser} setMessage={setMessage} loginUser={loginUser} />

      </main>

    </>
  )
}

SignIn.getInitialProps = async (context) => {
  return { title: 'Iniciar sesión' }
}
