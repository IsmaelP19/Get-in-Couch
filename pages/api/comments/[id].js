import Comment from '../../../models/comment'
import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function commentsIdRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'GET') {
      const commentId = req.query?.id

      if (!commentId) {
        return res.status(400).json({ error: 'id is required' })
      }
      let comment = await Comment.findById(commentId)

      if (comment && process.env.NODE_ENV !== 'test') {
        comment = await comment.populate('user', 'username name surname')
      }

      return comment ? res.status(200).json(comment) : res.status(404).json({ error: 'comment not found' })
    } else if (req.method === 'DELETE') {
      const commentId = req.query?.id

      if (!commentId) {
        return res.status(400).json({ error: 'id is required' })
      }
      const comment = await Comment.findById(commentId)

      if (!comment) {
        return res.status(404).json({ error: 'comment not found' })
      } else {
        const property = await Property.findById(comment.property)
        property.comments = property.comments.filter(c => c.toString() !== commentId)
        await property.save()

        comment.remove()
        // this deletes the comment but not from the property comments array

        return res.status(204).end()
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
