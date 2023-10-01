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
  const [stats, setStats] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getEvaluation () {
      if (userObject.isOwner && user.isOwner) {
        router.push('/403')
        return
      }

      let evaluation

      if (userObject.isOwner && !user.isOwner) { // evaluating my landlord
        const { property } = await usersService.getLivingProperty(user.username) // the property I live in

        if (property?.owner.id === userObject.id) { // check if the user to be evaluated is my landlord
          evaluation = await evaluationsService.getEvaluation(user.id, userObject.id)
        } else {
          router.push('/403')
        }
      }

      if (!userObject.isOwner && user.isOwner) { // evaluating my tenant
        const { property } = await usersService.getLivingProperty(userObject.username) // the property the user lives in

        if (property?.owner.id === user.id) {
          evaluation = await evaluationsService.getEvaluation(user.id, userObject.id)
        } else {
          router.push('/403')
        }
      }

      if (!userObject.isOwner && !user.isOwner) { // evaluating my roommate
        const { property } = await usersService.getLivingProperty(user.username) // the property I live in
        if (!property) {
          router.push('/403')
          return
        }

        const tenantIds = property?.tenants.map(tenant => tenant.user.id)
        if (tenantIds.includes(userObject.id)) {
          evaluation = await evaluationsService.getEvaluation(user.id, userObject.id)
        } else {
          router.push('/403')
        }
      }

      setEvaluation(evaluation?.evaluation)
    }

    async function getAvailableStats () {
      const stats = await evaluationsService.getStats(user.id, userObject.id)
      setStats(stats)
    }

    if (done) {
      if (!user) router.push('/')
      else {
        if (userObject.username === user.username) {
          router.push('/403')
          return
        } else if (user.isOwner && userObject.isOwner) {
          router.push('/403')
          return
        }
      }
      getEvaluation()
      getAvailableStats()
      setLoading(false)
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
        console.log(error)
        if (error.response.data.error === 'The author does not live with the user at this moment') {
          showMessage('No vives con este compañero de piso. No puedes evaluarlo.', 'error', setMessage, 5000, true)
        // } else if (error.response.data.error === 'author does not live in any property') {
        //   showMessage('No vives en ninguna propiedad. No puedes evaluar a ningún compañero de piso.', 'error', setMessage, 5000, true)
        } else if (error.response.data.error === 'The author and the user have not been living together for 30 days') {
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
        console.log(error)
        if (error.response.data.error === 'you have to wait 7 days to evaluate the same person again') {
          showMessage('Ya has evaluado a este usuario. Tienes que esperar 7 días para volver a evaluarlo.', 'error', setMessage, 5000, true)
        } else {
          showMessage('Ha ocurrido un error inesperado. Por favor, inténtelo más tarde.', 'error', setMessage, 5000, true)
        }
      })
  }

  const formik = useFormik({
    initialValues: {
      ...stats?.reduce((acc, stat) => {
        acc[stat.name] = evaluation?.stats.find(s => s.stat.name === stat.name)?.value || 3
        return acc
      }, {})
    },

    enableReinitialize: true,

    onSubmit: values => { evaluation ? updateEvaluation(values) : evaluateUser(values) }

  })

  return (done && user?.username !== userObject.username && !isLoading) && (
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
        {stats
          ? (
            <>
              {evaluation && <p className='text-xl'>Última evaluación: {new Date(evaluation.lastEdit).toLocaleDateString('es-ES')}</p>}
              <form onSubmit={formik.handleSubmit} className='flex flex-col p-5 sm:p-10 w-full  sm:w-[90%] bg-gray-100 gap-10 rounded-xl border-2 border-slate-700 shadow-md'>

                {stats.map(stat => (
                  <div className='flex flex-col' key={stat.id}>
                    {stat.name === 'Ruido' &&
                    (
                      <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mb-5 rounded' role='alert'>
                        <p className='font-bold text-xl'>Atención</p>
                        <p className='text-xl'>
                          Valora ruido como ausencia del mismo. Por ejemplo, si tu compañero de piso no hace ruido, valóralo con un 5. De esta forma, no se verían afectadas las puntuaciones globales.
                        </p>
                      </div>

                    )}
                    <label htmlFor={stat.name} className='text-xl'>{stat.name}</label>
                    <input type='range' name={stat.name} min='0' max='5' value={formik.values[stat.name]} onChange={formik.handleChange} className='accent-blue-700 w-full' />
                    <div className='w-full flex justify-between mt-1'>
                      <span className='text-xl'>0</span>
                      <span className='text-xl'>1</span>
                      <span className='text-xl'>2</span>
                      <span className='text-xl'>3</span>
                      <span className='text-xl'>4</span>
                      <span className='text-xl'>5</span>
                    </div>
                  </div>
                ))}

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
