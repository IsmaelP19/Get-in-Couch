import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/middleware'

export default async function usersIdRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

    const userId = req.query.id

    if (req.method === 'DELETE') { // TODO: add auth
      const user = await User.findById(userId) // first we check if the user exists to return a 404 if not
      if (user) {
        await User.findByIdAndRemove(userId)
        res.status(204).json({ message: 'user succesfully deleted' })
      } else {
        res.status(404).json({ error: 'user not found' })
      }
    } else if (req.method === 'GET') {
      let user = await User.findById(userId)
      if (process.env.NODE_ENV === 'test') {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        if (user) user = user.toJSON()
      }

      user ? res.json(user) : res.status(404).json({ error: 'user not found' })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
