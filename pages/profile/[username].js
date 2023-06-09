import { useState, useEffect } from 'react'
import ProfilePhoto from '../../components/ProfilePhoto'
import userService from '../../services/users'

export default function Profile ({ username, user }) {
  // username is the username of the profile
  // user is the user object of the profile
  const { name, surname, description, memberSince, followers, followed } = user
  let { profilePicture } = user
  const [condition, setCondition] = useState(false)
  const [done, setDone] = useState(false)
  const [follow, setFollow] = useState(false)
  const [loggedUsername, setLoggedUsername] = useState(null)
  const [isLogged, setIsLogged] = useState(false)
  const [followersState, setFollowers] = useState(followers.length)

  useEffect(() => {
    async function getUser () {
      const loggedUser = localStorage.getItem('loggedUser')
      if (loggedUser) {
        const loggedUsername = JSON.parse(loggedUser).username
        setLoggedUsername(loggedUsername)
        setIsLogged(true)
        setCondition(username === loggedUsername)
        const loggedUserObject = await userService.getUser(loggedUsername)
        if (loggedUserObject.followed.includes(user.id)) {
          setFollow(true)
        }
      }
      setDone(true)
    }

    getUser()
  }, [username, user.id])

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    // TODO: delete user of context
    window.location.href = '/'
  }

  const handleFollow = async () => {
    // TODO: add it to the user of context
    await userService.follow(username, loggedUsername)
    setFollow(!follow)
    follow ? setFollowers(followersState - 1) : setFollowers(followersState + 1)
  }

  let followBtn
  if (loggedUsername && follow) {
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

  const buttons = condition
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
            <ProfilePhoto src={profilePicture} alt='' username={username} />

            <div className='flex items-center justify-center gap-2'>
              {done && isLogged && buttons}
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
    props: { title: `${username}`, username, user }
  }
}
