import { useEffect, useState, useLayoutEffect } from 'react'
import { useAppContext } from '../context/state'
import { Loading } from '@nextui-org/react'
import conversationsService from '../services/conversations'
import ChatLayout from '../components/ChatLayout'

export default function Chats () {
  const { user, done } = useAppContext()
  const [conversations, setConversations] = useState([]) // we will fetch them
  const [maxHeight, setMaxHeight] = useState()

  useLayoutEffect(() => {
    const navbarHeight = document.querySelector('#navbar').offsetHeight
    const newMaxHeight = window.visualViewport.height - navbarHeight
    setMaxHeight(newMaxHeight)

    const handleResize = () => {
      const newMaxHeight = window.visualViewport.height - navbarHeight
      setMaxHeight(newMaxHeight)
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
        const participants = conversation.participants.filter((participant) => participant.username !== user.username)
        const lastTalked = new Date(conversation.lastTalked).toLocaleString()
        return { ...conversation, participants, lastTalked }
      })

      return updatedConversations
    }

    if (done && !!user) {
      const intervalId = setInterval(() => {
        conversationsInitializer(user.id)
          .then((convers) => {
            if (JSON.stringify(convers) !== JSON.stringify(conversations)) {
              setConversations(convers)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }, 1000)
      return () => clearInterval(intervalId)
    }
  })

  return (done && !!user)
    ? (
      <div className='flex flex-col justify-center items-center w-full' style={{ maxHeight }}>
        <ChatLayout conversations={conversations} />
      </div>

      )
    : (
      <div className='flex flex-col justify-center items-center w-full '>
        <Loading color='primary' />
        <span>
          Cargando...
        </span>
      </div>
      )
}

export async function getServerSideProps (context) {
  return {
    props: {
      title: 'Mis chats'
    }
  }
}
