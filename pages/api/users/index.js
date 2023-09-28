import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/utils'
import bcrypt from 'bcrypt'

export default async function usersRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'POST') {
      const body = req.body

      if (!body.password) {
        return res.status(400).json({ error: 'password is required' })
      } else if (body.password.length < 8) {
        return res.status(400).json({ error: 'password is too short' })
      }

      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!body.email) {
        return res.status(400).json({ error: 'User validation failed: email: Path `email` is required.' })
      } else if (!emailRegex.test(body.email)) {
        return res.status(400).json({ error: 'User validation failed: email: ' + body.email + ' is not a valid email' })
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const ubication = body?.ubication?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

      const user = new User({
        email: body.email,
        passwordHash,
        username: body.username?.toLowerCase(),
        name: body.name,
        surname: body.surname,
        phoneNumber: body.phoneNumber,
        isOwner: body.isOwner,
        description: body.description,
        profilePicture: body.profilePicture,
        ubication,
        visibleStats: body.visibleStats
      })

      const savedUser = await user.save()

      res.status(201).json(savedUser)
    } else if (req.method === 'GET') {
      let users
      let total

      let limit = req.query?.limit
      if (limit === 'undefined' || limit === undefined) limit = 5
      let page = req.query?.page
      if (page === 'undefined' || page === undefined) page = 1
      const skip = limit * (page - 1)

      const onlyTenants = req.query?.onlyTenants // a boolean

      const search = req.query?.search
      const avgRating = req.query?.avgRating
      const ubication = req.query?.ubication

      let filter = {}

      if (onlyTenants) filter = { isOwner: false }

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
        users = await User.find(filter, 'username name surname profilePicture description isOwner avgRating ubication').sort({ memberSince: -1 }).skip(skip).limit(limit)
        total = await User.countDocuments(filter)

        if (process.env.NODE_ENV === 'test') {
          users = await User.find(filter).sort({ memberSince: -1 }).skip(skip).limit(limit)
          users = users.map(u => u.toJSON())
        }

        return res.status(200).json({ users, total })
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching users.' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
