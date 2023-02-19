import mongoose from 'mongoose'
import User from '../../models/user'
import usersRouter from '../../pages/api/users/index'
import usersUsernameRouter from '../../pages/api/users/[username]'

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
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
