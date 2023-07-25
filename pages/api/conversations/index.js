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
      }).populate('participants', 'username name surname profilePicture')

      return res.status(200).json(conversations)
    } else if (req.method === 'POST') {
      const body = req.body

      if (!body.participants) {
        return res.status(400).json({ error: 'participants array is required' })
      }

      const participants = [...new Set(body.participants)]

      if (participants.length !== 2) {
        return res.status(400).json({ error: 'participants array must have 2 different participants' })
      }

      // check if the conversation between those participants already exists
      let conversation = await Conversation.findOne({
        participants: {
          $all: participants
        }
      })

      if (conversation) {
        return res.status(201).json({ message: 'conversation already exists', conversation }) // status 201 because if not throws an error in the frontend before redirecting to the chat
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
