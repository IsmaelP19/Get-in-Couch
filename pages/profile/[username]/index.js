import { useState, useEffect } from 'react'
import ProfilePhoto from '../../../components/ProfilePhoto'
import ProfileButton from '../../../components/ProfileButton'
import Tag from '../../../components/Tag'
import userService from '../../../services/users'
import { useAppContext } from '../../../context/state'
import conversationsService from '../../../services/conversations'
import { AiOutlineEdit } from 'react-icons/ai'
import { PiSignOutBold } from 'react-icons/pi'
import { useRouter } from 'next/router'
import { FaBookmark } from 'react-icons/fa'
import { BsCalendar2WeekFill } from 'react-icons/bs'

export default function Profile ({ userObject }) {
  const { name, surname, description, memberSince, followers, following } = userObject
  let { profilePicture } = userObject
  const [done, setDone] = useState(false) // this done is different from the one in context, this one will be used to know whether I follow the user or not
  const [follow, setFollow] = useState(false)
  const [followersState, setFollowers] = useState(0)
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
    if (userObject.username === user?.username) {
      setFollowers(user.followers.length)
    } else {
      setFollowers(followers.length)
    }
  }, [userObject])

  useEffect(() => {
    async function checkFollow () {
      if (user?.following.includes(userObject.id)) {
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
      const updatedUser = { ...user, following: user.following.filter((followedUser) => followedUser !== userObject.id) }
      setUser(updatedUser)
    } else {
      setFollowers(followersState + 1)
      const updatedUser = { ...user, following: [...user.following, userObject.id] }
      setUser(updatedUser)
    }
  }

  const handleSaved = () => {
    router.push('/saved')
  }

  const handleSituation = () => {
    router.push('/state')
    // this endpoint will only be available for users who are not owners (potentially tenants)
  }

  const handleFollowersPage = () => {
    router.push(`/profile/${userObject.username}/followers`)
  }

  const handleFollowingPage = () => {
    router.push(`/profile/${userObject.username}/following`)
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
      <div className='flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center'>
        <button className='flex gap-2 items-center justify-center bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleEdit}>
          <AiOutlineEdit className='text-2xl' />
          Editar perfil
        </button>
        <button className='flex gap-2 items-center justify-center bg-red-400 hover:bg-red-900  font-bold  hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleLogout}>
          <PiSignOutBold className='text-2xl' />
          Cerrar sesión
        </button>
      </div>
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
            <ProfilePhoto src={profilePicture} alt='' username={userObject.username} width={500} height={500} />

            <div className='flex items-center justify-center gap-2'>
              {done && user && buttons}
            </div>
          </div>
          <div className='flex flex-col gap-2 md:px-10 md:py-2 md:w-3/4 items-center md:items-start justify-center'>
            <span className='font-bold text-2xl'>
              {name} {surname}
            </span>
            <Tag text={userObject.isOwner ? 'Propietario' : 'Inquilino'} verified style={`text-base font-bold ${userObject.isOwner ? 'text-green-800 bg-green-100' : 'text-purple-800 bg-purple-100'}  `} />

            <span className='text-gray-600 font-thin text-base'>
              Miembro desde: {showDate()}
            </span>
            <span className='text-gray-600 font-thin text-base'>
              {description}
            </span>
            <div className='flex gap-3 px-3 md:px-0 flex-wrap items-center justify-center'>

              {user?.username === userObject.username && (
                <>
                  <ProfileButton handleClick={handleSaved} style={user.isOwner ? '' : 'bg-purple-200 hover:bg-purple-700 hover:text-white'}>
                    Guardados
                    <FaBookmark className='text-xl ' />
                  </ProfileButton>
                  {!user.isOwner &&
                    <ProfileButton handleClick={handleSituation} style='bg-purple-200 font-bold hover:bg-purple-700 hover:text-white'>
                      Situación actual
                      <BsCalendar2WeekFill className='text-xl' />
                    </ProfileButton>}
                </>
              )}
              <ProfileButton handleClick={handleFollowersPage} style='bg-gray-200 hover:bg-slate-600 text-black hover:text-white'>
                {followersState} {followersState === 1 ? 'seguidor' : 'seguidores'}
              </ProfileButton>
              <ProfileButton handleClick={handleFollowingPage} style='bg-gray-200 hover:bg-slate-600 text-black hover:text-white'>
                {following.length} siguiendo
              </ProfileButton>

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
