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
        const comments = await Comment.find({ property: propertyId })
        return res.status(200).json(comments)
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
