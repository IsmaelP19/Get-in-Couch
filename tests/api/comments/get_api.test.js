import mongoose from 'mongoose'
import Comment from '../../../models/comment'
import Property from '../../../models/property'
import commentsRouter from '../../../pages/api/comments/index'
import propertiesRouter from '../../../pages/api/properties'

const commentsInDb = async (propertyId) => {
  let comments
  if (propertyId) {
    comments = await Comment.find({ property: propertyId })
  } else {
    comments = await Comment.find({ })
  }
  return comments.map(comment => comment.toJSON())
}

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
}

const newComment = {
  content: 'This is a new comment',
  user: mongoose.Types.ObjectId(),
  rating: 4
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

const req = {
  method: 'GET'
}

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })
})

describe('GET all comments endpoint', () => {
  beforeEach(async () => {
    await Comment.deleteMany({})
    await Property.deleteMany({})
    await propertiesRouter({ method: 'POST', body: newProperty }, res)
  })

  test('When there are no comments in db', async () => {
    const commentsAtStart = await commentsInDb()
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter(req, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith([])

    const commentsAtEnd = await commentsInDb()
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('When there are comments in db', async () => {
    const propertiesAtStart = await propertiesInDb()
    const commentsAtStart = await commentsInDb()
    expect(commentsAtStart).toHaveLength(0)
    await commentsRouter({ method: 'POST', body: { ...newComment, property: propertiesAtStart[0].id } }, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(newComment))

    const commentsAtEnd = await commentsInDb()
    expect(commentsAtEnd).toHaveLength(1)
  })
})

afterAll(async () => {
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await mongoose.connection.close()
})
