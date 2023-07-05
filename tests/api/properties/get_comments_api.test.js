import mongoose from 'mongoose'
import Property from '../../../models/property'
import propertiesRouter from '../../../pages/api/properties'
import Comment from '../../../models/comment'
import commentsRouter from '../../../pages/api/comments/index'
import commentsIdRouter from '../../../pages/api/comments/[id]'
import propertiesIdCommentsRouter from '../../../pages/api/properties/[id]/comments'

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
}

const commentsInDb = async (propertyId) => {
  const comments = await Comment.find({ property: propertyId })
  return comments.map(comment => comment.toJSON())
}

const newProperty = {
  title: 'Test property',
  description: 'Test description',
  price: 800,

  street: 'Test street',
  city: 'Test city',
  country: 'Test country',
  zipCode: '41510',

  propertyType: 'Apartamento',
  propertySize: 100,
  numberOfBathrooms: 1,
  numberOfBedrooms: 1,
  furniture: 'Amueblado',
  parking: 'Parking',
  airConditioning: true,
  heating: false,
  owner: mongoose.Types.ObjectId()
}

const newComment = {
  content: 'This is a new comment. At least, there should be 50 characters.',
  user: mongoose.Types.ObjectId(),
  rating: 3
}

const req = {
  method: 'POST'
}

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {})
})

describe('GET all comments from a property endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
    await Comment.deleteMany({})
    await propertiesRouter({ ...req, body: newProperty }, res)
    const propertiesAtStart = await propertiesInDb()

    await commentsRouter({ ...req, body: { ...newComment, property: propertiesAtStart[0].id } }, res)
  })

  test('When there are comments in db', async () => {
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'GET',
      query: { id: propertiesAtStart[0].id }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdCommentsRouter(req1, res1)
    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledTimes(1)
    expect(res1.json).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          content: commentsAtStart[0].content,
          user: commentsAtStart[0].user,
          rating: commentsAtStart[0].rating,
          property: commentsAtStart[0].property
        })
      ]
    )
  })

  test('When the property does not exist', async () => {
    const req1 = {
      method: 'GET',
      query: { id: mongoose.Types.ObjectId() }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdCommentsRouter(req1, res1)
    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledTimes(1)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property not found' })
  })

  test('When there are no comments of a given property', async () => {
    const propertiesAtStart = await propertiesInDb()
    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    await commentsIdRouter({ method: 'DELETE', query: { id: commentsAtStart[0].id } }, res)

    const req1 = {
      method: 'GET',
      query: { id: propertiesAtStart[0].id }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdCommentsRouter(req1, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledTimes(1)
    expect(res1.json).toHaveBeenCalledWith([])
  })

  test('When the property id is invalid', async () => {
    const req1 = {
      method: 'GET',
      query: { id: 'invalidId' }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdCommentsRouter(req1, res1)
    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledTimes(1)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })
})

afterAll(async () => {
  await Property.deleteMany({})
  await mongoose.connection.close()
})
