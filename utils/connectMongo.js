import mongoose from 'mongoose'

let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_URI_TEST
}

const connectMongo = async () => mongoose.connect(MONGODB_URI)

const disconnectMongo = async () => mongoose.connection.close()

export { connectMongo, disconnectMongo }
