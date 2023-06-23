import mongoose from 'mongoose'
import Property from '../../../models/property'
import User from '../../../models/user'
import propertiesRouter from '../../../pages/api/properties/index'
import usersRouter from '../../../pages/api/users/index'

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(property => property.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
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

  const newUser = {
    email: 'email@domain.com',
    password: 'testtest',
    username: 'Root',
    name: 'test',
    surname: 'test',
    phoneNumber: '123123124',
    isOwner: true
  }
  const req = {
    method: 'POST',
    body: newUser
  }

  const res = {}

  await usersRouter(req, res)
})

describe('POST: When there are no properties in db and one is added', () => {
  beforeEach(async () => {
    await Property.deleteMany({})

    const users = await usersInDb()
    const userId = users[0].id

    newProperty.owner = userId
  })

  test('Creation succeeds with just required data', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    const users = await usersInDb()
    const userId = users[0].id

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'property succesfully created' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length + 1)

    const propertyAdded = propertiesAtEnd[0]
    expect(propertyAdded.owner.toString()).toBe(userId)
  })
})

describe('POST: When there is some attribute missing', () => {
  beforeEach(async () => {
    await Property.deleteMany({})

    const users = await usersInDb()
    const userId = users[0].id

    newProperty.owner = userId
  })

  test('Creation fails with missing title', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    delete newProperty.title

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: title: Path `title` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing description', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.title = 'Test property'
    delete newProperty.description

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: description: Path `description` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing price', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.description = 'Test description'
    delete newProperty.price

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: price: Path `price` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing street', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.price = 800
    delete newProperty.street

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'street is required' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing city', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.street = 'Test street'
    delete newProperty.city

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'city is required' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing country', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.city = 'Test city'
    delete newProperty.country

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'country is required' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing zipCode', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.country = 'Test country'
    delete newProperty.zipCode

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'zipCode is required' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing propertyType', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.zipCode = 'Test zipCode'
    delete newProperty.propertyType

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.propertyType: Path `features.propertyType` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing propertySize', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.propertyType = 'Apartamento'
    delete newProperty.propertySize

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.propertySize: Path `features.propertySize` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing bathrooms', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.propertySize = 100
    delete newProperty.numberOfBathrooms

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBathrooms: Path `features.numberOfBathrooms` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing bedrooms', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBathrooms = 2
    delete newProperty.numberOfBedrooms

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBedrooms: Path `features.numberOfBedrooms` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing furniture', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBedrooms = 3
    delete newProperty.furniture

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.furniture: Path `features.furniture` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing parking', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.furniture = 'Amueblado'
    delete newProperty.parking

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.parking: Path `features.parking` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing airConditioning', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.parking = 'Garaje'
    delete newProperty.airConditioning

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.airConditioning: Path `features.airConditioning` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing heating', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.airConditioning = true
    delete newProperty.heating

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.heating: Path `features.heating` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with missing owner', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.heating = true
    delete newProperty.owner

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: owner: Path `owner` is required.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })
})

describe('POST: When there is some invalid values', () => {
  beforeEach(async () => {
    await Property.deleteMany({})

    const users = await usersInDb()
    const userId = users[0].id

    newProperty.owner = userId
  })

  test('Creation fails with invalid title', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.title = 'Te' // Minimum length is 3

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: title: Path `title` (`Te`) is shorter than the minimum allowed length (3).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid description', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.title = 'Test title'
    newProperty.description = 'Te' // Minimum length is 3

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: description: Path `description` (`Te`) is shorter than the minimum allowed length (3).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid price', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.description = 'Test description'
    newProperty.price = -1 // Minimum value is 0

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: price: Path `price` (-1) is less than minimum allowed value (0).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid price (not a number)', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.price = 'Test' // Must be a number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: price: Cast to Number failed for value "Test" (type string) at path "price"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid propertyType', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.price = 800
    newProperty.propertyType = 'Piso' // Must be a valid property type (Apartamento, Casa, Villa o Estudio)

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.propertyType: `Piso` is not a valid enum value for path `features.propertyType`.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid propertySize', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.propertyType = 'Apartamento'
    newProperty.propertySize = -1 // Must be a positive number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.propertySize: Path `features.propertySize` (-1) is less than minimum allowed value (1).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid propertySize (not a number)', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.propertySize = 'Test' // Must be a number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.propertySize: Cast to Number failed for value "Test" (type string) at path "features.propertySize"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid bathrooms', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.propertySize = 100
    newProperty.numberOfBathrooms = -1 // Must be a positive number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBathrooms: Path `features.numberOfBathrooms` (-1) is less than minimum allowed value (1).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid bathrooms (not a number)', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBathrooms = 'Test' // Must be a number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBathrooms: Cast to Number failed for value "Test" (type string) at path "features.numberOfBathrooms"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid bedrooms', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBathrooms = 1
    newProperty.numberOfBedrooms = -1 // Must be a positive number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBedrooms: Path `features.numberOfBedrooms` (-1) is less than minimum allowed value (1).' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid bedrooms (not a number)', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBedrooms = 'Test' // Must be a number

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.numberOfBedrooms: Cast to Number failed for value "Test" (type string) at path "features.numberOfBedrooms"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid furniture', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.numberOfBedrooms = 1
    newProperty.furniture = 'Test' // Must be a value inside the enum (Amueblado, Semi-amueblado, Sin amueblar)

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.furniture: `Test` is not a valid enum value for path `features.furniture`.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid parking', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.furniture = 'Amueblado'
    newProperty.parking = 'Test' // Must be a value inside the enum (Garaje, Parking, Sin parking)

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.parking: `Test` is not a valid enum value for path `features.parking`.' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid airConditioning', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.parking = 'Garaje'
    newProperty.airConditioning = 'Test' // Must be a boolean

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.airConditioning: Cast to Boolean failed for value "Test" (type string) at path "features.airConditioning" because of "CastError"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid heating', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.airConditioning = true
    newProperty.heating = 'Test' // Must be a boolean

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: features.heating: Cast to Boolean failed for value "Test" (type string) at path "features.heating" because of "CastError"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })

  test('Creation fails with invalid owner', async () => {
    const propertiesAtStart = await propertiesInDb()
    expect(propertiesAtStart).toHaveLength(0)

    newProperty.heating = true
    newProperty.owner = 'Test' // Must be a valid ObjectId

    await propertiesRouter(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Property validation failed: owner: Cast to ObjectId failed for value "Test" (type string) at path "owner" because of "BSONTypeError"' })

    const propertiesAtEnd = await propertiesInDb()
    expect(propertiesAtEnd).toHaveLength(propertiesAtStart.length)
  })
})

// FIXME: add test to check the creation of a property with spanish characters in the address (á, é, í, ó, ú, ñ)

// TODO: add more tests to check non-required attributes

afterAll(async () => {
  await Property.deleteMany({})
  await mongoose.connection.close()
})
