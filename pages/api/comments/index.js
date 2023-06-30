import Comment from '../../../models/comment'
import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function commentsRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'POST') {
      const body = req.body

      if (!body.content) {
        return res.status(400).json({ error: 'content is required' })
      } else if (!body.user) {
        return res.status(400).json({ error: 'user is required' })
      } else if (!body.property) {
        return res.status(400).json({ error: 'property is required' })
      }

      const property = await Property.findById(body.property)
      if (!property) {
        return res.status(404).json({ error: 'property not found' })
      }

      const comment = new Comment({
        content: body.content,
        user: body.user,
        property: body.property,
        rating: body.rating,
        images: body.images || [],
        likes: []
      })

      const savedComment = await comment.save()
      await Property.findByIdAndUpdate(body.property, { $push: { comments: savedComment._id } })
      return res.status(201).json(savedComment)
    } else if (req.method === 'GET') {
      const page = req.query?.page || 1
      if (page !== parseInt(page)) {
        return res.status(400).json({ error: 'Page must be a valid number' })
      }
      const limit = req.query?.limit || 10
      if (limit !== parseInt(limit)) {
        return res.status(400).json({ error: 'Limit must be a valid number' })
      }
      const skip = (page - 1) * limit

      const comments = await Comment.find({})
        .skip(skip)
        .limit(limit)

      return res.status(200).json({ comments, page, limit, total: await Comment.countDocuments({}) })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
