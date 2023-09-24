import mongoose from 'mongoose'
import Property from '../../../models/property'
import propertiesRouter from '../../../pages/api/properties'
import Comment from '../../../models/comment'
import User from '../../../models/user'
import commentsRouter from '../../../pages/api/comments/index'
import commentsIdRouter from '../../../pages/api/comments/[id]'
import propertiesIdCommentsRouter from '../../../pages/api/properties/[id]/comments'
import usersRouter from '../../../pages/api/users/index'

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
}

const commentsInDb = async (propertyId) => {
  const comments = await Comment.find({ property: propertyId })
  return comments.map(comment => comment.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const newUser = {
  email: 'test@test.com',
  password: 's1st3m4s',
  username: 'test',
  name: 'Test',
  surname: 'Tset',
  phoneNumber: '123456789',
  isOwner: true,
  description: 'Test description'
}

const id = new mongoose.Types.ObjectId()

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
  availableRooms: 1,
  furniture: 'Amueblado',
  parking: 'Parking',
  airConditioning: true,
  heating: false,
  tenantsHistory: {
    user: id,
    date: new Date(),
    _id: new mongoose.Types.ObjectId()
  }
}

const newComment = {
  content: 'This is a new comment. At least, there should be 50 characters.',
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

  await User.deleteMany({})
  await usersRouter({ ...req, body: newUser }, res)

  const users = await usersInDb()
  newProperty.owner = users[0].id
})

describe('GET all comments from a property endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
    await Comment.deleteMany({})
    await propertiesRouter({ ...req, body: newProperty }, res)
    const propertiesAtStart = await propertiesInDb()

    await commentsRouter({ ...req, body: { ...newComment, property: propertiesAtStart[0].id, user: propertiesAtStart[0].tenantsHistory[0].user.toString() } }, res)
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
      {
        comments: [
          expect.objectContaining({
            content: commentsAtStart[0].content,
            user: commentsAtStart[0].user,
            rating: commentsAtStart[0].rating,
            property: commentsAtStart[0].property
          })
        ],
        total: 1
      }
    )
  })

  test('When the property does not exist', async () => {
    const req1 = {
      method: 'GET',
      query: { id: new mongoose.Types.ObjectId() }
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
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
