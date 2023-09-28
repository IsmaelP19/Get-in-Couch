import User from '../../../../models/user'
import Stat from '../../../../models/stats'
import Evaluation from '../../../../models/evaluation'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function evaluationsUsernameRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }
    const username = req.query?.username
    const user = await User.findOne({ username })

    if (req.method === 'GET') {
      if (user) {
        const evaluations = await Evaluation.find({ user: user._id }).populate('stats.stat', 'name')

        if (evaluations.length === 0) {
          return res.status(200).json({ averageEvaluation: null, total: 0 })
        }

        // now create a single evaluation that will be the average of all evaluations

        let availableStats

        const visibleStatsIds = user?.visibleStats // son los ids de las stats

        if (visibleStatsIds.length === 0) {
          return res.status(200).json({ averageEvaluation: null, total: evaluations.length })
        }

        if (user.isOwner) {
          if (visibleStatsIds) {
            availableStats = await Stat.find({
              $and: [
                { _id: { $in: visibleStatsIds } },
                { $or: [{ action: 'Landlord' }, { action: 'All' }] }
              ]
            })
          } else {
            availableStats = await Stat.find({ $or: [{ action: 'Landlord' }, { action: 'All' }] })
          }
        } else {
          if (visibleStatsIds) {
            availableStats = await Stat.find({
              $and: [
                { _id: { $in: visibleStatsIds } },
                { $or: [{ action: 'Roommate' }, { action: 'All' }, { action: 'Tenant' }] }
              ]
            })
          } else {
            availableStats = await Stat.find({ $or: [{ action: 'Roommate' }, { action: 'All' }, { action: 'Tenant' }] })
          }
        }

        const stats = []

        availableStats.forEach(stat => {
          stats.push({ stat: stat.name, value: 0, action: stat.action })
        })

        evaluations.forEach(evaluation => {
          evaluation.stats.filter(stat => visibleStatsIds?.includes(stat.stat._id)).forEach(stat => {
            stats.find(s => s.stat === stat.stat.name).value += stat.value
          })
        })

        stats.forEach(stat => {
          stat.value /= evaluations.length
        })

        return res.status(200).json({ averageEvaluation: stats, total: evaluations.length })
      } else {
        return res.status(404).json({ error: 'user not found' })
      }
    } else if (req.method === 'PUT') {
      const body = req.body

      const authorObject = await User.findById(body.author)
      if (!authorObject) {
        return res.status(400).json({ error: 'author not found' })
      }

      // HINT: the user is taken from the username

      // check that there has been 7 days since the last evaluation
      const lastEvaluation = await Evaluation.findOne({ author: body.author, user: user._id }).populate('stats.stat', 'name')

      if (!lastEvaluation) {
        return res.status(400).json({ error: 'the author did not evaluate the user yet' })
      }

      const lastEdit = lastEvaluation.lastEdit

      const lastEvaluationAvgRating = lastEvaluation.stats.reduce((acc, stat) => acc + stat.value, 0) / lastEvaluation.stats.length

      const now = Date.now()
      const difference = now - lastEdit
      const days = difference / (1000 * 60 * 60 * 24)

      if (days < 7) {
        return res.status(400).json({ error: 'you have to wait 7 days to evaluate the same person again' })
      }

      const stats = []
      lastEvaluation.stats.forEach(stat => {
        stats.push({ stat: stat.stat, value: body[stat.stat.name] })
      })

      const newEvaluation = {
        author: body.author,
        user: user._id,
        stats,
        lastEdit: Date.now()
      }

      const avgRating = stats.reduce((acc, stat) => acc + stat.value, 0) / stats.length

      const totalEvaluationsBefore = await Evaluation.countDocuments({ user }) // at least 1

      const oldRating = user?.avgRating * totalEvaluationsBefore - lastEvaluationAvgRating

      const newAvgRating = (oldRating + avgRating) / totalEvaluationsBefore

      await User.findByIdAndUpdate(user, { avgRating: newAvgRating }, { new: true })

      const evaluation = await Evaluation.findOneAndUpdate({ author: body.author, user: user._id }, newEvaluation, { new: true })

      return res.status(200).json(evaluation)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
