import Message from '../../../models/message'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function messagesIdRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }
    const messageId = req.query?.id
    if (!messageId) return res.status(400).json({ error: 'id is required' })

    if (req.method === 'GET') {
      // const conversation = await Conversation.findById(conversationId).populate('messages', 'message author receiver date read')
      const message = await Message.findById(messageId)
        .populate('author', 'username name surname profilePicture')

      // if (conversation && process.env.NODE_ENV !== 'test') {
      //   conversation = await conversation
      //     .populate('messages', 'message author receiver date read')
      // }
      // if (conversation.messages) {
      //   conversation.messages.sort((a, b) => {
      //     const aDate = new Date(a.date)
      //     const bDate = new Date(b.date)
      //     return aDate - bDate
      //   })
      // }

      return message ? res.status(200).json(message) : res.status(404).json({ error: 'message not found' })
    }
  } catch (error) {
    console.log(error)
    errorHandler(error, req, res)
  }
}
