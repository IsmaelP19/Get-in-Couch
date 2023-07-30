import { useFormik } from 'formik'
import 'react-phone-number-input/style.css'
import { showMessage } from '../utils/utils'
import userService from '../services/users'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'

const validate = (values) => {
  const errors = {}

  if (!values.password) {
    errors.password = 'No puede dejar vacío este campo'
  }

  if (!values.username) {
    errors.username = 'No puede dejar vacío este campo'
  }

  return errors
}

export default function LoginForm () {
  const { setUser, setMessage } = useAppContext()
  const router = useRouter()
  const loginUser = async (credentials) => {
    try {
      const loggedUser = await userService.login(credentials)
      showMessage('Ha iniciado sesión correctamente 🙌', 'success', setMessage, 4000)
      const user = await userService.getUser(loggedUser.username)
      localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      setTimeout(() => {
        router.push('/')
        setUser(user)
      }, 4000)
    } catch (error) {
      if (error.response.data.error.includes('invalid username or password')) {
        showMessage('Usuario o contraseña incorrectos', 'error', setMessage, 9000)
      } else {
        showMessage('Ha ocurrido un error al iniciar sesión 😢. Por favor, prueba más tarde ⌛', 'error', setMessage, 9000)
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: values => {
      loginUser(values)
    },
    validate,
    validateOnBlur: true

  })

  return (
    <div className='justify-center items-center m-auto p-10 bg-slate-300 md:w-96 w-full md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl mb-2'>Iniciar sesión</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>

        <div className='flex flex-col gap-y-1'>
          <label htmlFor='username'>Nombre de usuario</label>
          <input type='text' name='username' id='username' onChange={(e) => formik.setFieldValue('username', e.target.value.toLowerCase())} onBlur={formik.handleBlur} value={formik.values.username} className='border border-solid border-slate-600' />
          {formik.touched.username && formik.errors.username ? <div className='text-red-600'>{formik.errors.username}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='password'>Contraseña</label>
          <input type='password' name='password' id='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className='border border-solid border-slate-600' />
          {formik.touched.password && formik.errors.password ? <div className='text-red-600'>{formik.errors.password}</div> : null}
        </div>

        <div className='flex items-center justify-center'>
          <button type='submit' className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-3/5 '>Iniciar sesión</button>
        </div>
      </form>
    </div>
  )
}
