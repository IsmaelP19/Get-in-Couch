import { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../context/state'
import { Loading } from '@nextui-org/react'
import conversationsService from '../services/conversations'
import ChatLayout from '../components/ChatLayout'
// import Pusher from 'pusher-js'

export default function Chats () {
  const { user, done } = useAppContext()
  const [conversations, setConversations] = useState([])
  const [maxHeight, setMaxHeight] = useState()
  const [fetchedConversations, setFetchedConversations] = useState(false)
  const conversationsRef = useRef([])

  // media queries
  useEffect(() => {
    const navbarHeight = document.querySelector('#navbar').offsetHeight
    const newMaxHeight = window.innerHeight - navbarHeight - 17
    setMaxHeight(newMaxHeight)

    const handleResize = () => {
      const newMaxHeight = window.visualViewport.height - navbarHeight - 17
      if (newMaxHeight !== maxHeight) {
        setMaxHeight(newMaxHeight)
      }
    }

    document.getElementById('footer').classList.add('hidden')
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.getElementById('footer').classList.remove('hidden')
    }
  }, [])

  useEffect(() => {
    const conversationsInitializer = async (id) => {
      const convers = await conversationsService.getAllConversations(id)

      convers.sort((a, b) => {
        const aDate = new Date(a.lastTalked)
        const bDate = new Date(b.lastTalked)
        return bDate - aDate
      })

      const updatedConversations = convers.map((conversation) => {
        const participants = conversation.participants.filter(
          (participant) => participant.username !== user.username
        )
        const lastTalked = new Date(conversation.lastTalked).toLocaleString()
        return { ...conversation, participants, lastTalked }
      })

      return updatedConversations
    }

    if (done && !!user) {
      const initializeConversations = async () => {
        const convers = await conversationsInitializer(user.id)
        conversationsRef.current = convers
        setConversations(convers)
        setFetchedConversations(true)
      }
      initializeConversations()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, user])

  return done && !!user
    ? (
      <div className='flex flex-col justify-center items-center w-full shadow-xl' style={{ maxHeight }}>
        <ChatLayout conversations={conversations} setConversations={setConversations} fetchedConversations={fetchedConversations} />
      </div>
      )
    : (
      <div className='flex flex-col justify-center items-center w-full '>
        <Loading color='primary' />
        <span>Cargando...</span>
      </div>
      )
}

export async function getServerSideProps () {
  return {
    props: {
      title: 'Mis chats'
    }
  }
}
