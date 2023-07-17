import { useAppContext } from '../context/state'
import { showMessage } from '../utils/utils'
import commentsService from '../services/comments'
import { useFormik } from 'formik'
import propertiesService from '../services/properties'

const validate = (values) => {
  const errors = {}

  if (!values.content) {
    errors.content = 'No puede dejar vacío este campo'
  } else if (values.content.length < 50) {
    errors.content = 'El comentario debe tener al menos 50 caracteres'
  } else if (values.content.length > 1024) {
    errors.content = 'El comentario no puede tener más de 1024 caracteres. Por favor, sea más conciso.'
  }

  if (!values.rating || values.rating === 'Selecciona una puntuación') {
    errors.rating = 'No puede dejar vacío este campo'
  } else if (values.rating < 0 || values.rating > 5) {
    errors.rating = 'La puntuación debe estar entre 0 y 5'
  }

  return errors
}

export default function CommentForm ({ property, setComments, comments, setTotalComments, totalComments, setPage, page }) {
  const { user, setMessage } = useAppContext()

  const createComment = (commentObject) => {
    commentObject.user = user?.id
    commentObject.property = property.id

    commentsService.create(commentObject)
      .then(async response => {
        showMessage('Se ha creado correctamente el comentario 😎', 'success', setMessage, 4000)

        const newComment = response
        newComment.user = user

        // change to the first page of the comments Pagination component if the user is not in the first page
        if (page !== 1) {
          setPage(1)
          const newComments = await propertiesService.getCommentsByProperty(property.id)
          setComments([...newComments.comments])
          setTotalComments(newComments.total)
        } else { // if I am on page 1 I want to add the new comment to the comments array and delete the last one
          comments.unshift(newComment)
          setTotalComments(totalComments + 1)

          if (comments.length === 6) comments.pop()

          setComments([...comments])
        }
      })
      .catch(error => {
        if (!user) {
          showMessage('Debes iniciar sesión para poder comentar', 'error', setMessage, 4000)
        } else {
          console.log(error)
          showMessage('Ha ocurrido un error al crear el comentario. Por favor, inténtalo de nuevo.', 'error', setMessage, 4000)
        }
      })
  }

  const initialValues = {
    content: '',
    rating: 'Selecciona una puntuación'
  }

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
      createComment(values)
      formik.resetForm()
    },

    validateOnBlur: true,
    validateOnChange: false,
    validate
  })

  return (
    <form onSubmit={formik.handleSubmit} className='p-5 w-full flex flex-col gap-10 border-2 rounded-xl bg-blue-100 border-slate-900 mt-2'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='content' className='font-bold text-lg'>Detalla tu comentario</label>
        <textarea className='rounded-xl p-2' placeholder='Escribe un comentario lo más detallado posible.' id='content' name='content' rows='3' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.content} />
        {formik.touched.content && formik.errors.content ? <div className='text-red-600' role='alert'>{formik.errors.content}</div> : null}
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col sm:flex-row justify-start sm:items-center gap-2 sm:gap-6'>
          <label htmlFor='rating' className='font-bold text-lg'>Puntuación</label>
          <select className='rounded-xl px-2 ' id='rating' name='rating' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rating}>
            <option value=''>Selecciona una puntuación</option>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </select>
        </div>
        {formik.touched.rating && formik.errors.rating ? <div className='text-red-600' role='alert'>{formik.errors.rating}</div> : null}
      </div>

      <button type='submit' className='font-bold p-2 border-2 self-center w-20 rounded-xl bg-slate-400 border-black hover:bg-green-500 active:bg-green-500 focus:bg-green-500 duration-100 ease-in transition-all'>Enviar</button>
    </form>
  )
}
