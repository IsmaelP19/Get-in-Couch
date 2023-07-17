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

const showMessage = (message, type, setMessage, time, scroll) => {
  setMessage([message, type])
  if (scroll) window.scrollTo(0, 0)
  setTimeout(() => {
    setMessage('')
  }, time)
}

async function getCoordinatesFromAddress (address) {
  const API_KEY = process.env.POSITIONSTACK_API_KEY
  const url = `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${address}&limit=1`
  const response = await fetch(url)
  const data = await response.json()
  const latitude = data.data[0].latitude
  const longitude = data.data[0].longitude
  return { latitude, longitude }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  createConnection,
  errorHandler,
  tokenExtractor,
  showMessage,
  getCoordinatesFromAddress
}
