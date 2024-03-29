import mongoose from 'mongoose'
import Comment from '../../../models/comment'
import Property from '../../../models/property'
import User from '../../../models/user'
import commentsRouter from '../../../pages/api/comments/index'
import commentsIdRouter from '../../../pages/api/comments/[id]'
import propertiesRouter from '../../../pages/api/properties'
import usersRouter from '../../../pages/api/users/index'

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

const newComment = {
  content: 'This is a new comment. At least, there should be 50 characters.',
  user: new mongoose.Types.ObjectId().toString(),
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
  availableRooms: 1,
  furniture: 'Amueblado',
  parking: 'Parking',
  airConditioning: true,
  heating: false
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

  await User.deleteMany({})
  await usersRouter({ method: 'POST', body: newUser }, res)

  const users = await usersInDb()
  newProperty.owner = users[0].id // it is necessary to add a property as a valid owner, otherwise it will fail

  await Comment.deleteMany({})
  await Property.deleteMany({})
  const tenantsHistory = []
  let count = 0
  while (count < 20) {
    tenantsHistory.push({
      user: new mongoose.Types.ObjectId().toString(),
      date: new Date(),
      _id: new mongoose.Types.ObjectId()
    })
    count++
  }
  newProperty.tenantsHistory = tenantsHistory
  await propertiesRouter({ method: 'POST', body: newProperty }, res)

  const propertiesAtStart = await propertiesInDb()
  for (let i = 0; i < 20; i++) {
    newComment.user = tenantsHistory[i].user
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

describe('GET comments by id', () => {
  test('Check error is handled when id is not valid', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsIdRouter({ ...req, query: { id: 'a' } }, res1)
    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })

  test('Check error is handled when id is not found', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsIdRouter({ ...req, query: { id: new mongoose.Types.ObjectId() } }, res1)
    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'comment not found' })
  })

  test('Check error is handled when not providing id', async () => {
    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    await commentsIdRouter(req, res1)
    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'id is required' })
  })

  test('Check comment is returned when id is valid and found', async () => {
    const commentsAtStart = await commentsInDb()
    const comment = commentsAtStart[0]

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await commentsIdRouter({ ...req, query: { id: comment.id } }, res1)
    expect(res1.status).toHaveBeenCalledWith(200)
    const response = res1.json.mock.calls[0][0]
    expect(response).toEqual(expect.objectContaining({ content: comment.content, property: comment.property, user: comment.user, rating: comment.rating }))
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

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    newComment.property = propertiesAtStart[0].id
    newComment.user = propertiesAtStart[0].tenantsHistory[0].user.toString()

    await commentsRouter({ method: 'POST', body: { ...newComment } }, res1)
    expect(res1.status).toHaveBeenCalledWith(201)

    const commentsAtEnd = await commentsInDb()
    expect(commentsAtEnd).toHaveLength(1)
    expect(commentsAtEnd[0].content).toEqual(newComment.content)
    expect(commentsAtEnd[0].property.toString()).toEqual(newComment.property)
    expect(commentsAtEnd[0].user.toString()).toEqual(newComment.user)
    expect(commentsAtEnd[0].rating).toEqual(newComment.rating)
  })
})

afterAll(async () => {
  await Comment.deleteMany({})
  await Property.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
