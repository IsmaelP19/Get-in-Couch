import User from '../../../../models/user'
import { errorHandler, createConnection } from '../../../../utils/utils'
import bcrypt from 'bcrypt'

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
        user = user.toJSON()
      }

      return user ? res.json(user) : res.status(404).json({ error: 'user not found' })
    } else if (req.method === 'PUT') {
      // FIXME: not working as expected on tests (not updating the followed and followers arrays) but working on production

      // newFollower wants to follow user
      let user = await User.findOne({ username })
      if (process.env.NODE_ENV === 'test' && user) {
        user = user.toJSON()
      }
      // TODO: add account info update with auth (only the owner of the account can update it)

      // we have to add the follower
      if (user) {
        const body = req.body

        // ###### User is updating its profile ######
        if (body?.updating) {
          const username = body.username.toLowerCase()
          const check = await User.findOne({ username })

          if (check && check.id !== user.id) { // if the username is already taken by another user
            return res.status(400).json({ error: 'User validation failed: expected `username` to be unique' })
          }

          const password = body.password
          let passwordHash
          if (password) {
            password.length < 8 && res.status(400).json({ error: 'password is too short' })
            passwordHash = await bcrypt.hash(password, 10)
          }

          const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (!body.email) {
            return res.status(400).json({ error: 'User validation failed: email: Path `email` is required.' })
          } else if (!emailRegex.test(body.email)) {
            return res.status(400).json({ error: 'User validation failed: email: ' + body.email + ' is not a valid email' })
          }

          const ubication = body?.ubication.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

          const userToUpdate = {
            email: body.email,
            passwordHash,
            username,
            name: body.name,
            surname: body.surname,
            phoneNumber: body.phoneNumber,
            memberSince: user.memberSince,
            description: body.description,
            profilePicture: body.profilePicture,
            followers: user.followers, // will be [] if empty
            following: user.following, // will be [] if empty
            favorites: user.favorites, // will be [] if empty
            properties: user.properties, // will be [] if empty
            ubication,
            visibleStats: body.visibleStats
          }

          try {
            await User.updateOne({ _id: user._id }, userToUpdate)
          } catch (error) {
            if (error.message.includes('phoneNumber_1 dup key')) {
              return res.status(400).json({ error: 'User validation failed: expected `phoneNumber` to be unique' })
            } else if (error.message.includes('username_1 dup key')) {
              return res.status(400).json({ error: 'User validation failed: expected `username` to be unique' })
            } else if (error.message.includes('email_1 dup key')) {
              return res.status(400).json({ error: 'User validation failed: email: expected `email` to be unique' })
            } else {
              return res.status(400).json({ error: error.message })
            }
          }
          return res.status(200).json({ message: 'user succesfully updated' })
          // FIXME: fix tests about following ourselves (now it will understand that we are updating our profile)
          // return res.status(400).json({ error: 'you cannot follow yourself' })
        }
        const newFollowerUsername = req.body.username

        if (newFollowerUsername === username) {
          return res.status(400).json({ error: 'you cannot follow yourself' })
        }

        // we find now the User that is going to be added as a follower
        let newFollower = await User.findOne({ username: newFollowerUsername })
        if (process.env.NODE_ENV === 'test' && newFollower) {
          // passwordHash is removed with the transform function of the model
          // but it is still returned in the response of the mock on tests
          newFollower = newFollower.toJSON()
        }
        let message
        if (newFollower) {
          // first we check if the user is already following the new follower
          if (user.followers.includes(newFollower._id)) {
            // if the user is already following the new follower, we remove it from the followers array
            await User.updateOne({ _id: user._id }, { $pull: { followers: newFollower._id } })
            await User.updateOne({ _id: newFollower._id }, { $pull: { following: user._id } })
            message = `${newFollower.username} succesfully unfollowed ${user.username}`
          } else {
            await User.updateOne({ _id: user._id }, { $push: { followers: newFollower._id } })
            await User.updateOne({ _id: newFollower._id }, { $push: { following: user._id } })
            message = `${newFollower.username} succesfully followed ${user.username}`
          }
        } else {
          return res.status(404).json({ error: 'user who is performing the action not found' })
        }

        res.status(201).json({ message })
      } else {
        res.status(404).json({ error: 'user not found' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
