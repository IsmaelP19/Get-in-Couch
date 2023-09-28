import Stat from '../../../models/stats'
import { errorHandler, createConnection } from '../../../utils/utils'

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

      if (!body.name) {
        return res.status(400).json({ error: 'name is required' })
      }

      if (!body.action) {
        return res.status(400).json({ error: 'action is required' })
      } else if (!['Roommate', 'Landlord', 'Tenant', 'All'].includes(body.action)) {
        return res.status(400).json({ error: 'action must be one of the following: Roommate, Landlord, Tenant' })
      }

      const stat = new Stat({
        name: body.name,
        action: body.action
      })

      const savedStat = await stat.save()

      res.status(201).json(savedStat)
    } else if (req.method === 'GET') {
      const stats = await Stat.find({})
      res.json(stats)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
