import Property from '../../../../models/property'
import User from '../../../../models/user'
import Evaluation from '../../../../models/evaluation'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function usersUsernameRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'GET') {
      const { username } = req.query
      if (!username) {
        return res.status(400).json({ error: 'username is required' })
      }
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      }

      let users
      let total

      let limit = req.query?.limit
      if (limit === 'undefined' || limit === undefined) limit = 5
      let page = req.query?.page
      if (page === 'undefined' || page === undefined) page = 1
      const skip = limit * (page - 1)

      const search = req.query?.search
      const avgRating = req.query?.avgRating
      const ubication = req.query?.ubication
      const type = req.query?.type // tenantRelated, owner or tenant

      const followerIds = user.followers.map(follower => follower.toString())
      console.log(followerIds)
      // const idConditions = [{ _id: { $in: followerIds } }]

      const tenantsIds = await Property.distinct('tenants.user')

      let filter = { }

      if (type === 'tenant') {
        // idConditions.push({ isOwner: false })
        // idConditions.push({ _id: { $nin: tenantsIds.filter(id => id !== null).map(id => id.toString()) } })
        filter = {
          isOwner: false,
          _id: { $nin: tenantsIds.filter(id => id !== null).map(id => id.toString()) }
        }
      }

      if (type === 'owner') {
        // idConditions.push({ isOwner: true })
        filter = {
          isOwner: true
        }
      }

      if (type === 'tenantRelated') {
        filter = {
          _id: { $in: tenantsIds.filter(id => id !== null).map(id => id.toString()) }
        }
      }

      // const filter = { $and: idConditions }

      if (search) {
        const $regex = search
        const $options = 'i'
        filter.$or = [
          { username: { $regex, $options } },
          { name: { $regex, $options } },
          { surname: { $regex, $options } },
          { description: { $regex, $options } }
        ]
      }

      if (avgRating) {
        filter.avgRating = { $gte: parseInt(avgRating) }
      }

      if (ubication) {
        const $regex = ubication
        const $options = 'i'
        filter.ubication = { $regex, $options }
      }

      try {
        users = await User.find(filter).sort({ memberSince: -1 }).skip(skip).limit(limit)
        total = await User.countDocuments(filter)

        // const resUsers = users.filter(u => followerIds.includes(u._id.toString()))
        // total = resUsers.length

        for (const user of users) {
          const userId = user._id.toString()
          const numberOfEvaluations = await Evaluation.countDocuments({ user: userId })
          user._doc.numberOfEvaluations = numberOfEvaluations
        }

        if (process.env.NODE_ENV === 'test') {
          users = await User.find(filter).sort({ memberSince: -1 }).skip(skip).limit(limit)
          users = users.map(u => u.toJSON())
        }
        return res.status(200).json({ users, total })
      } catch (error) {
        return res.status(500).json({ error: error?.message })
      }

      /*
      if (search) {
        // users will be the array of followers populated with the username, name, surname and profilePicture of the user on the query

        user = await User.findOne({ username }).populate({
          path: 'followers',
          match: { $or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { surname: { $regex: search, $options: 'i' } }] },
          select: 'username name surname profilePicture',
          options: {
            skip,
            limit
          }
        })

        total = await User.countDocuments({
          _id: { $in: user.followers },
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { surname: { $regex: search, $options: 'i' } }
          ]
        })
      } else {
        total = user.followers.length
        user = await User.findOne({ username }).populate({
          path: 'followers',
          select: 'username name surname profilePicture',
          options: {
            skip,
            limit
          }
        })
      }
      */
      // const followers = user.followers.map(follower => {
      //   return {
      //     username: follower.username,
      //     name: follower.name,
      //     surname: follower.surname,
      //     profilePicture: follower.profilePicture
      //   }
      // })
      // return res.status(200).json({ followers, total })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
