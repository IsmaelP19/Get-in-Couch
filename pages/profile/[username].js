import { useState, useEffect } from 'react'
import ProfilePhoto from '../../components/ProfilePhoto'
import userService from '../../services/users'
import { useAppContext } from '../../context/state'
// TODO: add saved properties to my profile page

export default function Profile ({ userObject }) {
  const { name, surname, description, memberSince, followers, followed } = userObject
  let { profilePicture } = userObject
  const [done, setDone] = useState(false) // this done is different from the one in context, this one will be used to know whether I follow the user or not
  const [follow, setFollow] = useState(false)
  const [followersState, setFollowers] = useState(followers.length)
  const { user, setUser } = useAppContext()

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

  const handleFollow = async () => {
    // TODO: add it to the user of context
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
        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black'>
          Editar perfil
        </button>
        <button className='bg-red-400 hover:bg-red-900  font-bold  hover:text-white py-2 px-4 rounded-2xl border-2 border-black' onClick={handleLogout}>
          Cerrar sesión
        </button>
      </>
      )
    : (
      <>
        {followBtn}

        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-2xl border-2 border-black'>
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

  // TODO: add a loading spinner

  return (
    <>
      <main className='w-full'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-5 mx-10 my-5 md:mx-20 md:my-14 '>
          <div className='flex flex-col md:w-1/3 gap-5 '>
            <ProfilePhoto src={profilePicture} alt='' username={userObject.username} />

            <div className='flex items-center justify-center gap-2'>
              {done && user && buttons}
            </div>
          </div>
          <div className='flex flex-col gap-2  md:w-2/3 items-center md:items-start justify-center '>
            <span className='font-bold text-2xl'>
              {name} {surname}
            </span>
            <span className='text-gray-600 font-thin text-base'>
              Miembro desde: {showDate()}
            </span>
            <span className='text-gray-600 font-thin text-base'>
              {description}
            </span>
            <div className='flex gap-3'>
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
  const res = await fetch(`${process.env.API_URL}/users/${username}`)
  const user = await res.json()

  if (user.error === 'user not found') {
    context.res.writeHead(302, { Location: '/404' })
    context.res.end()
  }

  return {
    props: { title: `${user.username}`, userObject: user }
  }
}
