import Pusher from 'pusher'
import Conversation from '../../../models/conversation'
import { createConnection } from '../../../utils/utils'

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
})

export default async function handler (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }
    if (req.method === 'POST') {
      const { conversationId, message } = req.body

      const conversation = await Conversation.findById(conversationId)

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' })
      } else {
        if (!conversation.participants.includes(message.author)) {
          return res.status(403).json({ message: 'Forbidden' })
        }
      }

      pusher.trigger('global-channel', 'new-message', { conversationId, message })
      return res.status(201).json(message)
    } else {
      console.log('Method not allowed')
      return res.status(405).end('Method not allowed')
    }
  } catch (error) {
    console.error('Error handling WebSocket connection:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
