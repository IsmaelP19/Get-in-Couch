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
  await Property.deleteMany({})
  await User.deleteMany({})

  await usersRouter({ method: 'POST', body: newUser }, res)

  const users = await usersInDb()
  newProperty.owner = users[0].id
})

describe('UPDATE by id endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})

    await propertiesRouter(req, res) // Create a property
  })

  test('When the property does not exist', async () => {
    const otherProperty = { ...newProperty, title: 'Other title' }

    const req1 = {
      method: 'PUT',
      query: {
        id: new mongoose.Types.ObjectId() // Non-existent id
      },
      body: {
        property: otherProperty
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

  test('When the property exists', async () => {
    const propertiesAtStart = await propertiesInDb()
    const users = await usersInDb()

    const req1 = {
      method: 'PUT',
      query: {
        id: propertiesAtStart[0].id
      },
      body: {
        title: 'Other title',
        loggedUser: users[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    const propertiesAtEnd = await propertiesInDb()

    expect(res1.status).toHaveBeenCalledWith(201)
    expect(res1.json).toHaveBeenCalledWith({ message: 'property succesfully updated', id: propertiesAtStart[0].id })
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
    expect(propertiesAtEnd[0].title).toBe('Other title')
  })

  test('When an error occurs', async () => {
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'PUT',
      query: {
        id: propertiesAtStart[0].id
      },
      cuerpo: { // instead of body (error)
        title: ''
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    const propertiesAtEnd = await propertiesInDb()

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'logged user not found' })
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
    expect(propertiesAtEnd[0].title).toBe(propertiesAtStart[0].title)
  })

  test('When the id is not valid', async () => {
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'PUT',
      query: {
        id: 'invalid1d' // Non-valid id
      },
      body: {
        title: 'Other title'
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    const propertiesAtEnd = await propertiesInDb()

    expect(res1.status).toHaveBeenCalledWith(400)
    expect(res1.json).toHaveBeenCalledWith({ error: 'malformatted id' })
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
    expect(propertiesAtEnd[0].title).toBe(propertiesAtStart[0].title)
  })
})

afterAll(async () => {
  await Property.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
