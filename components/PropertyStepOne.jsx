import { Field, Form, Formik } from 'formik'
export default function PropertyStepOne (props) {
  return (
    <Formik>
      {() => (
        <Form>
          <p>Título</p>
          <Field name='title' />
          <p>Descripción</p>
          <Field name='description' />

          <button type='submit'>Siguiente</button>
        </Form>
      )}
    </Formik>
  )
}

export default function PropertyStepTwo (props) {
  return (
    <Formik>
      {() => (
        <Form>
          <p>Título</p>
          <Field name='title' />
          <p>Descripción</p>
          <Field name='description' />

          <button type='submit'>Siguiente</button>
        </Form>
      )}
    </Formik>
  )
}