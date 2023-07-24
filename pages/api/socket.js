import { Server } from 'socket.io'
import Message from '../../models/message'
import Conversation from '../../models/conversation'

export const config = {
  api: {
    bodyParser: false
  }
}

export default function handler (req, res) {
  const io = new Server(res.socket.server, {
    path: '/api/socket'
  })
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    // Adjuntamos el servidor Socket.io al servidor HTTP solo si no está adjuntado previamente
    res.socket.server.io = io
  }

  // const io = res.socket.server.io || new Server(res.socket.server)

  // Manejador de eventos para cuando un cliente se conecta

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    // Manejador de eventos para cuando un cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id)
    })

    // Manejador de eventos para cuando se envía un nuevo mensaje
    socket.on('send:message', async (messageData) => {
      try {
        // Verificamos si la conversación existe a partir del conversationId
        const conversation = await Conversation.findById(messageData.conversationId)
        if (!conversation) {
          // Manejo de error si la conversación no existe
          socket.emit('error', 'La conversación no existe') // FIXME: crear la conversación cuando no exista directamente
          return
        }

        // Creamos el mensaje y lo asociamos a la conversación
        const date = new Date()
        const message = new Message({
          message: messageData.message,
          author: messageData.author,
          receiver: messageData.receiver,
          date
        })

        // Guardamos el mensaje y actualizamos la conversación
        const savedMessage = await message.save()

        conversation.messages.push(message)
        conversation.lastTalked = date
        await conversation.save()

        // Emitimos el mensaje a todos los clientes conectados en la misma sala (conversación)
        io.to(messageData.conversationId).emit('receive:message', {
          message: savedMessage
        })
      } catch (error) {
        // Manejo de errores generales
        socket.emit('error', 'Error al enviar el mensaje')
        console.error('Error al enviar el mensaje:', error)
      }
    })

    // Manejador de eventos para unirse a una sala (conversación)
    socket.on('join:conversation', (conversationId) => {
      socket.join(conversationId)
    })

    // Manejador de eventos para abandonar una sala (conversación)
    socket.on('leave:conversation', (conversationId) => {
      socket.leave(conversationId)
    })
  })

  // No olvides cerrar la respuesta para Next.js después de manejar Socket.io
  res.end()
}
