// import { Server } from 'socket.io'
// import messageHandler from '../../utils/sockets/messageHandler.js'

// /pages/api/socket.js
import { Server } from 'socket.io'
import Conversation from '../../models/conversation'
import Message from '../../models/message'

export default function Socket (req, res) {
  if (!res.socket.server.io) {
    console.log('*New Socket.io server instance')
    const io = new Server(res.socket.server)

    io.on('connection', (socket) => {
      console.log('A user connected')

      // Manejar el evento de envío de mensajes
      socket.on('sendMessage', async (messageData) => { // messageData will have message, author, receiver, date and read
        try {
          // Guardar el mensaje en la base de datos (puedes ajustar esto según tu modelo)
          // we will try to find the conversation by the participants and if it doesn't exist, we will create it

          let conversation = await Conversation.findOne({
            participants: {
              $all: [messageData.author, messageData.receiver]
            }
          })

          if (!conversation) { // Si no existe la conversación, la creamos
            conversation = new Conversation({
              messages: [],
              participants: [messageData.author, messageData.receiver]
            })
          }

          // create the message
          const message = new Message({
            message: messageData.message,
            author: messageData.author,
            receiver: messageData.receiver,
            date: Date.now(),
            read: false
          })

          await message.save()

          // Añadir el mensaje a la conversación
          conversation.messages.push(message)

          await conversation.save()

          // Emitir el mensaje a los otros participantes de la conversación
          socket.to(conversation._id).emit('message', message)
        } catch (error) {
          console.error('Error al enviar el mensaje:', error)
        }
      })

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })
    })

    res.socket.server.io = io
  }

  res.end()
}
