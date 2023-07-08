import mongoose from 'mongoose'
import Comment from '../../../models/comment'
import Property from '../../../models/property'
import commentsRouter from '../../../pages/api/comments'
import commentsIdRouter from '../../../pages/api/comments/[id]'
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
  content: 'This is a new comment. At least, there should be 50 characters.',
  user: new mongoose.Types.ObjectId(),
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
  owner: new mongoose.Types.ObjectId()
}

const req = {
  method: 'DELETE'
}

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })
})

describe('DELETE comments by id endpoint', () => {
  beforeEach(async () => {
    await Comment.deleteMany({})
    await Property.deleteMany({})

    await propertiesRouter({ method: 'POST', body: newProperty }, res)
    const properties = await propertiesInDb()

    await commentsRouter({ method: 'POST', body: { ...newComment, property: properties[0].id } }, res)
  })
  test('should return 204 if comment is deleted', async () => {
    const comments = await commentsInDb()
    expect(comments).toHaveLength(1)
    const commentToDelete = comments[0]

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsIdRouter({ ...req, query: { id: commentToDelete.id } }, res1)

    expect(res1.status).toHaveBeenCalledWith(204)
  })

  test('should return 404 if comment is not found', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsIdRouter({ ...req, query: { id: new mongoose.Types.ObjectId() } }, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'comment not found' })
  })

  test('should return 400 if id is not provided', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsIdRouter({ ...req, query: { id: '' } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'id is required' })
  })

  test('should return 400 if id is not valid', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsIdRouter({ ...req, query: { id: '123' } }, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })

  test('should erase comment from property', async () => {
    const propertiesAtStart = await propertiesInDb()
    const commentsAtStart = await commentsInDb(propertiesAtStart[0].id)

    expect(commentsAtStart).toHaveLength(1)
    expect(propertiesAtStart[0].comments).toHaveLength(1)

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsIdRouter({ ...req, query: { id: commentsAtStart[0].id } }, res1)

    const propertiesAtEnd = await propertiesInDb()
    const commentsAtEnd = await commentsInDb(propertiesAtEnd[0].id)
    expect(res1.status).toHaveBeenCalledWith(204)
    expect(commentsAtEnd).toHaveLength(0)
    expect(propertiesAtEnd[0].comments).toHaveLength(0)
  })
})

afterAll(async () => {
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await mongoose.connection.close()
})
