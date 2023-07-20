import Conversation from '../../../models/conversation'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function conversationsRouter (req, res) {
  try {
    await createConnection()
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'GET') {
      const conversations = await Conversation.find({
        participants: {
          $in: [req.query?.user]
        }
      })

      return res.status(200).json(conversations)
    } else if (req.method === 'POST') {
      const body = req.body

      if (!body.participants) {
        return res.status(400).json({ error: 'participants array is required' })
      }

      const participants = [...new Set(body.participants)]

      // check if the conversation between those participants already exists
      let conversation = await Conversation.findOne({
        participants: {
          $all: participants
        }
      })

      if (conversation) {
        return res.status(400).json({ message: 'conversation already exists', conversation })
      }

      conversation = new Conversation({
        messages: [],
        participants
      })

      await conversation.save()

      return res.status(201).json(conversation)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
