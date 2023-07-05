import Link from 'next/link'
import { AiOutlineStar, AiFillStar, AiFillHeart, AiOutlineEdit } from 'react-icons/ai'
import ProfilePhoto from './ProfilePhoto'
import Tag from './Tag'
import commentService from '../services/comments'
import { useState } from 'react'
import { useAppContext } from '../context/state'

export default function Comment ({ comment, isTenant }) {
  const { user } = useAppContext()
  const [likes, setLikes] = useState(comment.likes)

  const profilePhoto = comment.user?.profilePhoto || '/static/images/default_avatar.png'
  const date = new Date(comment.publishDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

  const valoracion = () => {
    const fillStars = Array.from({ length: comment.rating }, (_, i) => <AiFillStar key={i} className='text-yellow-600' />)
    const outlineStars = Array.from({ length: 5 - comment.rating }, (_, i) => <AiOutlineStar key={i} className='text-yellow-600' />)
    return (
      <div className='flex flex-row '>
        {fillStars}
        {outlineStars}
      </div>
    )
  }

  const handleLike = async () => {
    if (likes.includes(user?.id)) {
      await commentService.update(comment.id, { likes: comment.likes.filter(like => like !== user.id) })
      setLikes(comment.likes.filter(like => like !== user.id))
    } else {
      await commentService.update(comment.id, { likes: [...comment.likes, user.id] })
      setLikes([...comment.likes, user.id])
    }
  }

  return (
    <div className='flex flex-col gap-3 bg-slate-300 w-full p-4 mt-4 rounded-xl border-2 border-slate-900 '>
      <div className='flex flex-row flex-wrap justify-center items-center gap-4'>
        <Link href={`/profile/${comment.user.username}`} passHref>
          <ProfilePhoto isComment src={profilePhoto} alt={comment.user.username} username={comment.user.username} width={50} height={50} />
        </Link>
        {isTenant && <Tag text='Ha vivido en este inmueble' verified style='text-base font-bold text-purple-900' />}
      </div>
      <span>{comment.content}</span>
      <div className='flex flex-row gap-3 justify-between flex-wrap'>
        <span className='text-base italic text-black flex flex-row gap-2 items-center'>
          <AiOutlineEdit className='inline-block mr-1' />
          Publicado el {date}
        </span>
        <span className='flex flex-row items-center '>
          {likes.length}
          {user && user?.id !== comment.user.id
            ? (

              <AiFillHeart className={`inline-block ml-1 ${likes.includes(user?.id) ? 'text-red-600 hover:text-gray-800' : 'text-gray-800 hover:text-red-600'} hover:cursor-pointer`} onClick={handleLike} />
              )
            : (
              <AiFillHeart className='inline-block ml-1 text-gray-800' />
              )}

        </span>
        <span className='text-base font-bold text-black flex flex-row items-center gap-3'>Valoración: {valoracion()}</span>

      </div>
    </div>
  )
}
