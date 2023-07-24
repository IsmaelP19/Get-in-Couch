import Conversation from '../../../models/conversation'
// eslint-disable-next-line no-unused-vars
import Message from '../../../models/message'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function conversationsIdRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }
    const conversationId = req.query?.id
    if (!conversationId) return res.status(400).json({ error: 'id is required' })

    if (req.method === 'GET') {
      // const conversation = await Conversation.findById(conversationId).populate('messages', 'message author receiver date read')
      const conversation = await Conversation.findById(conversationId)
        .populate({
          path: 'messages',
          populate: {
            path: 'author receiver',
            select: { username: 1, name: 1, surname: 1, profilePicture: 1 }
          }

        })

      // if (conversation && process.env.NODE_ENV !== 'test') {
      //   conversation = await conversation
      //     .populate('messages', 'message author receiver date read')
      // }
      if (conversation.messages) {
        conversation.messages.sort((a, b) => {
          const aDate = new Date(a.date)
          const bDate = new Date(b.date)
          return aDate - bDate
        })
      }

      return conversation ? res.status(200).json(conversation.messages) : res.status(404).json({ error: 'conversation not found' })
    }
    // else if (req.method === 'DELETE') {
    //   const comment = await Comment.findById(commentId)

    //   if (!comment) {
    //     return res.status(404).json({ error: 'comment not found' })
    //   } else {
    //     const property = await Property.findById(comment.property)
    //     property.comments = property.comments.filter(c => c.toString() !== commentId)
    //     await property.save()

    //     await Comment.findByIdAndDelete(commentId)

    //     return res.status(204).end()
    //   }
    // } else if (req.method === 'PUT') {
    //   const comment = await Comment.findById(commentId)

    //   if (!comment) {
    //     return res.status(404).json({ error: 'comment not found' })
    //   }

    //   const body = req.body // only will change the likes array

    //   if (!body.likes) {
    //     return res.status(400).json({ error: 'likes array is required' })
    //   }

    //   const likes = [...new Set(body.likes)] // to prevent duplicates. For some reason, there are some times that the same user likes the same comment twice

    //   await Comment.findByIdAndUpdate(commentId, { likes }, { new: true })
    //   return res.status(200).end()
    // }
  } catch (error) {
    console.log(error)
    errorHandler(error, req, res)
  }
}
