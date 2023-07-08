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
  owner: new mongoose.Types.ObjectId()
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

describe('DELETE endpoint', () => {
  beforeEach(async () => {
    await Property.deleteMany({})
  })

  test('When property exists', async () => {
    await propertiesRouter(req, res)
    const propertiesAtStart = await propertiesInDb()

    const req1 = {
      method: 'DELETE',
      query: {
        id: propertiesAtStart[0].id
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
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length - 1)
  })

  test('When property does not exist', async () => {
    const req1 = {
      method: 'DELETE',
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

  test('When id is not valid', async () => {
    const req1 = {
      method: 'DELETE',
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

  test('When id is not provided', async () => {
    const req1 = {
      method: 'DELETE',
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
  await mongoose.connection.close()
})
