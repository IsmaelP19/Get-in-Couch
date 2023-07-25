import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import conversationService from '../services/conversations'
import Message from './Message'
import MessageForm from './MessageForm'

export default function ChatLayout ({ conversations }) {
  // these conversations are populated, so we know the user with whom we are chatting with (his/her username, name, surname and profilePicture)
  // we won't show the last message because we would have to retrieve it from the database, and we don't want to do that unless the user clicks on the conversation
  const [conversation, setConversation] = useState(null) // selected conversation
  const [messages, setMessages] = useState([])
  const [lastMessageId, setLastMessageId] = useState(null)
  const chatContainerRef = useRef(null)

  const handleConversationClick = (selectedConversation) => {
    setConversation(selectedConversation)
    getMessages(selectedConversation.id)
  }

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (conversations.length !== 0) { setConversation(conversations[0]) }
  }, [conversations])

  const getMessages = async (id) => {
    const fetchedMessages = await conversationService.getMessagesFromConversation(id)
    const updatedMessages = fetchedMessages.map((message) => {
      return {
        ...message,
        date: new Date(message.date).toLocaleString()
      }
    })

    if (updatedMessages.length > 0) {
      const latestMessageId = updatedMessages[updatedMessages.length - 1].id
      if (lastMessageId !== latestMessageId) {
        setMessages(updatedMessages)
        setLastMessageId(latestMessageId)
      }
    } else {
      setMessages([])
      setLastMessageId(null)
    }
    // setDone(true)
  }
  useEffect(() => {
    if (conversation?.id) {
      const intervalId = setInterval(() => {
        getMessages(conversation.id)
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [conversation?.id, lastMessageId])

  return (
    <div className='flex flex-row  md:items-start items-center md:my-0 my-5 border h-full w-full border-slate-400 rounded-none md:rounded-md shadow-lg'>
      <div className='flex flex-col w-1/6 md:w-1/4 h-full border-r border-slate-400'>
        <span className='p-2 text-2xl text-gray-600 font-bold border-b border-slate-300 hidden md:flex'>
          Conversaciones
        </span>
        <ul className='flex flex-col md:items-start items-center h-full w-full overflow-y-auto'>
          {conversations.map((conver) => (
            <li key={conver.id} className={`flex flex-row items-center justify-center md:justify-start gap-3 text-base cursor-pointer  p-2 border-b w-full ${conversation?.id === conver.id ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 hover:shadow-xl'}  border-slate-300`} onClick={() => handleConversationClick(conver)}>
              <Image src={conver.participants[0].profilePhoto || '/static/images/default_avatar.png'} width={50} height={50} alt={conver.participants[0].username} />
              <span className=' text-xl hidden md:flex'>
                {`${conver.participants[0].name} ${conver.participants[0].surname}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col w-5/6 md:w-3/4 h-full'>
        <span className='p-2 text-2xl text-gray-600 font-bold border-b border-slate-300 hidden md:flex'>
          Mensajes
        </span>
        <span className='p-4 shadow-2xl text-2xl text-gray-600 font-bold border-b border-slate-300 flex md:hidden'>
          {conversation && `${conversation.participants[0].name} ${conversation.participants[0].surname}`}
        </span>

        <div ref={chatContainerRef} className='flex flex-col gap-3 p-2 h-full overflow-y-auto'>

          {conversation && messages.length !== 0 &&
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

          {conversation && messages.length === 0 && <span>Comience a chatear con {conversation.participants[0].name} {conversation.participants[0].surname}</span>}

        </div>

        <MessageForm messages={messages} setMessages={setMessages} conversation={conversation} />

      </div>

    </div>
  )
}
