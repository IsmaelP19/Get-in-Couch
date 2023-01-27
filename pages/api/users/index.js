import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/middleware'
import bcrypt from 'bcrypt'

export default async function usersRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

    if (req.method === 'POST') {
      const body = req.body

      if (body.password.length < 3) {
        return res.status(400).json({ error: 'password is too short' })
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
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
