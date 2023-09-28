import User from '../../../models/user'
import Evaluation from '../../../models/evaluation'
import Property from '../../../models/property'
import Stat from '../../../models/stats'
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
      const body = req.body

      const authorObject = await User.findById(body.author)
      if (!authorObject) {
        return res.status(400).json({ error: 'author not found' })
      }
      const userObject = await User.findById(body.user)
      if (!userObject) {
        return res.status(400).json({ error: 'user not found' })
      }

      // check if the author and user are the same person
      if (authorObject._id.toString() === userObject._id.toString()) {
        return res.status(400).json({ error: 'the author and the user are the same person' })
      }

      let daysRelationed = 0
      const stats = []
      // let evaluationAttributes = {}

      /*
      * Case 1: Tenant. The author is the property owner. In that case, we will have to check if the user is a tenant of one of the properties of the owner.
      */
      if (authorObject.isOwner) {
        const property = await Property.findOne({ tenants: { $elemMatch: { user: userObject._id } } })
        if (!property?.owner === authorObject._id.toString()) {
          return res.status(400).json({ error: 'The user is not a tenant of the author' })
        }
        const tenantSince = property.tenants.find(tenant => tenant.user.toString() === userObject._id.toString()).date
        daysRelationed = Math.floor((new Date() - new Date(tenantSince)) / (1000 * 60 * 60 * 24))

        const availableStats = await Stat.find({ $or: [{ action: 'Tenant' }, { action: 'All' }] })
        availableStats.forEach(stat => {
          stats.push({ stat: stat.id, value: body[stat.name] })
        })

        /*
        * Case 2: Roommate. The author is a tenant. In that case, we will have to check if the author and the user live together in the same property.
        */
      } else if (!authorObject.isOwner && !userObject.isOwner) {
        const property = await Property.findOne({ tenants: { $elemMatch: { user: authorObject._id } } })
        if (!property.tenants.find(tenant => tenant.user.toString() === userObject._id.toString())) {
          return res.status(400).json({ error: 'The author does not live with the user at this moment' })
        }

        const authorTenantSince = property.tenants.find(tenant => tenant.user.toString() === authorObject._id.toString()).date

        const userTenantSince = property.tenants.find(tenant => tenant.user.toString() === userObject._id.toString()).date

        daysRelationed = Math.floor((new Date() - new Date(Math.max(new Date(authorTenantSince), new Date(userTenantSince)))) / (1000 * 60 * 60 * 24))

        const availableStats = await Stat.find({ $or: [{ action: 'Roommate' }, { action: 'All' }] })
        availableStats.forEach(stat => {
          stats.push({ stat: stat.id, value: body[stat.name] })
        })

        /*
        * Case 3: Landlord. The author is a tenant and the user is the owner. In that case, we will have to check if the author lives in one of the properties of the user.
        */
      } else if (!authorObject.isOwner && userObject.isOwner) {
        const property = await Property.findOne({ tenants: { $elemMatch: { user: authorObject._id } } })
        if (!property?.owner === userObject._id.toString()) {
          return res.status(400).json({ error: 'The user is not the author\'s landlord' })
        }
        const tenantSince = property.tenants.find(tenant => tenant.user.toString() === authorObject._id.toString()).date
        daysRelationed = Math.floor((new Date() - new Date(tenantSince)) / (1000 * 60 * 60 * 24))

        const availableStats = await Stat.find({ $or: [{ action: 'Landlord' }, { action: 'All' }] })
        availableStats.forEach(stat => {
          stats.push({ stat: stat.id, value: body[stat.name] })
        })
      }
      // we don't have to check if the author has already evaluated the user because that we will do it in the frontend: if the author has already evaluated the user, the evaluation will be updated instead of created

      if (daysRelationed < 30) {
        return res.status(400).json({ error: 'The author and the user have not been relationed for 30 days' })
      }

      const evaluation = new Evaluation({ author: body.author, user: body.user, stats, lastEdit: Date.now() })

      const avgRating = evaluation.stats.reduce((acc, stat) => acc + stat.value, 0) / stats.length

      const totalEvaluationsBefore = await Evaluation.countDocuments({ user: body.user })

      const oldAvgRating = userObject?.avgRating || 0
      await User.findByIdAndUpdate(body.user, { avgRating: (oldAvgRating * totalEvaluationsBefore + avgRating) / (totalEvaluationsBefore + 1) }, { new: true })

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

      const evaluation = await Evaluation.findOne({ author, user }).populate('stats.stat', 'name') // TODO: example for populating the name of the stats

      return res.status(200).json(evaluation ? { evaluation } : { error: 'the author did not evaluate the user yet' })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
