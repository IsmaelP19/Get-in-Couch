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
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await propertiesRouter({ method: 'POST', body: newProperty }, res)

  const propertiesAtStart = await propertiesInDb()
  for (let i = 0; i < 20; i++) {
    await commentsRouter({ method: 'POST', body: { ...newComment, property: propertiesAtStart[0].id } }, res)
  }
}, 90000)

describe('GET all comments endpoint with pagination', () => {
  test('Check there are 20 comments in total', async () => {
    const commentsAtStart = await commentsInDb()
    expect(commentsAtStart).toHaveLength(20)
  })

  test('Check there are 10 comments in the first page (limit not specified)', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 1 } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ comments: expect.any(Array), total: expect.any(Number) }))
    expect(res1.json.mock.calls[0][0].comments).toHaveLength(10)
  })

  test('Check there are n comments in the first page (limit = n)', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 1, limit: 5 } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ comments: expect.any(Array), total: expect.any(Number) }))
    expect(res1.json.mock.calls[0][0].comments).toHaveLength(5)
  })

  test('Check there are 10 comments in the second page (limit not specified)', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 2 } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ comments: expect.any(Array), total: expect.any(Number) }))
    expect(res1.json.mock.calls[0][0].comments).toHaveLength(10)
  })

  test('Check there are n comments in the second page (limit = n)', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 2, limit: 5 } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ comments: expect.any(Array), total: expect.any(Number) }))
    expect(res1.json.mock.calls[0][0].comments).toHaveLength(5)
  })

  test('Check there are 0 comments in another page', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 5 } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ comments: expect.any(Array), total: expect.any(Number) }))
    expect(res1.json.mock.calls[0][0].comments).toHaveLength(0)
  })

  test('Check error is handled when page is not a number', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { page: 'a' } }, res1)
    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'Page must be a valid number' })
  })

  test('Check error is handled when limit is not a number', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, query: { limit: 'a' } }, res1)
    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'Limit must be a valid number' })
  })
})

describe('GET all comments endpoint', () => {
  beforeEach(async () => {
    await Comment.deleteMany({})
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
    expect(res1.json).toHaveBeenCalledWith({ comments: [], page: 1, limit: 10, total: 0 })

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
