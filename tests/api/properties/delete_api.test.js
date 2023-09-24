import mongoose from 'mongoose'
import Property from '../../../models/property'
import User from '../../../models/user'
import propertiesRouter from '../../../pages/api/properties/index'
import propertiesIdRouter from '../../../pages/api/properties/[id]'
import usersRouter from '../../../pages/api/users/index'

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
  method: 'POST',
  body: newProperty
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

  await Property.deleteMany({})

  const users = await usersInDb()
  newProperty.owner = users[0].id
})

describe('DELETE endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
  })

  test('When property exists', async () => {
    await propertiesRouter(req, res)
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(1)
    expect(propertiesAtStart[0].isActive).toBe(true)

    const users = await usersInDb()

    const req1 = {
      method: 'DELETE',
      query: {
        id: propertiesAtStart[0].id
      },
      body: {
        loggedUser: users[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(204)
    expect(res1.json).toHaveBeenCalledWith({ message: 'property succesfully deleted' })

    const propertiesAtEnd = await propertiesInDb()
    // expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length - 1)
    expect(propertiesAtEnd[0].isActive).toBe(false)
  })

  test('When property does not exist', async () => {
    const users = await usersInDb()

    const req1 = {
      method: 'DELETE',
      query: {
        id: new mongoose.Types.ObjectId()
      },
      body: {
        loggedUser: users[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property not found' })
  })

  test('When id is not valid', async () => {
    const users = await usersInDb()
    const req1 = {
      method: 'DELETE',
      query: {
        id: 'notvalidid'
      },
      body: {
        loggedUser: users[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })
  })

  test('When id is not provided', async () => {
    const users = await usersInDb()

    const req1 = {
      method: 'DELETE',
      query: {},
      body: {
        loggedUser: users[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property not found' })
  })
})

afterAll(async () => {
  await Property.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
