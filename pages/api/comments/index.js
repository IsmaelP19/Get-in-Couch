import Comment from '../../../models/comment'
import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function commentsRouter (req, res) {
  try {
    await createConnection()
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

      if (!property?.tenants.some(tenant => tenant.user.toString() === body.user) && !property?.tenantsHistory.some(tenant => tenant.user.toString() === body.user)) {
        return res.status(403).json({ error: 'Only actual and old tenants are able to comment a property' })
      }

      // if there already exists a comment from the same user for the same property, we update it
      const commentToUpdate = await Comment.findOne({ user: body.user, property: body.property })

      const comment = new Comment({
        content: body.content,
        user: body.user,
        property: body.property,
        rating: body.rating,
        likes: []
      })

      let savedComment
      if (commentToUpdate) {
        commentToUpdate.content = comment.content
        commentToUpdate.rating = comment.rating
        commentToUpdate.likes = comment.likes
        savedComment = await commentToUpdate.save()
      } else {
        savedComment = await comment.save()
        property.comments = property.comments.concat(savedComment._id)
      }

      const avgRating = await Comment.aggregate([
        { $match: { property: savedComment.property } },
        { $group: { _id: '$property', avgRating: { $avg: '$rating' } } }
      ])

      property.avgRating = avgRating[0].avgRating
      await property.save()

      return res.status(201).json({ savedComment, avgRating: avgRating[0].avgRating })
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
