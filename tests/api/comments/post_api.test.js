import mongoose from 'mongoose'
import Comment from '../../../models/comment'
import Property from '../../../models/property'
import commentsRouter from '../../../pages/api/comments/index'
import propertiesRouter from '../../../pages/api/properties'

const commentsInDb = async (propertyId) => {
  const comments = await Comment.find({ property: propertyId })
  return comments.map(comment => comment.toJSON())
}

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
}

const newComment = {
  content: 'This is a new comment. At least, there should be 50 characters.',
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
  method: 'POST'
}

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })
})

describe('POST: When there are no comments in db and one is added', () => {
  beforeEach(async () => {
    await Comment.deleteMany({})
    await Property.deleteMany({})
    await propertiesRouter({ ...req, body: newProperty }, res)
  })

  test('Creation succeeds with valid data', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(res.status).toHaveBeenCalledWith(200)

    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsRouter({ ...req, body: { ...newComment, property: propertiesAtStart[0].id } }, res1)

    expect(res1.json).toHaveBeenCalledTimes(1)

    expect(res1.status).toHaveBeenCalledWith(201)

    const response = res1.json.mock.calls[0][0]
    expect(response.content).toBe(newComment.content)
    expect(response.user).toBe(newComment.user)
    expect(response.rating).toBe(newComment.rating)
    expect(response.property.toString()).toBe(propertiesAtStart[0].id)
    expect(response.id).toBeDefined()
    expect(response.publishDate).toBeDefined()
    expect(response.likes).toStrictEqual([])

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(1)
    expect(commentsAtEnd[0].content).toBe(newComment.content)
  })

  test('Creation fails with missing content', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(res.status).toHaveBeenCalledWith(200)

    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsRouter({ ...req, body: { ...newComment, content: undefined } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'content is required' })

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('Creation fails with missing user', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(res.status).toHaveBeenCalledWith(200)

    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsRouter({ ...req, body: { ...newComment, user: undefined } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'user is required' })

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('Creation fails with missing property', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(res.status).toHaveBeenCalledWith(200)

    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsRouter({ ...req, body: { ...newComment, property: undefined } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property is required' })

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('Creation fails with invalid property', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(res.status).toHaveBeenCalledWith(200)

    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsRouter({ ...req, body: { ...newComment, property: 'someInvalidId' } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('Creation succeeds with extra fields', async () => {
    const propertiesAtStart = await propertiesInDb()
    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, body: { ...newComment, property: propertiesAtStart[0].id, extraField: 'extra field' } }, res1)

    expect(res1.status).toHaveBeenCalledWith(201)

    const response = res1.json.mock.calls[0][0]
    expect(response.content).toBe(newComment.content)
    expect(response.user).toBe(newComment.user)
    expect(response.rating).toBe(newComment.rating)
    expect(response.property.toString()).toBe(propertiesAtStart[0].id)
    expect(response.id).toBeDefined()
    expect(response.publishDate).toBeDefined()
    expect(response.likes).toStrictEqual([])

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(1)
    expect(commentsAtEnd[0].content).toBe(newComment.content)
  })

  test('Creation fails with valid propertyId but non-existent property', async () => {
    const propertyId = mongoose.Types.ObjectId()
    const commentsAtStart = await commentsInDb(propertyId)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, body: { ...newComment, property: propertyId } }, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property not found' })

    const commentsAtEnd = await commentsInDb(propertyId)
    expect(commentsAtEnd).toHaveLength(0)
  })

  test('Creation fails with invalid rating', async () => {
    const propertiesAtStart = await propertiesInDb()
    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtStart).toHaveLength(0)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsRouter({ ...req, body: { ...newComment, property: propertiesAtStart[0].id, rating: 6 } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'Comment validation failed: rating: Path `rating` (6) is more than maximum allowed value (5).' })

    const commentsAtEnd = await commentsInDb(propertiesAtStart[0].id)
    expect(commentsAtEnd).toHaveLength(0)
  })
})

// FIXME: add tests to check min and max length of content

afterAll(async () => {
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await mongoose.connection.close()
})
