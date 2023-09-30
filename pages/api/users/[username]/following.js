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
          // users will be the array of following populated with the username, name, surname and profilePicture of the user on the query
          user = await User.findOne({ username }).populate({
            path: 'following',
            match: { $or: [{ username: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { surname: { $regex: search, $options: 'i' } }] },
            select: 'username name surname profilePicture avgRating',
            options: {
              skip,
              limit
            }
          })

          total = await User.countDocuments({
            _id: { $in: user.following },
            $or: [
              { username: { $regex: search, $options: 'i' } },
              { name: { $regex: search, $options: 'i' } },
              { surname: { $regex: search, $options: 'i' } }
            ]
          })
        } else {
          total = user.following.length
          user = await User.findOne({ username }).populate({
            path: 'following',
            select: 'username name surname profilePicture avgRating',
            options: {
              skip,
              limit
            }
          })
        }
        const following = await Promise.all(user.following.map(async userObject => {
          const numberOfEvaluations = await Evaluation.countDocuments({ user: userObject._id })
          return {
            username: userObject.username,
            name: userObject.name,
            surname: userObject.surname,
            profilePicture: userObject.profilePicture,
            avgRating: userObject.avgRating,
            numberOfEvaluations
          }
        }))

        return res.status(200).json({ following, total })
      } else {
        return res.status(400).json({ error: 'username is required' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
