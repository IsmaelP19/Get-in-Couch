import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function propertiesIdRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

    const id = req.query.id

    if (req.method === 'GET') {
      let property = await Property.findById(id)
      if (property && process.env.NODE_ENV === 'test') {
        property = property.toJSON()
      }

      property ? res.status(200).json(property) : res.status(404).json({ error: 'property not found' })
    } else if (req.method === 'DELETE') {
      const property = await Property.findById(id)
      if (property) {
        await Property.findByIdAndRemove(id)
        res.status(200).json({ message: 'property succesfully deleted' })
      } else {
        res.status(404).json({ error: 'property not found' })
      }
    }
    // TODO: add update method
    // TODO: add auth, only the owner of the property can delete it or update it
  } catch (error) {
    errorHandler(error, req, res)
  }
}
