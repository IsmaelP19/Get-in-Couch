import Conversation from '../../../models/conversation'
import Message from '../../../models/message'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function messagesRouter (req, res) {
  try {
    await createConnection()
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }
    if (req.method === 'POST') {
      const { message, author, receiver } = req.body

      if (!message) {
        return res.status(400).json({ error: 'message is required' })
      }
      if (!author) {
        return res.status(400).json({ error: 'author is required' })
      }
      if (!receiver) {
        return res.status(400).json({ error: 'receiver is required' })
      }

      let conversation = await Conversation.findOne({
        participants: {
          $all: [author, receiver]
        }
      })

      if (!conversation) { // Si no existe la conversación, la creamos
        conversation = new Conversation({
          messages: [],
          participants: [author, receiver]
        })
      }

      // create the message
      const newMessage = new Message({ message, author, receiver })
      conversation.messages.push(newMessage)

      await newMessage.save()
      await conversation.save()

      return res.status(201).json(newMessage)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
