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

    const req1 = {
      method: 'PUT',
      query: {
        id: propertiesAtStart[0].id
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
  await mongoose.connection.close()
})
