import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import userService from '../services/users'

const AppContext = createContext()

export function AppWrapper ({ children }) {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState([])
  const [done, setDone] = useState(false)
  const [isOpen, setOpenDrawer] = useState(false)

  // get the data from localStorage and place it on context
  useEffect(() => {
    async function fetchData () {
      const data = localStorage.getItem('loggedUser')
      if (data) {
        const user = await userService.getUser(JSON.parse(data).username)
        setUser(user)
      }
      setDone(true)
    }
    fetchData()
  }, [])

  const contextValue = useMemo(() => ({
    user,
    setUser,
    message,
    setMessage,
    done,
    setDone,
    isOpen,
    setOpenDrawer
  }), [user, setUser, message, setMessage, done, setDone, isOpen, setOpenDrawer])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext () {
  return useContext(AppContext)
}
