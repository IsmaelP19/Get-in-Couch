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

  const users = await usersInDb()
  newProperty.owner = users[0].id
})

describe('GET all endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
  })

  test('When there are properties in db', async () => {
    await propertiesRouter(req, res)
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'GET',
      query: {}
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(200)
    const response = {
      properties: propertiesAtStart,
      message: 'properties succesfully retrieved',
      total: 1
    }
    expect(res1.json).toHaveBeenCalledWith(response)
  })

  test('When there are no properties in db', async () => {
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'GET',
      query: {}
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ properties: [], message: 'no properties found', total: propertiesAtStart.length })
  })

  test('When there are properties in db but not enough to show another page', async () => {
    await propertiesRouter(req, res)
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'GET',
      query: {
        page: 2
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ properties: [], message: 'no properties found', total: propertiesAtStart.length })
  })
})

describe('GET by id endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
  })

  test('When there is no property with such id', async () => {
    const req1 = {
      method: 'GET',
      query: {
        id: new mongoose.Types.ObjectId()
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

  test('When there is a property with such id', async () => {
    await propertiesRouter(req, res)
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'GET',
      query: {
        id: propertiesAtStart[0].id
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(200)
    expect(res1.json).toHaveBeenCalledWith(propertiesAtStart[0])
  })

  test('When the id provided is not valid', async () => {
    const req1 = {
      method: 'GET',
      query: {
        id: 'notvalidid'
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

  test('When there is no id provided', async () => {
    const req1 = {
      method: 'GET',
      query: {}
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
