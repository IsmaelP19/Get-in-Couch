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

      const user = new User({
        email: body.email,
        passwordHash,
        username: body.username?.toLowerCase(),
        name: body.name,
        surname: body.surname,
        phoneNumber: body.phoneNumber,
        isOwner: body.isOwner,
        description: body.description,
        profilePicture: body.profilePicture
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

      const search = req.query?.search
      if (search) {
        users = await User.find({ $or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { surname: { $regex: search, $options: 'i' } }] }, 'username name surname profilePicture').sort({ memberSince: -1 }).skip(skip).limit(limit)
        total = await User.countDocuments({ $or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { surname: { $regex: search, $options: 'i' } }] })
      } else {
        if (process.env.NODE_ENV === 'test') {
          // passwordHash is removed with the transform function of the model
          // but it is still returned in the response of the mock on tests
          users = await (await User.find({}).sort({ memberSince: -1 }).skip(skip).limit(limit)).map(user => user.toJSON())
        } else {
          users = await User.find({}, 'username name surname profilePicture').sort({ memberSince: -1 }).skip(skip).limit(limit)
        }
        total = await User.countDocuments({})
      }

      return res.status(200).json({ users, total })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
