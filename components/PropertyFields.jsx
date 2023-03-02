/* eslint-disable no-extra-boolean-cast */

const Title = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='title'>Título</label>
      <input type='text' name='title' id='title' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title} className='border border-solid border-slate-600' />
      {formik.touched.title && formik.errors.title ? <div className='text-red-600'>{formik.errors.title}</div> : null}
    </div>
  )
}

const Description = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='description'>Descripción</label>
      <textarea name='description' id='description' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} className='border border-solid border-slate-600' />
      {formik.touched.description && formik.errors.description ? <div className='text-red-600'>{formik.errors.description}</div> : null}
    </div>
  )
}
const Price = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='price'>Precio mensual (total)</label>
      <input type='number' name='price' id='price' min='0' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.price} className='border border-solid border-slate-600 w-40 ' />
      {formik.touched.price && formik.errors.price ? <div className='text-red-600'>{formik.errors.price}</div> : null}
    </div>
  )
}

const Street = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='street'>Dirección</label>
      <input type='text' name='street' id='street' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.street} className='border border-solid border-slate-600' placeholder='Avda. Reina Mercedes, 19(A) Es:A Pl:06 Pt:03' />
      {formik.touched.street && formik.errors.street ? <div className='text-red-600'>{formik.errors.street}</div> : null}
    </div>
  )
}

const City = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='city'>Población / Ciudad</label>
      <input type='text' name='city' id='city' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city} className='border border-solid border-slate-600' placeholder='Sevilla' />
      {formik.touched.city && formik.errors.city ? <div className='text-red-600'>{formik.errors.city}</div> : null}
    </div>
  )
}

const Country = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='country'>País</label>
      <input type='text' name='country' id='country' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.country} className='border border-solid border-slate-600' placeholder='España' />
      {formik.touched.country && formik.errors.country ? <div className='text-red-600'>{formik.errors.country}</div> : null}
    </div>
  )
}

const ZipCode = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1 '>
      <label htmlFor='zipCode'>Código postal</label>
      <input type='text' name='zipCode' id='zipCode' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.zipCode} className='border border-solid border-slate-600 w-52' placeholder='41012' />
      {formik.touched.zipCode && formik.errors.zipCode ? <div className='text-red-600'>{formik.errors.zipCode}</div> : null}
    </div>
  )
}

const PropertyType = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='propertyType'>Tipo de inmueble</label>
      <select name='propertyType' id='propertyType' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.propertyType} className='border border-solid border-slate-600'>
        <option value='' disabled>-- Selecciona una opción --</option>
        <option value='Apartamento'>Apartamento</option>
        <option value='Casa'>Casa</option>
        <option value='Villa'>Villa</option>
        <option value='Estudio'>Estudio</option>
      </select>
      {formik.touched.propertyType && formik.errors.propertyType ? <div className='text-red-600'>{formik.errors.propertyType}</div> : null}
    </div>
  )
}

const PropertySize = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='propertySize'>Tamaño del inmueble (en m<sup>2</sup>)</label>
      <input type='number' name='propertySize' id='propertySize' min='1' placeholder='Introduzca la superficie de su inmueble' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.propertySize} className='border border-solid border-slate-600' />
      {formik.touched.propertySize && formik.errors.propertySize ? <div className='text-red-600'>{formik.errors.propertySize}</div> : null}
    </div>
  )
}

const NumberOfBathrooms = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='numberOfBathrooms'>Número de baños</label>
      <input type='number' name='numberOfBathrooms' id='numberOfBathrooms' min='1' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.numberOfBathrooms} className='border border-solid border-slate-600' placeholder='Introduzca los baños de su inmueble' />
      {formik.touched.numberOfBathrooms && formik.errors.numberOfBathrooms ? <div className='text-red-600'>{formik.errors.numberOfBathrooms}</div> : null}
    </div>
  )
}

const NumberOfBedrooms = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='numberOfBedrooms'>Número de habitaciones</label>
      <input type='number' name='numberOfBedrooms' id='numberOfBedrooms' min='1' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.numberOfBedrooms} className='border border-solid border-slate-600' placeholder='Introduzca las habitaciones de su inmueble' />
      {formik.touched.numberOfBedrooms && formik.errors.numberOfBedrooms ? <div className='text-red-600'>{formik.errors.numberOfBedrooms}</div> : null}
    </div>
  )
}

const Furniture = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='furniture'>Estado</label>
      <select name='furniture' id='furniture' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.furniture} className='border border-solid border-slate-600'>
        <option value='' disabled>-- Selecciona una opción --</option>
        <option value='Amueblado'>Amueblado</option>
        <option value='Semi-amueblado'>Semi-amueblado</option>
        <option value='Sin amueblar'>Sin amueblar</option>
      </select>
      {formik.touched.furniture && formik.errors.furniture ? <div className='text-red-600'>{formik.errors.furniture}</div> : null}
    </div>
  )
}

const Parking = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='parking'>Parking</label>
      <select name='parking' id='parking' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.parking} className='border border-solid border-slate-600'>
        <option value='' disabled>-- Selecciona una opción --</option>
        <option value='Garaje'>Garaje</option>
        <option value='Parking'>Parking</option>
        <option value='Sin parking'>Sin parking</option>
      </select>
      {formik.touched.parking && formik.errors.parking ? <div className='text-red-600'>{formik.errors.parking}</div> : null}
    </div>
  )
}

const AirConditioning = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='airConditioning'>Aire acondicionado</label>
      <select name='airConditioning' id='airConditioning' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.airConditioning} className='border border-solid border-slate-600'>
        <option value='' disabled>-- Selecciona una opción --</option>
        <option value='true'>Si</option>
        <option value='false'>No</option>
      </select>
      {formik.touched.airConditioning && formik.errors.airConditioning ? <div className='text-red-600'>{formik.errors.airConditioning}</div> : null}
    </div>
  )
}

const Heating = ({ formik }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <label htmlFor='heating'>Calefacción</label>
      <select name='heating' id='heating' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.heating} className='border border-solid border-slate-600'>
        <option value='' disabled>-- Selecciona una opción --</option>
        <option value='true'>Si</option>
        <option value='false'>No</option>
      </select>
      {formik.touched.heating && formik.errors.heating ? <div className='text-red-600'>{formik.errors.heating}</div> : null}
    </div>
  )
}

const BasicInfo = ({ formik }) => {
  return (
    <>
      <h1 className='font-bold text-center text-xl mb-2'>Datos básicos</h1>
      <Title formik={formik} />
      <Description formik={formik} />
      <Price formik={formik} />
    </>
  )
}

const Location = ({ formik }) => {
  return (
    <>
      <h1 className='font-bold text-center text-xl md:text-3xl mb-2'>Ubicación</h1>
      <span className='text-center bg-green-100 font-bold px-4 py-2'>Importante: introduce también el número de domicilio. Esto no será visible en la oferta pero nos ayudará a detectar anuncios duplicados. Separa el número de la dirección con una ","</span>
      <Street formik={formik} />
      <City formik={formik} />
      <Country formik={formik} />
      <ZipCode formik={formik} />
    </>
  )
}

const Features = ({ formik }) => {
  // FIXME: not spreading errores from the formik object to the fields
  return (
    <>
      <h1 className='font-bold text-center text-xl mb-2'>Características</h1>
      <PropertyType formik={formik} />
      <PropertySize formik={formik} />
      <NumberOfBathrooms formik={formik} />
      <NumberOfBedrooms formik={formik} />
      <Furniture formik={formik} />
      <Parking formik={formik} />
      <AirConditioning formik={formik} />
      <Heating formik={formik} />
    </>
  )
}

const validate = (step) => (values) => {
  const errors = {}
  // i want to theck only the fields of the current step, but if no step is passed, i want to check all the fields

  if (step === 0 || typeof step === 'undefined') {
    if (!values.title) {
      errors.title = 'No puede dejar vacío este campo'
    } else if (values.title.length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres'
    } else if (values.title.length > 50) {
      errors.title = 'El título no puede tener más de 50 caracteres'
    }

    if (!values.description) {
      errors.description = 'No puede dejar vacío este campo'
    } else if (values.description.length < 3) {
      errors.description = 'La descripción debe tener al menos 3 caracteres'
    } else if (values.description.length > 500) {
      errors.description = 'La descripción no puede tener más de 500 caracteres'
    }

    if (!values.price) {
      errors.price = 'No puede dejar vacío este campo'
    } else if (values.price < 0) {
      errors.price = 'El precio no puede ser negativo'
    } else if (typeof values.price !== 'number') {
      errors.price = 'El precio debe ser un número'
    }
  }

  if (step === 1 || typeof step === 'undefined') {
    // maybe we can check if the city is in the country and if the country is in the world
    if (!values.street) {
      errors.street = 'No puede dejar vacío este campo'
    } else if (!/^[^,\d]+(?:\d+\s*)*,\s*\d+/.test(values.street)) {
      errors.street = 'Introduzca una dirección válida (con número)'
    }
    if (!values.city) {
      errors.city = 'No puede dejar vacío este campo'
    }
    if (!values.country) {
      errors.country = 'No puede dejar vacío este campo'
    }
    if (!values.zipCode) {
      errors.zipCode = 'No puede dejar vacío este campo'
    } else if (!/^[a-zA-Z0-9- ]{3,20}$/.test(values.zipCode)) {
      errors.zipCode = 'El código postal no es válido'
    }
  }

  if (step === 2 || typeof step === 'undefined') {
    if (!values.propertyType) {
      errors.propertyType = 'No puede dejar vacío este campo'
    } else if (values.propertyType !== 'Apartamento' && values.propertyType !== 'Casa' && values.propertyType !== 'Estudio' && values.propertyType !== 'Villa') {
      errors.propertyType = 'El tipo de propiedad no es válido'
    }

    if (!values.propertySize) {
      errors.propertySize = 'No puede dejar vacío este campo'
    } else if (values.propertySize < 1) {
      errors.propertySize = 'El tamaño de la propiedad debe ser positivo'
    }

    if (!values.numberOfBathrooms) {
      errors.numberOfBathrooms = 'No puede dejar vacío este campo'
    } else if (values.numberOfBathrooms < 1) {
      errors.numberOfBathrooms = 'El número de baños debe ser positivo'
    } else if (typeof values.numberOfBathrooms !== 'number') {
      errors.numberOfBathrooms = 'Introduzca un número'
    }

    if (!values.numberOfBedrooms) {
      errors.numberOfBedrooms = 'No puede dejar vacío este campo'
    } else if (values.numberOfBedrooms < 1) {
      errors.numberOfBedrooms = 'El número de habitaciones debe ser positivo'
    } else if (typeof values.numberOfBedrooms !== 'number') {
      errors.numberOfBedrooms = 'Introduzca un número'
    }

    if (!values.furniture) {
      errors.furniture = 'No puede dejar vacío este campo'
    } else if (values.furniture !== 'Amueblado' && values.furniture !== 'Semi-amueblado' && values.furniture !== 'Sin amueblar') {
      errors.furniture = 'Introduzca un valor válido'
    }

    if (!values.parking) {
      errors.parking = 'No puede dejar vacío este campo'
    } else if (values.parking !== 'Garaje' && values.parking !== 'Parking' && values.parking !== 'Sin parking') {
      errors.parking = 'Introduzca un valor válido'
    }

    if (!values.airConditioning) {
      errors.airConditioning = 'No puede dejar vacío este campo'
    } else if (values.airConditioning !== 'true' && values.airConditioning !== 'false') {
      errors.airConditioning = 'Introduzca un valor válido'
    }

    if (!values.heating) {
      errors.heating = 'No puede dejar vacío este campo'
    } else if (values.heating !== 'true' && values.heating !== 'false') {
      errors.heating = 'Introduzca un valor válido'
    }
  }

  return errors
}

const Navigation = ({ step, setStep, fieldGroups, formik }) => {
  const handleNext = () => {
    formik.validateForm(formik.values) // this is a promise
      .then((errors) => {
        if (Object.keys(errors).length === 0) {
          setStep(step + 1)
        } else {
          // if there are errors, they must be shown
          const touchedFields = Object.keys(errors).reduce((touched, key) => {
            touched[key] = true
            return touched
          }, {})

          formik.setTouched(touchedFields)
        }
      })
  }

  return (
    <div className={`flex items-center  ${step === 0 ? 'justify-center' : 'justify-between md:justify-around'}`}>

      {
        step > 0 &&
          <button type='button' className='bg-slate-700 hover:bg-green-200 hover:border-black text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-24 ' onClick={() => { setStep(step - 1) }}>Atrás</button>
      }
      {
        step < fieldGroups.length - 1 &&

          <button type='button' className='bg-slate-700 hover:bg-green-200 hover:border-black text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-44' onClick={handleNext}>Siguiente</button>

      }
      {
        step === fieldGroups.length - 1 &&
          <div className='flex items-center justify-center'>
            <button type='submit' className='bg-slate-700 hover:bg-green-300 hover:border-black text-white hover:text-black py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold w-60 '>Publicar anuncio</button>
          </div>
      }
    </div>

  )
}

module.exports = {
  BasicInfo,
  Location,
  Features,
  Navigation,
  validate
}