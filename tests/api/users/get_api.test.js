import mongoose from 'mongoose'
import User from '../../../models/user'
import usersRouter from '../../../pages/api/users/index'
import usersUsernameRouter from '../../../pages/api/users/[username]'

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })

  await User.deleteMany({})
})

describe('GET all endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('When there are users in db', async () => {
    const req1 = {
      method: 'POST',
      body: {
        email: 'newemail@domain.com',
        password: 'testtest',
        username: 'test',
        name: 'test',
        surname: 'test',
        phoneNumber: '123123123',
        isOwner: false
      }
    }

    const res1 = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersRouter(req1, res1)
    expect(res1.status).toHaveBeenCalledWith(201)

    const usersAtStart = await usersInDb()
    expect(usersAtStart).toHaveLength(1)

    const req = {
      method: 'GET'
    }

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)
    expect(res.json).toHaveBeenCalledWith({ total: usersAtStart.length, users: usersAtStart })
  })

  test('When there are no users in db', async () => {
    const req = {
      method: 'GET'
    }

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.json).toHaveBeenCalledWith({ total: 0, users: [] })
  })
})

describe('GET by username endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const req = {
      method: 'POST',
      body: {
        email: 'newemail@domain.com',
        password: 'testtest',
        username: 'test',
        name: 'test',
        surname: 'test',
        phoneNumber: '123123123',
        isOwner: false
      }
    }

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)
  })

  test('When the user exists the operation succeeds', async () => {
    const usersAtStart = await usersInDb()
    const username = usersAtStart[0].username
    const req = {
      method: 'GET',
      query: {
        username
      }
    }

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersUsernameRouter(req, res)

    expect(res.json).toHaveBeenCalledWith(usersAtStart[0])
  })

  test('When the user does not exist a proper error and status code is returned', async () => {
    const usersAtStart = await usersInDb()
    const username = usersAtStart[0].username
    const newUsername = username.toString().split('').reverse().join('')

    const req = {
      method: 'GET',
      query: {
        username: newUsername
      }
    }

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    await usersUsernameRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
