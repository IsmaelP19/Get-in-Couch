import { useFormik } from 'formik'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'
import { showMessage } from '../utils/utils'
import userService from '../services/users'
import { MdOutlineDelete } from 'react-icons/md'

export default function SignUpForm ({ userObject }) {
  const { setUser, setMessage } = useAppContext()
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState()
  const [profilePicture, setProfilePicture] = useState('')
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (userObject) {
      setPhoneNumber(userObject.phoneNumber)
      setProfilePicture(userObject.profilePicture)
    }
  }, [userObject])

  const handleChange = (event) => {
    return new Promise((resolve) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = new Image()
          img.src = event.target.result
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const MAX_WIDTH = 1280
            const MAX_HEIGHT = 720
            let width = img.width
            let height = img.height
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            const base64Image = canvas.toDataURL('image/jpeg', 0.8)
            resolve(base64Image)
          }
          img.src = event.target.result
        }
        reader.readAsDataURL(file)
      }
    }).then((base64Image) => {
      formik.setFieldValue('profilePicture', base64Image)
      setProfilePicture(base64Image)
    }).catch((error) => {
      console.log(error)
      showMessage('Ha ocurrido un error al subir la imagen 😢', 'error', setMessage, 4000)
    })
  }

  const handleDelete = () => {
    formik.setFieldValue('profilePicture', '')
    setProfilePicture('')
    imageInputRef.current.value = ''
  }

  const createUser = (userObject) => {
    userService.create(userObject)
      .then(returnedUser => {
        showMessage('Se ha registrado satisfactoriamente. Ya puede iniciar sesión 😎', 'success', setMessage, 4000, true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      })
      .catch(error => {
        if (error.response.data.error.includes('`email` to be unique')) {
          showMessage('El email introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000, true)
        } else if (error.response.data.error.includes('`username` to be unique')) {
          showMessage('El nombre de usuario introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000, true)
        } else if (error.response.data.error.includes('`phoneNumber` to be unique')) {
          showMessage('El número de teléfono introducido ya está registrado. ¿Por qué no inicias sesión? 🤔', 'info', setMessage, 9000, true)
        } else {
          showMessage('Ha ocurrido un error al registrar al usuario 😢. Por favor, prueba más tarde ⌛', 'error', setMessage, 9000, true)
        }
      })
  }

  const updateUser = (updatedUserObject) => {
    userService.update(userObject.username, updatedUserObject)
      .then(returnedUser => {
        showMessage('Se ha actualizado tu perfil satisfactoriamente 😎', 'success', setMessage, 4000, true)
        if (userObject.username !== updatedUserObject.username) {
          const localStorageUser = JSON.parse(localStorage.getItem('loggedUser'))
          localStorageUser.username = updatedUserObject.username
          localStorage.setItem('loggedUser', JSON.stringify(localStorageUser))
        }
        updatedUserObject.followed = userObject.followed
        updatedUserObject.followers = userObject.followers
        setUser(updatedUserObject)

        setTimeout(() => {
          router.push(`/profile/${updatedUserObject.username.toLowerCase()}`)
        }, 3000)
      })
      .catch(error => {
        if (error.response.data.error.includes('expected `email` to be unique')) {
          showMessage('El email introducido ya está registrado. ¿Tal vez te hayas registrado en otro momento? 🤔', 'info', setMessage, 9000, true)
        } else if (error.response.data.error.includes('expected `username` to be unique')) {
          showMessage('El nombre de usuario introducido ya está registrado. ¡Prueba con más creatividad! 🤔🎨', 'info', setMessage, 9000, true)
        } else if (error.response.data.error.includes('expected `phoneNumber` to be unique')) {
          showMessage('El número de teléfono introducido ya está registrado. ¿Tal vez te hayas registrado en otro momento? 🤔', 'info', setMessage, 9000, true)
        } else {
          showMessage('Ha ocurrido un error al actualizar tu perfil 😢. Por favor, prueba más tarde ⌛', 'error', setMessage, 9000, true)
        }
      })
  }

  const validate = (values, phoneNumber) => {
    const errors = {}
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!values.email) {
      errors.email = 'No puede dejar vacío este campo'
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Introduzca una dirección de correo electrónico válida'
    }

    if (!userObject) {
      if (!values.password) {
        errors.password = 'No puede dejar vacío este campo'
      } else if (values.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(values.password)) {
        errors.password = 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.'
      }

      if (!values.passwordConfirmation) {
        errors.passwordConfirmation = 'No puede dejar vacío este campo'
      } else if (values.passwordConfirmation !== values.password) {
        errors.passwordConfirmation = 'Las contraseñas no coinciden'
      }
    } else { // Updating profile
      if (values.password) {
        if (values.password.length < 8) {
          errors.password = 'La contraseña debe tener al menos 8 caracteres'
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(values.password)) {
          errors.password = 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.'
        } else if (values.passwordConfirmation !== values.password) {
          errors.passwordConfirmation = 'Las contraseñas no coinciden'
        }
      }
    }

    if (!values.username) {
      errors.username = 'No puede dejar vacío este campo'
    } else if (values.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    } else if (!/^[a-zA-Z0-9_&.]+$/.test(values.username)) {
      errors.username = 'El nombre de usuario solo puede contener letras y números (sin espacios ni caracteres especiales)'
    } else if (values.username.length > 20) {
      errors.username = 'El nombre de usuario no puede tener más de 20 caracteres'
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

    if (values.description?.length > 240) {
      errors.description = 'La descripción no puede tener más de 240 caracteres'
    }

    if (!phoneNumber) {
      errors.phoneNumber = 'No puede dejar vacío este campo'
    } else if (!isValidPhoneNumber(phoneNumber)) {
      errors.phoneNumber = 'El número introducido no es válido'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      email: userObject?.email || '',
      password: '', // won't retrieve it from the user object because it's hashed and it's not stored in the database
      passwordConfirmation: '', // won't retrieve it from the user object because it's hashed and it's not stored in the database
      username: userObject?.username || '',
      name: userObject?.name || '',
      surname: userObject?.surname || '',
      phoneNumber: userObject?.phoneNumber || '',
      isOwner: userObject?.isOwner || false,
      description: userObject?.description || '',
      profilePicture: userObject?.profilePicture || ''
    },
    onSubmit: values => {
      values.phoneNumber = phoneNumber
      userObject ? updateUser(values) : createUser(values)
    },
    validate (values) {
      return validate(values, phoneNumber)
    }

  })

  return (
    <div className='justify-center items-center m-auto p-10 bg-slate-300 md:w-96 w-full md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl mb-2'>{userObject ? 'Editar perfil' : 'Registro'}</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className='border border-solid border-slate-600' />
          {formik.touched.email && formik.errors.email ? <div className='text-red-600'>{formik.errors.email}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='password'>Contraseña</label>
          <input type='password' name='password' id='password' autoComplete='new-password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className='border border-solid border-slate-600' />
          {formik.touched.password && formik.errors.password ? <div className='text-red-600'>{formik.errors.password}</div> : null}
        </div>
        <div className='flex flex-col gap-y-1'>
          <label htmlFor='passwordCondfirmation'>Repite tu contraseña</label>
          <input type='password' name='passwordConfirmation' id='passwordConfirmation' autoComplete='new-password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.passwordConfirmation} className='border border-solid border-slate-600' />
          {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? <div className='text-red-600'>{formik.errors.passwordConfirmation}</div> : null}
        </div>

        <div className='flex flex-col gap-y-1'>
          <label htmlFor='username'>Nombre de usuario</label>
          <input type='text' name='username' id='username' onChange={(e) => formik.setFieldValue('username', e.target.value.toLowerCase())} onBlur={formik.handleBlur} value={formik.values.username} className='border border-solid border-slate-600' />
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
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            name='phoneNumber'
            id='phoneNumber'
            addInternationalOption={false}
            defaultCountry='ES'
            onBlur={formik.handleBlur}
            className='border border-solid border-slate-600'
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className='text-red-600'>{formik.errors.phoneNumber}</div> : null}
        </div>

        <div className='flex flex-col gap-y-1'>
          <label htmlFor='description'>Biografía</label>
          <textarea name='description' id='description' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} className='border border-solid border-slate-600' />
          {formik.touched.description && formik.errors.description ? <div className='text-red-600'>{formik.errors.description}</div> : null}
        </div>

        <div className='flex flex-col gap-y-3 mt-2'>
          <label htmlFor='profilePicture' className='bg-slate-200 text-center px-2 py-1 border-gray-600 border-2 font-bold active:bg-blue-400 '>Selecciona una imagen de perfil</label>
          <input type='file' ref={imageInputRef} name='profilePicture' id='profilePicture' onChange={handleChange} className='hidden' accept='image/*' title='' />
          {profilePicture && (
            <div className='flex flex-row items-center justify-center gap-3'>
              <img src={profilePicture} alt='Imagen de perfil' className='w-1/2 ' />
              <MdOutlineDelete size={30} className='text-red-600 hover:text-red-800 cursor-pointer' onClick={handleDelete} />

            </div>
          )}
        </div>

        <div className='flex flex-row items-center gap-x-4'>
          <label htmlFor='isOwner'>¿Eres propietario?</label>
          <input type='checkbox' name='isOwner' id='isOwner' value={formik.values.isOwner} checked={formik.values.isOwner} onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </div>
        <div className='flex items-center justify-center'>
          <button type='submit' className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-3/5 '>{userObject ? 'Actualizar' : 'Registrarse'}</button>
        </div>
      </form>
    </div>
  )
}
