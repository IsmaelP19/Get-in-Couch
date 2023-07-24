import { useAppContext } from '../context/state'
import { useFormik } from 'formik'
// import { useEffect, useRef } from 'react'
// import io from 'socket.io-client'
import messagesService from '../services/messages'

export default function MessageForm ({ messages, setMessages, conversation }) {
  const { user } = useAppContext()

  const createMessage = (messageObject) => {
    messageObject.author = user?.id
    messageObject.receiver = conversation.participants[0].id

    if (messageObject.message === '') return

    messagesService.create(messageObject)
      .then(response => {
        response.author = user
        response.date = new Date(response.date).toLocaleString()
        setMessages([...messages, response])
      })
      .catch(error => {
        console.log(error)
      })
  }

  const initialValues = {
    message: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
      createMessage(values)
      formik.resetForm()
    }

  })

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-row justify-between gap-4 p-2 bottom-0 bg-slate-200 rounded-ee-md'>
      <input type='text' className='w-full border px-5 border-slate-300 rounded-full' id='message' name='message' onChange={formik.handleChange} value={formik.values.message} autoComplete='off' />
      <button type='submit' className='bg-green-600 rounded-full px-5 py-3 text-white font-bold hover:bg-green-800  active:bg-green-800  '>Enviar</button>
    </form>
  )
}
