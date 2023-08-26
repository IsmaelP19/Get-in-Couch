import { useAppContext } from '../../context/state'
import { useFormik } from 'formik'
import { showMessage } from '../../utils/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import evaluationsService from '../../services/evaluations'
import usersService from '../../services/users'
import Roommate from '../../components/Roommate'
import Notification from '../../components/Notification'
import { Loading } from '@nextui-org/react'

export default function Evaluate ({ userObject }) {
  const { user, done, message, setMessage } = useAppContext()
  const [evaluation, setEvaluation] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getEvaluation () {
      const property = await usersService.getLivingProperty(user.username)
      const tenantIds = property?.property.tenants.map(tenant => tenant.user.id)
      if (tenantIds.includes(userObject.id)) {
        const { evaluation } = await evaluationsService.getEvaluation(user.id, userObject.id)
        setEvaluation(evaluation)
        setLoading(false)
      } else {
        router.push('/403')
      }
    }

    if (done) {
      if (!user) router.push('/')
      else if (user.isOwner) router.push('/403')
      else {
        if (userObject.username === user.username) {
          router.push('/403')
        }
        getEvaluation()
      }
    }
  }, [router, done])

  const evaluateUser = (evaluationObject) => {
    evaluationObject.author = user?.id
    evaluationObject.user = userObject?.id

    evaluationsService.evaluateUser(evaluationObject)
      .then(response => {
        showMessage('Se ha creado correctamente la evaluación 😎', 'success', setMessage, 4000, true)
        setTimeout(() => {
          router.push('/state')
        }, 4000)
      })
      .catch(error => {
        if (error.response.data.error === 'author does not live with the user at this moment') {
          showMessage('No vives con este compañero de piso. No puedes evaluarlo.', 'error', setMessage, 5000, true)
        } else if (error.response.data.error === 'author does not live in any property') {
          showMessage('No vives en ninguna propiedad. No puedes evaluar a ningún compañero de piso.', 'error', setMessage, 5000, true)
        } else if (error.response.data.error === 'the author and the user have not been living together for 30 days') {
          showMessage('No llevas 30 días viviendo con este compañero de piso. No puedes evaluarlo.', 'error', setMessage, 5000, true)
        } else {
          showMessage('Ha ocurrido un error inesperado. Por favor, inténtelo más tarde.', 'error', setMessage, 5000, true)
        }
      })
  }

  const updateEvaluation = (evaluationObject) => {
    evaluationObject.author = user?.id

    evaluationsService.updateEvaluation(evaluationObject, userObject?.username)
      .then(response => {
        showMessage('Se ha actualizado correctamente la evaluación 😎', 'success', setMessage, 4000, true)
        setTimeout(() => {
          router.push('/state')
        }, 4000)
      })
      .catch(error => {
        if (error.response.data.error === 'you have to wait 7 days to evaluate the same roommate again') {
          showMessage('Ya has evaluado a este compañero de piso. Tienes que esperar 7 días para volver a evaluarlo.', 'error', setMessage, 5000, true)
        } else {
          showMessage('Ha ocurrido un error inesperado. Por favor, inténtelo más tarde.', 'error', setMessage, 5000, true)
        }
      })
  }

  const formik = useFormik({
    initialValues: {
      cleaning: evaluation?.cleaning ?? 3,
      communication: evaluation?.communication ?? 3,
      tidyness: evaluation?.tidyness ?? 3,
      respect: evaluation?.respect ?? 3,
      noisy: evaluation?.noisy ?? 3
    },
    enableReinitialize: true,

    onSubmit: values => { evaluation ? updateEvaluation(values) : evaluateUser(values) }

  })

  return (done && !user?.isOwner && user?.username !== userObject.username) && (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <div className='flex flex-col items-center justify-center gap-5 my-5 w-[90%]'>
        <Notification message={message[0]} type={message[1]} />
        <h1 className='text-3xl font-bold p-5 text-center'>Evaluar compañero de piso</h1>
        <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
          <p className='font-bold text-xl'>Atención</p>
          <p className='text-xl'>
            Una vez realices la evaluación, no podrás modificarla hasta pasados 7 días.
          </p>
        </div>
        <Roommate user={userObject} lastEvaluated={evaluation?.lastEdit} />
        {!isLoading
          ? (
            <>
              {evaluation && <p className='text-xl'>Última evaluación: {new Date(evaluation.lastEdit).toLocaleDateString('es-ES')}</p>}
              <form onSubmit={formik.handleSubmit} className='flex flex-col p-5 sm:p-10 w-full  sm:w-[90%] bg-gray-200 gap-10 rounded-xl border-2 border-slate-700 shadow-md'>
                <div className='flex flex-col'>
                  <label htmlFor='cleaning' className='text-xl'>Limpieza</label>
                  <input
                    type='range'
                    name='cleaning'
                    min='0'
                    max='5'
                    step={1}
                    value={formik.values.cleaning}
                    onChange={formik.handleChange}
                    className='accent-slate-700 w-full'
                  />
                  <div className='w-full flex justify-between mt-1'>
                    <span className='text-xl'>0</span>
                    <span className='text-xl'>1</span>
                    <span className='text-xl'>2</span>
                    <span className='text-xl'>3</span>
                    <span className='text-xl'>4</span>
                    <span className='text-xl'>5</span>
                  </div>

                </div>

                <div className='flex flex-col'>
                  <label htmlFor='communication' className='text-xl'>Comunicación</label>
                  <input type='range' name='communication' min='0' max='5' value={formik.values.communication} onChange={formik.handleChange} className='accent-slate-700' />
                  <div className='w-full flex justify-between mt-1'>
                    <span className='text-xl'>0</span>
                    <span className='text-xl'>1</span>
                    <span className='text-xl'>2</span>
                    <span className='text-xl'>3</span>
                    <span className='text-xl'>4</span>
                    <span className='text-xl'>5</span>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='tidyness' className='text-xl'>Ordenado</label>
                  <input type='range' name='tidyness' min='0' max='5' value={formik.values.tidyness} onChange={formik.handleChange} className='accent-slate-700' />
                  <div className='w-full flex justify-between mt-1'>
                    <span className='text-xl'>0</span>
                    <span className='text-xl'>1</span>
                    <span className='text-xl'>2</span>
                    <span className='text-xl'>3</span>
                    <span className='text-xl'>4</span>
                    <span className='text-xl'>5</span>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='respect' className='text-xl'>Respeto</label>
                  <input type='range' name='respect' min='0' max='5' value={formik.values.respect} onChange={formik.handleChange} className='accent-slate-700' />
                  <div className='w-full flex justify-between mt-1'>
                    <span className='text-xl'>0</span>
                    <span className='text-xl'>1</span>
                    <span className='text-xl'>2</span>
                    <span className='text-xl'>3</span>
                    <span className='text-xl'>4</span>
                    <span className='text-xl'>5</span>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='noisy' className='text-xl'>Ruido</label>
                  <input type='range' name='noisy' min='0' max='5' value={formik.values.noisy} onChange={formik.handleChange} className='accent-red-700' />
                  <div className='w-full flex justify-between mt-1'>
                    <span className='text-xl'>0</span>
                    <span className='text-xl'>1</span>
                    <span className='text-xl'>2</span>
                    <span className='text-xl'>3</span>
                    <span className='text-xl'>4</span>
                    <span className='text-xl'>5</span>
                  </div>
                </div>

                <button type='submit' className='px-5 py-1 w-fit rounded-full self-center bg-slate-700 border-2 border-black text-white hover:bg-green-700 duration-200'>Evaluar</button>

              </form>
            </>
            )
          : <Loading color='primary' />}

      </div>
    </div>
  )
}

export async function getServerSideProps (context) {
  const { username } = context.query
  let user = {}
  try {
    user = await usersService.getUser(username)
  } catch (error) {
    console.log(error)
    if (error.response.data.error === 'user not found') {
      context.res.writeHead(302, { Location: '/404' })
      context.res.end()
    }
  }

  return {
    props: { title: `Evaluar a ${user.username}`, userObject: user }
  }
}
