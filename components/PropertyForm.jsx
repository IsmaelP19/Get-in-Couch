import { useFormik } from 'formik'
import { useState } from 'react'
import { Navigation, BasicInfo, Location, Features, Images, validate } from './PropertyFields'
import propertiesService from '../services/properties'
import { showMessage } from '../utils/utils'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'

export default function PropertyForm ({ property }) {
  const [step, setStep] = useState(0)
  const { user, setMessage } = useAppContext()
  const router = useRouter()

  const updateProperty = (propertyObject) => {
    propertiesService.update(property.id, propertyObject)
      .then(response => {
        showMessage('Se ha actualizado correctamente el anuncio de la propiedad 😎', 'success', setMessage, 4000)
        setTimeout(() => {
          // we will redirect to the property page and we will pass the propertyObject to prevent another API call
          router.push(`/properties/${property.id}`)
        }, 4000)
      })
      .catch(error => {
        if (error.request.response.includes('E11000 duplicate key error collection: production.properties index: location.street_1_location.city_1_location.country_1_location.zipCode_1 dup key: ')) {
          showMessage('Ya existe un anuncio con esa dirección. Comprueba que has introducido el número del domicilio correctamente.', 'info', setMessage, 4000)
        } else if (error.response.status === 413) {
          showMessage('Has añadido demasiadas imágenes. Por favor, considere subir menos imágenes o intente reducir el tamaño de ellas.', 'info', setMessage, 6000)
        } else {
          showMessage('Ha ocurrido un error al actualizar el anuncio. Por favor, inténtalo de nuevo.', 'error', setMessage, 4000)
        }
      })
  }

  const createProperty = (propertyObject) => {
    propertyObject.owner = user.id

    propertiesService.create(propertyObject)
      .then(response => {
        showMessage('Se ha creado correctamente el anuncio de la propiedad 😎', 'success', setMessage, 4000)
        setTimeout(() => {
          router.push(`/properties/${response.id}`)
        }, 4000)
      })
      .catch(error => {
        if (error.request.response.includes('E11000 duplicate key error collection: production.properties index: location.street_1_location.city_1_location.country_1_location.zipCode_1 dup key: ')) {
          showMessage('Ya existe un anuncio con esa dirección. Comprueba que has introducido el número del domicilio correctamente.', 'info', setMessage, 4000)
        } else {
          showMessage('Ha ocurrido un error al crear el anuncio. Por favor, inténtalo de nuevo.', 'error', setMessage, 4000)
        }
      })
  }

  const initialValues = {
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    street: property?.location.street || '',
    town: property?.location.town || '',
    city: property?.location.city || '',
    country: property?.location.country || '',
    zipCode: property?.location.zipCode || '',
    propertyType: property?.features.propertyType || '',
    propertySize: property?.features.propertySize || '',
    numberOfBathrooms: property?.features.numberOfBathrooms || '',
    numberOfBedrooms: property?.features.numberOfBedrooms || '',
    furniture: property?.features.furniture || '',
    parking: property?.features.parking || '',
    airConditioning: property?.features.airConditioning || '',
    heating: property?.features.heating || '',
    images: property?.images || []
  }

  const formik = useFormik({
    initialValues,
    onSubmit: values => { property ? updateProperty(values) : createProperty(values) },

    validateOnBlur: true,
    validateOnChange: false,
    validate: validate(step)
  })

  const fieldGroups = [
    <BasicInfo key='basic-info' formik={formik} />,
    <Location key='location' formik={formik} />,
    <Features key='features' formik={formik} />,
    <Images key='images' formik={formik} />
  ]

  return (
    <div className=' m-auto p-10 bg-slate-300 w-full md:w-3/5 md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl md:text-5xl mb-2'>{property ? 'Editar' : 'Nuevo'} anuncio 🆕</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
        {fieldGroups[step]}

        <Navigation step={step} setStep={setStep} fieldGroups={fieldGroups} formik={formik} />

      </form>
    </div>
  )
}
