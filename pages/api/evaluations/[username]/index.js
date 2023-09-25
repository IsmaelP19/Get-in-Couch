import User from '../../../../models/user'
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
        const evaluations = await Evaluation.find({ user: user._id })

        if (evaluations.length === 0) {
          return res.status(200).json({ averageEvaluation: null, total: 0 })
        }

        // now create a single evaluation that will be the average of all evaluations
        const averageEvaluation = {
          cleaning: 0,
          communication: 0,
          tidyness: 0,
          respect: 0,
          noisy: 0
        }

        evaluations.forEach(evaluation => {
          averageEvaluation.cleaning += evaluation.cleaning
          averageEvaluation.communication += evaluation.communication
          averageEvaluation.tidyness += evaluation.tidyness
          averageEvaluation.respect += evaluation.respect
          averageEvaluation.noisy += evaluation.noisy
        })

        const total = evaluations.length

        averageEvaluation.cleaning /= total
        averageEvaluation.communication /= total
        averageEvaluation.tidyness /= total
        averageEvaluation.respect /= total
        averageEvaluation.noisy /= total

        return res.status(200).json({ averageEvaluation, total })
      } else {
        return res.status(404).json({ error: 'user not found' })
      }
    } else if (req.method === 'PUT') {
      const { author, cleaning, communication, tidyness, respect, noisy } = req.body

      const authorObject = await User.findById(author)
      if (!authorObject) {
        return res.status(400).json({ error: 'author not found' })
      }

      // check that there has been 7 days since the last evaluation
      const lastEvaluation = await Evaluation.findOne({ author, user: user._id })

      if (!lastEvaluation) {
        return res.status(400).json({ error: 'the author did not evaluate the user yet' })
      }

      const lastEdit = lastEvaluation.lastEdit
      const lastEvaluationAvgRating = (lastEvaluation.cleaning + lastEvaluation.communication + lastEvaluation.tidyness + lastEvaluation.respect + lastEvaluation.noisy) / 5
      const now = Date.now()
      const difference = now - lastEdit
      const days = difference / (1000 * 60 * 60 * 24)

      if (days < 7) {
        return res.status(400).json({ error: 'you have to wait 7 days to evaluate the same roommate again' })
      }

      const newEvaluation = {
        author,
        user: user._id,
        cleaning,
        communication,
        tidyness,
        respect,
        noisy,
        lastEdit: Date.now()
      }

      const avgRating = (cleaning + communication + tidyness + respect + noisy) / 5

      const totalEvaluationsBefore = await Evaluation.countDocuments({ user }) // at least 1
      // we have to modify the old avgRating since the evaluation has been modified

      const oldRating = user?.avgRating * totalEvaluationsBefore - lastEvaluationAvgRating

      const newAvgRating = (oldRating + avgRating) / totalEvaluationsBefore

      await User.findByIdAndUpdate(user, { avgRating: newAvgRating }, { new: true })

      const evaluation = await Evaluation.findOneAndUpdate({ author, user: user._id }, newEvaluation, { new: true })

      return res.status(200).json(evaluation)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
