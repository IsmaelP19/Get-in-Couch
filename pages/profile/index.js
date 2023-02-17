import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import userService from '../../services/users'

export default function Profile () {
  const [done, setDone] = useState(false)
  const router = useRouter()

  const [user, setUser] = useState(null)
  async function getUser () {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const username = JSON.parse(loggedUser).username
      const user = await userService.getUser(username)
      setUser(user)
    }
    setDone(true) // i have to know when the user is set, even if it is null
  }

  useEffect(() => {
    getUser()
  }, [])

  if (done) {
    // if the user is not null, redirect to the profile page /profile/username
    user ? router.push(`/profile/${user.username}`) : router.push('/login')
  }
}
