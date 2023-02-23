import mongoose from 'mongoose'
import User from '../../../models/user'
import usersRouter from '../../../pages/api/users/index'
import loginRouter from '../../../pages/api/login/index'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })

  await User.deleteMany({})
})

describe('LOGIN endpoint', () => {
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

    const res = {}

    await usersRouter(req, res)
  })

  test('When the user does not exist, the operation fails', async () => {
    const req = {
      method: 'POST',
      body: {
        username: 'incorrect',
        password: 'testest'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await loginRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid username or password' })
  })

  test('When the password is incorrect, the operation fails', async () => {
    const req = {
      method: 'POST',
      body: {
        username: 'test',
        password: 'incorrect'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await loginRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid username or password' })
  })

  test('When the username is not provided, the operation fails', async () => {
    const req = {
      method: 'POST',
      body: {
        password: 'testtest'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await loginRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'username is required' })
  })

  test('When the password is not provided, the operation fails', async () => {
    const req = {
      method: 'POST',
      body: {
        username: 'test'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await loginRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'password is required' })
  })

  test('When the user exists and the password is correct, the operation succeeds', async () => {
    const req = {
      method: 'POST',
      body: {
        username: 'test',
        password: 'testtest'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await loginRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      name: 'test',
      token: expect.any(String),
      username: 'test'
    })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
