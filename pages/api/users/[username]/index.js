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

    const username = req.query.username

    if (req.method === 'DELETE') { // TODO: add auth
      const user = await User.findOne({ username }) // first we check if the user exists to return a 404 if not. (PS: username is unique)
      if (user) {
        await User.findOneAndRemove({ username })
        res.status(200).json({ message: 'user succesfully deleted' })
      } else {
        res.status(404).json({ error: 'user not found' })
      }
    } else if (req.method === 'GET') {
      let user = await User.findOne({ username })

      if (user && process.env.NODE_ENV === 'test') {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        user = user.toJSON()
      }

      user ? res.json(user) : res.status(404).json({ error: 'user not found' })
    } else if (req.method === 'PUT') {
      let user = await User.findOne({ username })
      if (process.env.NODE_ENV === 'test' && user) {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        user = user.toJSON()
      }
      // TODO: add account info update with auth (only the owner of the account can update it)

      // we have to add the follower
      if (user) {
        const newFollowerUsername = req.body.username
        if (newFollowerUsername === username) return res.status(400).json({ error: 'you cannot follow yourself' })

        // we find now the User that is going to be added as a follower
        let newFollower = await User.findOne({ username: newFollowerUsername })
        if (process.env.NODE_ENV === 'test' && newFollower) {
          // passwordHash is removed with the transform function of the model
          // but it is still returned in the response of the mock on tests
          newFollower = newFollower.toJSON()
        }

        if (newFollower) {
          // first we check if the user is already following the new follower
          if (user.followers.includes(newFollower._id)) {
          // if the user is already following the new follower, we remove it from the followers array
            await User.updateOne({ _id: user._id }, { $pull: { followers: newFollower._id } })
            await User.updateOne({ _id: newFollower._id }, { $pull: { followed: user._id } })
          } else {
            await User.updateOne({ _id: user._id }, { $push: { followers: newFollower._id } })
            await User.updateOne({ _id: newFollower._id }, { $push: { followed: user._id } })
          }
        } else {
          return res.status(404).json({ error: 'user who is performing the action not found' })
        }

        res.status(201).json({ message: 'user succesfully updated' })
      } else {
        res.status(404).json({ error: 'user not found' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
