import { useFormik } from 'formik'
import 'react-phone-number-input/style.css'

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

export default function LoginForm ({ user, setUser, setMessage, loginUser }) {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: values => {
      loginUser(values)
    },
    validate

  })

  return (
    <div className='justify-center items-center m-auto p-10 bg-slate-300 md:w-96 w-full md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl mb-2'>Iniciar sesión</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>

        <div className='flex flex-col gap-y-1'>
          <label htmlFor='username'>Nombre de usuario</label>
          <input type='text' name='username' id='username' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} className='border border-solid border-slate-600' />
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
