import Gallery from '../../../components/Gallery'
import Comment from '../../../components/Comment'
import PropertyCard from '../../../components/PropertyCard'
import PropertyInfo from '../../../components/PropertyInfo'
import propertiesService from '../../../services/properties'
import { useState, useEffect } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../context/state'
import CommentForm from '../../../components/CommentForm'
import Notification from '../../../components/Notification'
import { Pagination, Loading } from '@nextui-org/react'
export default function PropertyDetails ({ property }) {
  const [showText, setShowText] = useState('Ver más imágenes')
  const [comments, setComments] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const [page, setPage] = useState(1)
  const [done, setDone] = useState(false)
  const { user, message } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await propertiesService.getCommentsByProperty(property.id)
      setComments(fetchedComments.comments)
      setTotalComments(fetchedComments.total)
      setDone(true)
    }
    fetchComments()
  }, [property.id, user])

  useEffect(() => {
    if (totalComments === 0) {
      setTotalPages(1)
    } else {
      setTotalPages(Math.ceil(totalComments / 5))
    }
  }, [totalComments])

  const handlePageChange = async (page) => {
    setDone(false)
    setPage(page)
    const fetchedComments = await propertiesService.getCommentsByProperty(property.id, 5, page)
    setComments(fetchedComments.comments)
    setTotalComments(fetchedComments.total) // in case the total number of comments has changed
    setDone(true)
  }

  const handleShowGallery = () => {
    const gallery = document.querySelector('#gallery')
    const navbarHeight = document.querySelector('#navbar').offsetHeight // Obtiene la altura de la navbar

    if (gallery.classList.contains('hidden')) {
      gallery.classList.remove('hidden')
      gallery.classList.add('flex')
      setShowText('Ocultar imágenes')
      const galleryPosition = gallery.getBoundingClientRect().top + window.scrollY
      const newPosition = galleryPosition - navbarHeight - 10
      window.scrollTo({ top: newPosition, behavior: 'smooth' })
    } else {
      gallery.classList.remove('flex')
      gallery.classList.add('hidden')
      setShowText('Ver más imágenes')
    }
  }

  const handleEdit = () => {
    router.push(`/properties/${property.id}/edit`)
  }

  const handleDelete = async () => {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar este inmueble?')
    if (confirm) {
      await propertiesService.removeProperty(property.id, user.id)
      router.push('/properties')
    }
  }

  return (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='p-10 font-bold text-3xl text-center'>Detalles del inmueble</h1>
      <div className='w-[90%] flex flex-col md:flex-row items-center justify-around gap-10'>
        <div className='flex flex-col gap-5 items-center'>
          {user?.properties.includes(property?.id) && (
            <div className='flex gap-3 w-full justify-between'>
              <button className='bg-gray-200 hover:bg-red-700 px-5 self-center text-black hover:text-white rounded-full py-1 duration-200 border-2 border-slate-700 font-bold flex justify-center items-center gap-2 ' onClick={handleDelete}>
                <MdDeleteOutline />
                Eliminar
              </button>
              <button className='bg-gray-200 hover:bg-yellow-500 px-5 self-center text-black hover:text-black rounded-full py-1 duration-200 border-2 border-slate-700 font-bold flex justify-center items-center gap-2' onClick={handleEdit}>
                <AiOutlineEdit />
                Editar
              </button>
            </div>
          )}

          <PropertyCard property={property} />
          <button className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black rounded-full p-1 duration-200 border-2 border-gray-200 font-bold w-full' onClick={handleShowGallery}>
            {showText}
          </button>
        </div>

        <PropertyInfo property={property} />

      </div>

      <Gallery property={property} />

      <div className='w-[90%] md:w-3/6 flex flex-col items-center mt-10 gap-5'>
        <h2 className='font-bold text-2xl text-center'>Comentarios</h2>
        <Notification message={message[0]} type={message[1]} />
        <CommentForm property={property} setComments={setComments} setPage={setPage} page={page} comments={comments} totalComments={totalComments} setTotalComments={setTotalComments} />
        {!done && <Loading color='primary' />}
        {done && comments?.length > 0
          ? (

            <div className='w-full flex flex-col items-center justify-around gap-3'>
              {comments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  isTenant={property.tenants.some(tenant => tenant.user.toString() === comment.user.id)}
                  setPage={setPage}
                  page={page}
                  n={comments.length}
                  hasLived={property.tenantsHistory.some(history => history.user.toString() === comment.user.id)}
                  isOwner={property.owner?.id === comment.user.id} // this could be also done with comment.user.properties.includes(property.id) BUT we don't know the value of comment.user.properties since we are not populating it on the backend response
                  setComments={setComments}
                  setTotalComments={setTotalComments}
                />
              ))}
              <Pagination total={totalPages} bordered shadow initialPage={1} page={page} onChange={handlePageChange} className='z-0' />

            </div>

            )
          : (
              done && <span className='text-center mt-4 text-xl'>Aún no hay comentarios disponibles... ¿Por qué no creas uno?</span>
            )}
      </div>

    </div>
  )
}

export async function getServerSideProps (context) {
  const id = context.params.id

  const fetchedProperty = await propertiesService.getProperty(id)
  if (fetchedProperty.error || !fetchedProperty.isActive) {
    context.res.writeHead(302, { Location: '/404' })
    context.res.end()
  }

  delete fetchedProperty.location?.coordinates
  fetchedProperty.location.street = fetchedProperty.location.street.split(',')[0]

  return {
    props: {
      property: fetchedProperty,
      title: 'Detalles del inmueble'
    }
  }
}
