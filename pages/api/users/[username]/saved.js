import User from '../../../../models/user'
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
      if (username) {
        let user = await User.findOne({ username })
        if (user) {
          const page = parseInt(req.query?.page) || 1
          if (typeof parseInt(page) !== 'number') return res.status(400).json({ error: `Page must be a valid number (page is ${parseInt(1)})` })

          const limit = parseInt(req.query?.limit) || 8
          if (typeof parseInt(limit) !== 'number') return res.status(400).json({ error: 'Limit must be a valid number' })

          const skip = limit * (page - 1)

          const total = user.favorites.length

          user = await User.findOne({ username }).populate({
            path: 'favorites',
            options: {
              skip,
              limit
            }
          })

          const favorites = user.favorites
          return res.status(200).json({ favorites, total })
        }
        return res.status(404).json({ error: 'user not found' })
      }
      return res.status(400).json({ error: 'userId is required' })
    } else if (req.method === 'PUT') {
      const { body } = req
      const { username } = req.query

      if (username) {
        const user = await User.findOne({ username })
        if (user) {
          const favorites = user.favorites
          const { property } = body
          const index = favorites.indexOf(property)
          if (index === -1) {
            favorites.push(property)
          } else {
            favorites.splice(index, 1)
          }
          await user.save()
          return res.status(200).json(favorites)
        }
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
