import { useFormik } from 'formik'
import { useState } from 'react'
import { Navigation, BasicInfo, Location, Features, Images, validate } from './PropertyFields'

export default function PropertyForm ({ createProperty }) {
  const [step, setStep] = useState(0)

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      street: '',
      town: '',
      city: '',
      country: '',
      zipCode: '',
      propertyType: '',
      propertySize: '',
      numberOfBathrooms: '',
      numberOfBedrooms: '',
      furniture: '',
      parking: '',
      airConditioning: '',
      heating: '',
      images: []
    },
    onSubmit: values => {
      createProperty(values)
    },
    validateOnBlur: true,
    validateOnChange: false,

    validate: validate(step)

  })

  const fieldGroups = [
    // eslint-disable-next-line react/jsx-key
    <BasicInfo formik={formik} />,
    // eslint-disable-next-line react/jsx-key
    <Location formik={formik} />,
    // eslint-disable-next-line react/jsx-key
    <Features formik={formik} />,
    // eslint-disable-next-line react/jsx-key
    <Images formik={formik} />

  ]

  return (
    <div className=' m-auto p-10 bg-slate-300 w-full md:w-3/5 md:rounded-2xl md:my-5  '>
      <h1 className='font-bold text-center text-2xl md:text-5xl mb-2'>Nuevo anuncio 🆕</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
        {fieldGroups[step]}

        <Navigation step={step} setStep={setStep} fieldGroups={fieldGroups} formik={formik} />

      </form>
    </div>
  )
}
