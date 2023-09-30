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
      if (username) {
        let user = await User.findOne({ username })

        if (!user) {
          return res.status(404).json({ error: 'user not found' })
        }

        let total

        let limit = req.query?.limit
        if (limit === 'undefined' || limit === undefined) limit = 5
        let page = req.query?.page
        if (page === 'undefined' || page === undefined) page = 1
        const skip = limit * (page - 1)

        const search = req.query?.search
        if (search) {
          // users will be the array of followers populated with the username, name, surname and profilePicture of the user on the query

          user = await User.findOne({ username }).populate({
            path: 'followers',
            match: { $or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { surname: { $regex: search, $options: 'i' } }] },
            select: 'username name surname profilePicture avgRating',
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
            select: 'username name surname profilePicture avgRating',
            options: {
              skip,
              limit
            }
          })
        }
        const followers = await Promise.all(user.followers.map(async follower => {
          const numberOfEvaluations = await Evaluation.countDocuments({ user: follower._id })
          return {
            username: follower.username,
            name: follower.name,
            surname: follower.surname,
            profilePicture: follower.profilePicture,
            avgRating: follower.avgRating,
            numberOfEvaluations
          }
        }))

        return res.status(200).json({ followers, total })
      } else {
        return res.status(400).json({ error: 'username is required' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
