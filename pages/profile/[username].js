import { useState, useEffect } from 'react'
import ProfilePhoto from '../../components/ProfilePhoto'

export default function Profile ({ username, user }) {
  const { name, surname, description, memberSince, followers, followed } = user
  let { profilePicture } = user
  const [condition, setCondition] = useState(false)
  const [done, setDone] = useState(false)
  async function getUser () {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const loggedUsername = JSON.parse(loggedUser).username
      setCondition(username === loggedUsername)
    }
    setDone(true) // i have to know when the user is set, even if it is null
  }

  useEffect(() => {
    getUser()
  }, [])

  const buttons = condition
    ? (
      <>
        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full'>
          Editar perfil
        </button>
        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full'>
          Cerrar sesión
        </button>
      </>
      )
    : (
      <>
        <button className='bg-green-400 hover:bg-green-700 font-bold text-black hover:text-white py-2 px-4 rounded-2xl'>
          Seguir
        </button>
        <button className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full'>
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
      <main>
        <div className='flex flex-col md:flex-row gap-10 md:gap-5 mx-10 my-5 md:mx-20 md:my-14 '>
          <div className='flex flex-col md:w-1/3 gap-5 '>
            <div className='flex flex-col items-center justify-center gap-3'>
              <ProfilePhoto src={profilePicture} alt='' />
              <span className='font-bold'>
                @{username}
              </span>
            </div>

            <div className='flex items-center justify-center gap-2'>
              {done && buttons}
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
                {followers} seguidores
              </span>
              <span className='bg-gray-200 text-black py-2 px-4 my-2 rounded-3xl'>
                {followed} seguidos
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

  return {
    props: { title: `${username}`, username, user }
  }
}
