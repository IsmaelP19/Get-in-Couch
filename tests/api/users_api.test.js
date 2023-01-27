import mongoose from 'mongoose'
import User from '../../models/user'
import usersRouter from '../../pages/api/users/index'
import usersIdRouter from '../../pages/api/users/[id]'

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
  })

  await User.deleteMany({})
})

describe('POST: When there are no users in db and one is added', () => {
  test('creation succeeds', async () => {
    const usersAtStart = await usersInDb()
    expect(usersAtStart).toHaveLength(0)

    const newUser = {
      username: 'test',
      name: 'test',
      password: 'test'
    }

    await usersRouter({
      method: 'POST',
      body: newUser
    })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await usersInDb()
    expect(usersAtStart).toHaveLength(1)

    const newUser = {
      username: 'test',
      name: 'different',
      password: 'another'
    }

    const req = {
      method: 'POST',
      body: newUser
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: username: Error, expected `username` to be unique. Value: `' + newUser.username + '`' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen'
    }

    const req = {
      method: 'POST',
      body: newUser
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: username: Path `username` (`' + newUser.username + '`) is shorter than the minimum allowed length (3).' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sa'
    }

    const req = {
      method: 'POST',
      body: newUser
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'password is too short' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('GET all endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('When there are users in db', async () => {
    const req1 = {
      method: 'POST',
      body: {
        username: 'test',
        name: 'test',
        password: 'test'
      }
    }

    const res1 = {}

    await usersRouter(req1, res1)
    const usersAtStart = await usersInDb()

    const req = {
      method: 'GET'
    }

    const res = {
      json: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.json).toHaveBeenCalledWith(usersAtStart)
  })

  test('When there are no users in db', async () => {
    const req = {
      method: 'GET'
    }

    const res = {
      json: jest.fn().mockReturnThis()
    }

    await usersRouter(req, res)

    expect(res.json).toHaveBeenCalledWith([])
  })
})

describe('GET by id endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const req = {
      method: 'POST',
      body: {
        username: 'test',
        name: 'test',
        password: 'test'
      }
    }

    const res = {}

    await usersRouter(req, res)
  })

  test('When the user exists the operation succeeds', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const req = {
      method: 'GET',
      query: {
        id: userId
      }
    }

    const res = {
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.json).toHaveBeenCalledWith(usersAtStart[0])
  })

  test('When the id is malformatted a proper error and status code is returned', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const req = {
      method: 'GET',
      query: {
        id: userId + '1'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })

  test('When the user does not exist a proper error and status code is returned', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const newId = userId.toString().split('').reverse().join('')

    const req = {
      method: 'GET',
      query: {
        id: newId
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })
})

describe('DELETE by id endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const req = {
      method: 'POST',
      body: {
        username: 'test',
        name: 'test',
        password: 'test'
      }
    }

    const res = {}

    await usersRouter(req, res)
  })

  test('When the user exists the operation succeeds', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const req = {
      method: 'DELETE',
      query: {
        id: userId
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledWith({ message: 'user succesfully deleted' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
  })

  test('When the id is malformatted a proper error and status code is returned', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const req = {
      method: 'DELETE',
      query: {
        id: userId + '1'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })

  test('When the user does not exist a proper error and status code is returned', async () => {
    const usersAtStart = await usersInDb()
    const userId = usersAtStart[0].id
    const newId = userId.toString().split('').reverse().join('')

    const req = {
      method: 'DELETE',
      query: {
        id: newId
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await usersIdRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
