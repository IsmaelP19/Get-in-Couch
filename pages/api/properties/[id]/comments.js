import Property from '../../../../models/property'
import Comment from '../../../../models/comment'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function propertiesIdCommentsRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'GET') {
      const propertyId = req.query?.id
      const property = await Property.findById(propertyId)
      if (!property) {
        return res.status(404).json({ error: 'property not found' })
      } else if (property.comments.length === 0) {
        return res.status(200).json([])
      } else if (property.comments.length > 0) {
        let limit = req.query?.limit
        if (limit === 'undefined' || limit === undefined) limit = 5
        let page = req.query?.page
        if (page === 'undefined' || page === undefined) page = 1
        const skip = limit * (page - 1)

        let comments = await Comment.find({ property: propertyId }).sort({ publishDate: -1 }).skip(skip).limit(limit)

        if (comments && process.env.NODE_ENV !== 'test') {
          comments = await Promise.all(comments.map(async comment => await comment.populate('user', 'username name surname profilePicture')))
        }
        const total = await Comment.countDocuments({ property: propertyId })
        const pages = Math.ceil(total / limit)
        return res.status(200).json({ comments, pages })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
