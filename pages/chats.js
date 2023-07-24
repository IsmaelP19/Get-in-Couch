import { useEffect, useState } from 'react'
import { useAppContext } from '../context/state'
import { Loading } from '@nextui-org/react'
import conversationsService from '../services/conversations'
import ChatLayout from '../components/ChatLayout'

export default function Chats () {
  const { user, done } = useAppContext()
  const [conversations, setConversations] = useState([]) // we will fetch them
  const [maxHeight, setMaxHeight] = useState('')

  useEffect(() => {
    const setMaxHeightFunction = () => {
      const navbarHeight = document.getElementById('navbar').offsetHeight
      const footerHeight = document.getElementById('footer').offsetHeight

      let height = window.innerHeight - navbarHeight - footerHeight - 20
      if (window.innerWidth < 770) { // mobile and tablets
        height = window.innerHeight - navbarHeight - 30
        setMaxHeight(height + 'px')
      } else {
        setMaxHeight(height + 'px')
      }
    }

    setMaxHeightFunction()
    window.addEventListener('resize', setMaxHeightFunction)
    return () => window.removeEventListener('resize', setMaxHeightFunction)
  }, [])

  useEffect(() => {
    const conversationsInitializer = async (id) => {
      const conversations = await conversationsService.getAllConversations(id)
      const updatedConversations = conversations.map((conversation) => {
        const participants = conversation.participants.filter((participant) => participant.username !== user.username)
        const lastTalked = new Date(conversation.lastTalked).toLocaleString()
        return { ...conversation, participants, lastTalked }
      })

      updatedConversations.sort((a, b) => {
        const aDate = new Date(a.lastTalked)
        const bDate = new Date(b.lastTalked)
        return bDate - aDate
      })

      setConversations(updatedConversations)
    }

    if (done && !!user) {
      conversationsInitializer(user.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]) // we only want to fetch them once the user is logged in, so we only use the done variable as a dependency: if once is true, then we know if the user is logged in or not

  return (done && !!user)
    ? (
      <div className='flex flex-col justify-center items-center w-full m-2' style={{ height: `${maxHeight}` }}>
        <ChatLayout conversations={conversations} />
      </div>

      )
    : (
      <div className='flex flex-col justify-center items-center w-full m-2' style={{ height: `${maxHeight}` }}>
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
