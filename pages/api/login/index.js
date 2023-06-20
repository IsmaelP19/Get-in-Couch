import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function loginRouter (req, res) {
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
      }

      if (!body.username) {
        return res.status(400).json({ error: 'username is required' })
      }

      const user = await User.findOne({ username: body.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        return res.status(401).json({
          error: 'invalid username or password'
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      const token = jwt.sign(userForToken, process.env.SECRET)
      res
        .status(200)
        .json({ token, username: user.username, name: user.name })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
