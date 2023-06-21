import mongoose from 'mongoose'
import Property from '../../../models/property'
import propertiesRouter from '../../../pages/api/properties/index'
import propertiesIdRouter from '../../../pages/api/properties/[id]'

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
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
  heating: false,
  owner: mongoose.Types.ObjectId()
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
      json: jest.fn()
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
      json: jest.fn()
    }

    await propertiesRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ message: 'no properties found', total: propertiesAtStart.length })
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
      json: jest.fn()
    }

    await propertiesRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ message: 'no properties found', total: propertiesAtStart.length })
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
        id: mongoose.Types.ObjectId()
      }
    }

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
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
      json: jest.fn()
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
      json: jest.fn()
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
      json: jest.fn()
    }

    await propertiesIdRouter(req1, res1)

    expect(res1.status).toHaveBeenCalledWith(404)
    expect(res1.json).toHaveBeenCalledWith({ error: 'property not found' })
  })
})

afterAll(async () => {
  await Property.deleteMany({})
  await mongoose.connection.close()
})
