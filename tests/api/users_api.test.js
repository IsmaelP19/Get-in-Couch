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
      email: 'newemail@domain.com',
      password: 'testtest',
      username: 'test',
      name: 'test',
      surname: 'test',
      phoneNumber: '123123123',
      isOwner: false
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
      email: 'anotheremail@domain.com',
      password: 'testtest',
      username: 'test',
      name: 'test',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
      email: 'anotheremail@domain.com',
      password: 'testtest',
      username: 'ro',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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

  test('creation fails with proper status code and message if username is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'eme@domain.com',
      password: 'testtest',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: username: Path `username` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'anotheremail@domain.com',
      password: 'test',
      username: 'root',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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

  test('creation fails with proper status code and message if password is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'anotheremail@domain.com',
      username: 'root',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'password is required' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if email is not valid', async () => {
    const usersAtStart = await usersInDb()

    const invalidEmails = [
      'test',
      'test@',
      'test@domain',
      'test@domain.',
      'mysite.ourearth.com',
      'mysite@.com.my',
      '@you.me.net',
      'mysite@.org.org',
      '.mysite@mysite.org',
      'mysite()*@gmail.com',
      'mysite..1234@yahoo.com'
    ]

    const newUser = {
      password: 'testtest',
      username: 'root',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
    }

    for (const index in invalidEmails) {
      newUser.email = invalidEmails[index]

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
      expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: email: ' + newUser.email + ' is not a valid email' })

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }
  }, 10000)

  test('creation fails with proper status code and message if email is already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'newemail@domain.com',
      password: 'testtest',
      username: 'root',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: email: Error, expected `email` to be unique. Value: `' + newUser.email + '`' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if email is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      password: 'testtest',
      username: 'root',
      name: 'Superuser',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: email: Path `email` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if name is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'root',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: name: Path `name` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if name is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'root',
      name: 'Su',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: name: Path `name` (`Su`) is shorter than the minimum allowed length (3).' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if surname is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'root',
      name: 'test',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: surname: Path `surname` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if surname is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'root',
      name: 'Superuser',
      surname: 'Te',
      phoneNumber: '123123124',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: surname: Path `surname` (`Te`) is shorter than the minimum allowed length (3).' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if phoneNumber is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'root',
      name: 'test',
      surname: 'test',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: phoneNumber: Path `phoneNumber` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if phoneNumber is already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'Superuser',
      name: 'test',
      surname: 'test',
      phoneNumber: '123123123',
      isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: phoneNumber: Error, expected `phoneNumber` to be unique. Value: `123123123`' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if isOwner is not provided', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'Root',
      name: 'test',
      surname: 'test',
      phoneNumber: '123123124'
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: isOwner: Path `isOwner` is required.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if isOwner is not a boolean', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      email: 'email@domain.com',
      password: 'testtest',
      username: 'Root',
      name: 'test',
      surname: 'test',
      phoneNumber: '123123124',
      isOwner: 'test'
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
    expect(res.json).toHaveBeenCalledWith({ error: 'User validation failed: isOwner: Cast to Boolean failed for value "test" (type string) at path "isOwner" because of "CastError"' })

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
        email: 'newemail@domain.com',
        password: 'test',
        username: 'test',
        name: 'test',
        surname: 'test',
        phoneNumber: '123123123',
        isOwner: false
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
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
