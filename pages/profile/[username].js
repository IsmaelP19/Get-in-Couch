import { useState, useEffect } from 'react'
import ProfilePhoto from '../../components/ProfilePhoto'
import userService from '../../services/users'
import { useAppContext } from '../../context/state'
import conversationsService from '../../services/conversations'
import { AiOutlineEdit } from 'react-icons/ai'
import { PiSignOutBold } from 'react-icons/pi'
import { useRouter } from 'next/router'
// TODO: add saved properties to my profile page

export default function Profile ({ userObject }) {
  const { name, surname, description, memberSince, followers, followed } = userObject
  let { profilePicture } = userObject
  const [done, setDone] = useState(false) // this done is different from the one in context, this one will be used to know whether I follow the user or not
  const [follow, setFollow] = useState(false)
  const [followersState, setFollowers] = useState(followers.length)
  const { user, setUser } = useAppContext()
  const router = useRouter()

  const handleContact = async () => {
    try {
      await conversationsService.create({ participants: [user.id, userObject.id] })
      window.location.href = '/chats'
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function checkFollow () {
      if (user?.followed.includes(userObject.id)) {
        setFollow(true)
      }
      setDone(true)
    }
    checkFollow()
  }, [user, userObject.id])

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    window.location.href = '/'
  }

  const handleEdit = () => {
    router.push('/profile/edit')
  }

  const handleFollow = async () => {
    await userService.follow(userObject.username, user.username)

    setFollow(!follow)
    if (follow) {
      setFollowers(followersState - 1)
      const updatedUser = { ...user, followed: user.followed.filter((followedUser) => followedUser !== userObject.id) }
      setUser(updatedUser)
    } else {
      setFollowers(followersState + 1)
      const updatedUser = { ...user, followed: [...user.followed, userObject.id] }
      setUser(updatedUser)
    }
  }

  let followBtn
  if (user?.username && follow) {
    followBtn = (
      <button className='bg-red-400 hover:bg-red-900 font-bold text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleFollow}>
        Dejar de seguir
      </button>
    )
  } else {
    followBtn = (
      <button className='bg-green-400 hover:bg-green-700 font-bold text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleFollow}>
        Seguir
      </button>
    )
  }

  const buttons = user?.username === userObject.username
    ? (
      <>
        <button className='flex gap-2 items-center justify-center bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleEdit}>
          <AiOutlineEdit />
          Editar perfil
        </button>
        <button className='flex gap-2 items-center justify-center bg-red-400 hover:bg-red-900  font-bold  hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleLogout}>
          <PiSignOutBold />
          Cerrar sesión
        </button>
      </>
      )
    : (
      <>
        {followBtn}

        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleContact}>
          Contactar
        </button>
      </>
      )

  const showDate = () => {
    const date = new Date(memberSince)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  profilePicture || (profilePicture = '/static/images/default_avatar.png')

  return (
    <>
      <main className='w-full'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-5 mx-5 my-5 md:mx-15 md:my-14 '>
          <div className='flex flex-col md:w-1/4 gap-5 '>
            <ProfilePhoto src={profilePicture} alt='' username={userObject.username} width={100} height={100} />

            <div className='flex items-center justify-center gap-2'>
              {done && user && buttons}
            </div>
          </div>
          <div className='flex flex-col gap-2 md:px-10 md:py-2 md:w-3/4 items-center md:items-start justify-center'>
            <span className='font-bold text-2xl'>
              {name} {surname}
            </span>
            <span className='text-gray-600 font-thin text-base'>
              Miembro desde: {showDate()}
            </span>
            <span className='text-gray-600 font-thin text-base'>
              {description}
            </span>
            <div className='flex gap-3 '>
              {/* TODO: add clickable to show followers and followed on another page */}
              <span className='bg-gray-200 text-black py-2 px-4 my-2 rounded-3xl'>
                {followersState} seguidores
              </span>
              <span className='bg-gray-200 text-black py-2 px-4 my-2 rounded-3xl'>
                {followed.length} seguidos
              </span>

            </div>
          </div>
        </div>

      </main>
    </>
  )
}

export async function getServerSideProps (context) {
  const { username } = context.query
  let user = {}
  try {
    user = await userService.getUser(username)
  } catch (error) {
    if (error.response.data.error === 'user not found') {
      context.res.writeHead(302, { Location: '/404' })
      context.res.end()
    }
  }

  return {
    props: { title: `${user.username}`, userObject: user }
  }
}
