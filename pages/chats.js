import { useEffect, useState, useLayoutEffect } from 'react'
import { useAppContext } from '../context/state'
import { Loading } from '@nextui-org/react'
import conversationsService from '../services/conversations'
import ChatLayout from '../components/ChatLayout'

export default function Chats () {
  const { user, done } = useAppContext()
  const [conversations, setConversations] = useState([]) // we will fetch them
  const [maxHeight, setMaxHeight] = useState('')

  useLayoutEffect(() => {
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
      <div className='flex flex-col justify-center items-center w-full m-0 md:m-2' style={{ height: `${maxHeight}` }}>
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
