// components/ChatLayout.jsx
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Loading } from '@nextui-org/react'
import Link from 'next/link'
import { useAppContext } from '../context/state'
import Message from './Message'
import MessageForm from './MessageForm'
import Pusher from 'pusher-js'
import conversationsService from '../services/conversations'
import messagesService from '../services/messages'

const ChatLayout = ({ conversations, setConversations, fetchedConversations }) => {
  const [conversation, setConversation] = useState(null) // selected conversation
  const [messages, setMessages] = useState([])
  const [done, setDone] = useState(false)
  // const [conversationsWithNewMessages, setConversationsWithNewMessages] = useState([]) // Store the IDs of conversations with new messages
  const chatContainerRef = useRef(null)
  const { user } = useAppContext()

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }, [messages, done])

  useEffect(() => {
    let pusher
    if (fetchedConversations) {
      // After initializing conversations, subscribe to Pusher events
      pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
      })

      // Subscribe to the 'presence-global' channel
      const channel = pusher.subscribe('global-channel')

      // Bind to the 'new-message' event to listen for new messages
      channel.bind('new-message', (data) => {
        handleNewMessage(data)
      })

      pusher.connection.bind('error', function (err) {
        if (err.data.code === 4004) {
          alert('Over limit!')
        }
      })
    }

    return () => {
      if (pusher) {
        pusher.unsubscribe('global-channel')
        pusher.disconnect()
      }
    }
  }, [fetchedConversations, conversations])

  // Function to handle new incoming messages from Pusher
  const handleNewMessage = (newMessage) => {
    const { conversationId, message } = newMessage

    const existingConversationIndex = conversations.findIndex(
      (conversation) => conversation.id === conversationId
    )

    if (existingConversationIndex === -1) {
      // If the conversation is not in the list, add it with the new message
      if (message.receiver === user?.id) {
        setConversations((prevConversations) => [
          ...prevConversations,
          {
            id: conversationId,
            participants: [message.author, message.receiver], // FIXME: Check if this is correct
            messages: [message.id],
            lastTalked: new Date(message.date).toLocaleString()
          }
        ])
      }
    } else {
      if (message.author !== user?.id) {
        messagesService.getMessageInfo(message.id)
          .then((populatedMessage) => {
            populatedMessage.date = new Date(populatedMessage.date).toLocaleString()
            setMessages((prevMessages) => [...prevMessages, populatedMessage])
          })
          .catch((err) => {
            console.log(err)
          })
      }
      // setMessages((prevMessages) => [...prevMessages, message])
      // if (message.author !== user?.id) {
      //   messagesService.getMessageInfo(message.id)
      //     .then((populatedMessage) => {
      //       setMessages((prevMessages) => [...prevMessages, populatedMessage])
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
      // }
    }
  }

  const handleConversationClick = async (selectedConversation) => {
    setConversation(selectedConversation)
    setDone(false) // Reset the done state to false

    // Fetch the messages for the selected conversation
    const messages = await conversationsService.getMessagesFromConversation(selectedConversation.id)
    messages.map((message) => {
      message.date = new Date(message.date).toLocaleString()
      return message
    })
    setMessages(messages)

    setDone(true)
  }

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      handleConversationClick(conversations[0])
    }
  }, [conversations])
  return (
    <div className='flex flex-row md:items-start items-center my-0 border h-full w-full border-slate-400' id='chatLayout'>
      <div className='flex flex-col w-1/6 md:w-1/4 h-full border-r border-slate-400'>
        <span className='p-2 text-2xl text-gray-600 font-bold border-b border-slate-300 hidden md:flex'>
          Conversaciones
        </span>
        <ul className='flex flex-col md:items-start items-center h-full w-full overflow-y-auto'>
          {conversations.map((conver) => (
            <li
              key={conver.id}
              className={`flex flex-row items-center justify-center md:justify-start md:gap-3 text-base cursor-pointer  p-2 border-b w-full ${
                conversation?.id === conver.id ? 'bg-blue-400 text-white' : 'hover:bg-slate-100 hover:shadow-xl'
              }  border-slate-300`}
              onClick={() => handleConversationClick(conver)}
            >
              <Image
                src={conver.participants[0].profilePicture || '/static/images/default_avatar.png'}
                width={50}
                height={50}
                alt={conver.participants[0].username}
                className='rounded-full w-14 h-14 object-cover border-2 border-slate-200'
              />
              <div className='flex flex-col justify-center items-start'>
                <span className='text-xl hidden md:flex'>
                  {`${conver.participants[0].name} ${conver.participants[0].surname}`}
                </span>
                <span className='text-base italic hidden md:flex'>
                  @{conver.participants[0].username}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col w-5/6 md:w-3/4 h-full'>
        <span className='p-2 text-2xl text-gray-600 font-bold border-b border-slate-300 hidden md:flex'>
          Mensajes
        </span>
        <div className='p-4 shadow-2xl text-2xl text-gray-600 font-bold border-b border-slate-300 flex flex-col md:hidden'>
          <span>
            {conversation && `${conversation.participants[0].name} ${conversation.participants[0].surname}`}
          </span>
          {conversation && (
            <Link href={`/profile/${conversation.participants[0].username}`} className='italic text-slate-500 hover:underline hover:text-blue-600'>
              <span>
                @{conversation.participants[0].username}
              </span>
            </Link>
          )}
        </div>

        <div ref={chatContainerRef} className='flex flex-col gap-3 p-2 h-full overflow-y-auto'>
          {!done && (
            <div className='flex flex-col m-auto'>
              <Loading color='primary' />
              <span>Cargando mensajes</span>
            </div>
          )}

          {conversation && messages.length !== 0 && done && messages.map((message) => <Message key={message.id} message={message} />)}

          {conversation && messages.length === 0 && done && <span>Comience a chatear con {conversation.participants[0].name} {conversation.participants[0].surname}</span>}
        </div>

        {conversation && <MessageForm messages={messages} setMessages={setMessages} conversation={conversation} />}
      </div>
    </div>
  )
}

export default ChatLayout
