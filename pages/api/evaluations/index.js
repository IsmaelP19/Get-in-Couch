import User from '../../../models/user'
import Evaluation from '../../../models/evaluation'
import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function evaluationsRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'POST') {
      const { author, user, cleaning, communication, tidyness, respect, noisy } = req.body

      const authorObject = await User.findById(author)
      if (!authorObject) {
        return res.status(400).json({ error: 'author not found' })
      }
      const userObject = await User.findById(user)
      if (!userObject) {
        return res.status(400).json({ error: 'user not found' })
      }

      const property = await Property.findOne({ tenants: { $elemMatch: { user: authorObject._id } } })

      if (!property) {
        return res.status(400).json({ error: 'author does not live in any property' })
      } else if (!property.tenants.find(tenant => tenant.user.toString() === userObject._id.toString())) {
        return res.status(400).json({ error: 'author does not live with the user at this moment' })
      }

      const authorTenantSince = property.tenants.find(tenant => tenant.user.toString() === authorObject._id.toString()).date

      const userTenantSince = property.tenants.find(tenant => tenant.user.toString() === userObject._id.toString()).date

      const daysLivingTogether = Math.floor((new Date() - new Date(Math.max(new Date(authorTenantSince), new Date(userTenantSince)))) / (1000 * 60 * 60 * 24))

      if (daysLivingTogether < 30) {
        return res.status(400).json({ error: 'the author and the user have not been living together for 30 days' })
      }

      // we don't have to check if the author has already evaluated the user because that we will do it in the frontend: if the author has already evaluated the user, the evaluation will be updated instead of created

      const evaluation = new Evaluation({ author, user, cleaning, communication, tidyness, respect, noisy })

      const savedEvaluation = await evaluation.save()
      return res.status(201).json(savedEvaluation)
    } else if (req.method === 'GET') {
      // this will be used to check if there is an existing evaluation with a given author and user
      const { author, user } = req.query

      const authorObject = await User.findById(author)
      if (!authorObject) {
        return res.status(400).json({ error: 'author not found' })
      }
      const userObject = await User.findById(user)
      if (!userObject) {
        return res.status(400).json({ error: 'user not found' })
      }

      const evaluation = await Evaluation.findOne({ author, user })

      return res.status(200).json(evaluation ? { evaluation } : { error: 'the author did not evaluate the user yet' })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
