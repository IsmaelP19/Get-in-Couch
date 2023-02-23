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

describe('UPDATE by username endpoint', () => {
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

    const req2 = {
      method: 'POST',
      body: {
        email: 'anotheremail@domain.com',
        password: 'testtest',
        username: 'test2',
        name: 'test2',
        surname: 'test2',
        phoneNumber: '123123124',
        isOwner: false
      }
    }

    await usersRouter(req2, res)
  })

  test('When both users exists the operation succeeds', async () => {
    const usersAtStart = await usersInDb()
    const username1 = usersAtStart[0].username
    const username2 = usersAtStart[1].username

    const req = {
      method: 'PUT',
      query: {
        username: username1
      },
      body: {
        username: username2
      }

    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()

    }

    await usersUsernameRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'user succesfully updated' })
  })

  test('When the user to follow does not exist the operation fails', async () => {
    const usersAtStart = await usersInDb()
    const username = usersAtStart[0].username

    const req = {
      method: 'PUT',
      query: {
        username: 'notexisting'
      },
      body: {
        username
      }

    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()

    }

    await usersUsernameRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  test('When the user who wants to follow does not exist the operation fails', async () => {
    const usersAtStart = await usersInDb()
    const username = usersAtStart[0].username

    const req = {
      method: 'PUT',
      query: {
        username
      },
      body: {
        username: 'notexisting'
      }

    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()

    }

    await usersUsernameRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user who is performing the action not found' })
  })

  test('When I try to follow myself the operation fails', async () => {
    const usersAtStart = await usersInDb()
    const username1 = usersAtStart[0].username

    const req = {
      method: 'PUT',
      query: {
        username: username1
      },
      body: {
        username: username1
      }

    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()

    }

    await usersUsernameRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'you cannot follow yourself' })
  })
})

// TODO: check if the user actually follows the other user, not just by the response

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
