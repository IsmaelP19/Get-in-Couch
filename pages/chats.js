// import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useAppContext } from '../context/state'
import { Loading } from '@nextui-org/react'
import conversationsService from '../services/conversations'

// let socket

export default function Chats () {
  const { user, done } = useAppContext()
  const [conversations, setConversations] = useState([]) // we will fetch them

  useEffect(() => {
    const conversationsInitializer = async () => {
      const conversations = await conversationsService.getAllConversations(user.username)
      setConversations(conversations)
    }

    if (done && !!user) {
      conversationsInitializer()
    }
  }, [done, user])

  return (done && !!user)
    ? (
      <div className='flex flex-col justify-center items-center w-full my-10'>
        <h1 className='text-6xl md:text-9xl'>Chats</h1>
        <h2 className='text-3xl md:text-6xl mb-14'>Mis chats</h2>
        <div className='flex flex-col justify-center items-center w-full my-10'>
          <h2 className='text-3xl md:text-6xl mb-14'>Conversaciones</h2>
          {conversations.map((conversation, index) => (
            <div key={index} className='flex flex-col justify-center items-center w-full my-10'>
              <h3 className='text-2xl md:text-4xl mb-14'>{conversation.participants[0] === user.username ? conversation.participants[1] : conversation.participants[0]}</h3>
            </div>
          ))}
        </div>
      </div>
      )
    : (
      <Loading color='primary' />
      )
}

// export default function Chats () {
//   const { user, done } = useAppContext() // user logged in
//   // tenemos que obtener todas las conversaciones del usuario que está loggado.
//   // const [conversations, setConversations] = useState([])
//   const [messages, setMessages] = useState([])
//   const [message, setMessage] = useState('')

//   // useEffect(() => {
//   //   socket = io('http://localhost:3000')
//   //   socket.on('connect', () => {
//   //     setIsConnected(true)
//   //   })
//   //   socket.on('disconnect', () => {
//   //     setIsConnected(false)
//   //   })
//   //   socket.on('newIncomingMessage', (msg) => {
//   //     setMessages((messages) => [...messages, msg])
//   //   })
//   //   return () => {
//   //     socket.off('newIncomingMessage')
//   //     socket.off('disconnect')
//   //     socket.off('connect')
//   //   }
//   // }, [])

//   useEffect(() => {
//     const socketInitializer = async () => {
//       // We just call it because we don't need anything else out of it
//       await fetch('/api/chat')
//       socket = io()
//       socket.on('newIncomingMessage', (msg) => {
//         setMessages((currentMsg) => [
//           ...currentMsg,
//           { author: msg.author, message: msg.message }
//         ])
//         // console.log(messages)
//       })
//     }

//     socketInitializer()
//   }, [])

//   const sendMessage = (e) => {
//     e.preventDefault()
//     socket.emit('createdMessage', {
//       username: user.username,
//       message
//     })
//     setMessage('')
//   }

//   return (done && !!user)
//     ? (
//       <div className='flex flex-col justify-center items-center w-full my-10'>
//         <h1 className='text-6xl md:text-9xl'>Chats</h1>
//         <h2 className='text-3xl md:text-6xl mb-14'>Mis chats</h2>
//         <div className='flex flex-col justify-center items-center w-full my-10'>
//           <form onSubmit={sendMessage} className='flex flex-col justify-center items-center w-full my-10'>
//             <input type='hidden' name='username' value={user.username} />
//             <input
//               type='text'
//               placeholder='Mensaje'
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className='border border-gray-300 p-2 rounded-lg w-80'
//             />
//             <button
//               type='submit'
//               className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full text-xl md:text-2xl'
//             >
//               Enviar mensaje
//             </button>
//           </form>
//           <div className='flex flex-col justify-center items-center w-full my-10'>
//             <h2 className='text-3xl md:text-6xl mb-14'>Mensajes</h2>
//             {messages.map((msg, index) => (
//               <div key={index} className='flex flex-col justify-center items-center w-full my-10'>
//                 <h3 className='text-2xl md:text-4xl mb-14'>{msg.username}</h3>
//                 <p className='text-xl md:text-3xl mb-14'>{msg.message}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       )
//     : (
//       <Loading color='primary' />
//       )
// }

// const Chat = ({ conversationId, userId }) => {
//   const [message, setMessage] = useState('')
//   const [messages, setMessages] = useState([])
//   const { user } = useAppContext()

//   useEffect(() => {
//     const socket = io()

//     // Escuchar los mensajes recibidos
//     socket.on('message', (messageData) => {
//       // Aquí puedes agregar lógica para mostrar el mensaje recibido en el chat
//       setMessages((prevMessages) => [...prevMessages, messageData])
//     })

//     return () => {
//       socket.disconnect()
//     }
//   }, [])

//   const handleSendMessage = () => {
//     // Aquí puedes ajustar la lógica según tus necesidades para obtener los datos del mensaje
//     const messageData = {
//       conversationId,
//       author: userId,
//       receiver: 'ID_DEL_RECEPTOR', // Aquí debes especificar el ID del receptor del mensaje
//       message
//     }

//     // Enviar el mensaje al servidor
//     io().emit('sendMessage', messageData)

//     // Actualizar los mensajes locales para que aparezca inmediatamente en la pantalla
//     setMessages((prevMessages) => [...prevMessages, messageData])

//     // Limpiar el input de mensaje
//     setMessage('')
//   }

//   return (
//     <div>
//       {/* Renderizar los mensajes */}
//       {messages.map((messageData, index) => (
//         <div key={index}>
//           <p>{messageData.message}</p>
//           {/* Otros detalles del mensaje */}
//         </div>
//       ))}

//       {/* Input para enviar mensajes */}
//       <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
//       <button onClick={handleSendMessage}>Enviar</button>
//     </div>
//   )
// }

// export default Chat

export async function getServerSideProps (context) {
  return {
    props: {
      title: 'Mis chats'
    }
  }
}
