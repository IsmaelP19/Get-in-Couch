
// import Feature from '../components/Feature'
// import InfoCard from '../components/InfoCard'
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
      <div className='flex flex-col justify-center'>
        <Notification message={message[0]} type={message[1]} />
        <SignUpForm createUser={createUser} />
      </div>
    </>
  )
}

SignUp.getInitialProps = async (context) => {
  return { title: 'Registrarse' }
}
