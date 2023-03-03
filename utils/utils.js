import mongoose from 'mongoose'
import { connectMongo } from './connectMongo'

const logger = require('./logger')

const requestLogger = (request, response) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const createConnection = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('MONGO IS NOT CONNECTED, CONNECTING NOW')
      await connectMongo()
      console.log('CONNECTED TO MONGO SUCCESSFULLY')
    }
  } catch (error) {
    console.log('ERROR CONNECTING TO MONGO', error)
  }
}

const errorHandler = (error, request, response) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
}

const tokenExtractor = (request, response) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
}

const showMessage = (message, type, setMessage, time) => {
  setMessage([message, type])
  window.scrollTo(0, 0)
  setTimeout(() => {
    setMessage('')
  }, time)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  createConnection,
  errorHandler,
  tokenExtractor,
  showMessage
}
