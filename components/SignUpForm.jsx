import { useFormik } from 'formik'

const validate = values => {
  const errors = {}

  if (!values.email) {
    console.log('email', values.email)
    errors.email = 'No puede dejar vacío este campo'
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email)) {
    errors.email = 'Introduzca una dirección de correo electrónico válida'
    console.log('email', values.email)
  }

  if (!values.password) {
    errors.password = 'No puede dejar vacío este campo'
  } else if (values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(values.password)) {
    errors.password = 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.'
  }

  if (!values.username) {
    errors.username = 'No puede dejar vacío este campo'
  } else if (values.username.length < 3) {
    errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
  }

  if (!values.name) {
    errors.name = 'No puede dejar vacío este campo'
  } else if (values.name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  }
  if (!values.surname) {
    errors.surname = 'No puede dejar vacío este campo'
  } else if (values.surname.length < 3) {
    errors.surname = 'Los apellidos deben contener al menos 3 caracteres'
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = 'No puede dejar vacío este campo'
  } else if (values.phoneNumber.length < 9) {
    errors.phoneNumber = 'El número de teléfono debe tener al menos 9 caracteres'
  } else if (!/^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Introduzca un número de teléfono válido (incluya código de país, por ejemplo: +34 666 666 666)'
  }

  return errors
}

export default function SignUpForm ({ createUser }) {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
      name: '',
      surname: '',
      phoneNumber: '',
      isOwner: false
    },
    onSubmit: values => {
      createUser(values)
    },
    validate

  })

  return (
    <div className='justify-center items-center m-auto p-10 bg-slate-300 md:w-96 w-full md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl'>Registro</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className='border border-solid border-slate-600' />
          {formik.touched.email && formik.errors.email ? <div className='text-red-600'>{formik.errors.email}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='password'>Contraseña</label>
          <input type='password' name='password' id='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className='border border-solid border-slate-600' />
          {formik.touched.password && formik.errors.password ? <div className='text-red-600'>{formik.errors.password}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='username'>Nombre de usuario</label>
          <input type='text' name='username' id='username' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} className='border border-solid border-slate-600' />
          {formik.touched.username && formik.errors.username ? <div className='text-red-600'>{formik.errors.username}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='name'>Nombre</label>
          <input type='text' name='name' id='name' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} className='border border-solid border-slate-600' />
          {formik.touched.name && formik.errors.name ? <div className='text-red-600'>{formik.errors.name}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='surname'>Apellidos</label>
          <input type='text' name='surname' id='surname' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.surname} className='border border-solid border-slate-600' />
          {formik.touched.surname && formik.errors.surname ? <div className='text-red-600'>{formik.errors.surname}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='phoneNumber'>Número de teléfono</label>
          <input type='text' name='phoneNumber' id='phoneNumber' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber} className='border border-solid border-slate-600' />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className='text-red-600'>{formik.errors.phoneNumber}</div> : null}
        </div>
        <div className='flex flex-row items-center gap-x-4'>
          <label htmlFor='isOwner'>¿Eres propietario?</label>
          <input type='checkbox' name='isOwner' id='isOwner' value={formik.values.isOwner} onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </div>
        <div className='flex items-center justify-center'>
          <button type='submit' className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-3/5 '>Registrarse</button>
        </div>
      </form>
    </div>
  )
}
