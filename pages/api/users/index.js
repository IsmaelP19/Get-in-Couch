import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/middleware'
import bcrypt from 'bcrypt'

export default async function usersRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

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
        username: body.username,
        name: body.name,
        surname: body.surname,
        phoneNumber: body.phoneNumber,
        isOwner: body.isOwner
      })

      const savedUser = await user.save()
      res.json(savedUser)
    } else if (req.method === 'GET') {
      let users
      if (process.env.NODE_ENV === 'test') {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        users = await (await User.find({})).map(user => user.toJSON())
      } else {
        users = await User.find({})
      }
      res.json(users)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
