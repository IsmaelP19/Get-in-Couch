import Property from '../../../../models/property'
import User from '../../../../models/user'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function propertiesIdTenantsRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    const propertyId = req.query?.id
    const property = await Property.findById(propertyId)

    if (!property) {
      return res.status(404).json({ error: 'property not found' })
    } else if (property.owner.toString() !== req.headers.authorization) {
      return res.status(403).json({ error: 'forbidden' })
    }

    if (req.method === 'GET') {
      const tenants = await User.find({ _id: { $in: property.tenants.map(t => t.user) } }).select('_id username name surname profilePicture')

      tenants.forEach(tenant => {
        const tenantId = tenant._id.toString()
        const tenantDate = property.tenants.find(t => t.user.toString() === tenantId).date.toLocaleDateString()
        tenant._doc.date = tenantDate
      })

      return res.status(200).json(tenants)
    } else if (req.method === 'PUT') {
      const { body } = req
      // body.tenants es un array de ids = ['id1', 'id2', 'id3' ...]

      const oldTenants = property.tenants.map(tenant => tenant.user.toString())
      // TODO: los que había antes (sólo sus IDs)
      // oldTenants is an array of strings
      // oldTenants = ['id1', 'id2', 'id3' ...]

      const newTenants = [...new Set(body.tenants)] // Remove duplicates from newTenants array
      // TODO: check that newTenants are not owners (should return a fail)

      const areNewTenantsOwners = await User.find({ _id: { $in: newTenants }, isOwner: true })
      if (areNewTenantsOwners.length > 0) {
        return res.status(400).json({ error: 'new tenants cannot be owners' })
      }

      const otherProperties = await Property.find({ _id: { $ne: property._id } }).populate('tenants.user')
      const otherTenants = otherProperties.flatMap(p => p.tenants.map(tenant => tenant.user.id))

      const newTenantsLivingInAnotherProperty = newTenants.filter(tenant => otherTenants.includes(tenant))
      if (newTenantsLivingInAnotherProperty.length > 0) {
        const tenants = await User.find({ _id: { $in: newTenantsLivingInAnotherProperty } }).select('username name surname')
        return res.status(400).json({ error: 'there are some tenants that are already living in another property', alreadyTenants: tenants })
      }

      // básicamente se convierte en set pa quitar duplicados (por si los hubiese) y se convierte en array de nuevo
      // TODO: los que hay ahora (sólo sus IDs)

      // Find the existing tenants in the property's tenants array
      const existingTenants = property.tenants.filter(tenant => oldTenants.includes(tenant.user.toString()))
      // no estoy haciendo nada realmente, cojo los inquilinos que había y no hago absolutamente nada
      // FIXME: aquí cojo literalmente todos los property.tenants (oldTenants es literalmente los property.tenants pero quedandome solo con los ids) sólo que tmb coge la fecha de inclusión

      // Create a map to store the original inclusion dates of existing tenants
      const existingTenantDates = new Map()
      existingTenants.forEach(tenant => {
        const userId = tenant.user.toString()
        existingTenantDates.set(userId, tenant.date)
      })

      // existingTenants tiene los objects Ids del tipo [{user, date, _id...}, {user, date, _id...}, ...}]
      // existingTenantDates es del tipo { 'id1': 'date1', 'id2': 'date2', ... }

      // Update tenants array and calculate available rooms
      property.tenants = newTenants.map(userId => ({
        user: userId,
        date: existingTenantDates.get(userId) || new Date() // Use existing date if available, otherwise use current date
      }))
      property.features.availableRooms = property.features.availableRooms - (newTenants.length - oldTenants.length)

      // Update tenantsHistory array
      const tenantsToAddToHistory = oldTenants.filter(userId => !newTenants.includes(userId))// FIXME: está cogiendo de los antiguos del property.tenants los que se han ido (no están en el newTenants) --> son los inquilinos que se han ido a su puta casa (vaya, la intersección entre oldTenants y newTenants)

      // const tenantsToAddToHistory = tenantsToRemoveFromHistory.filter(userId => !property.tenants.some(tenant => tenant.user.toString() === userId))

      const tenantsBackFromHistory = property.tenantsHistory.filter(history => newTenants.includes(history.user.toString()))

      // ahora añadimos al history los que se han ido (tenantsToAddToHistory) y quitamos los que han vuelto (tenantsBackFromHistory)

      property.tenantsHistory = property.tenantsHistory.filter(history => !tenantsBackFromHistory.some(tenant => tenant.user.toString() === history.user.toString()))
      // básicamente quita los que han vuelto a ser inquilinos y lo fueron en el pasado

      property.tenantsHistory = [
        ...property.tenantsHistory,
        ...tenantsToAddToHistory.map(userId => ({ user: userId, date: existingTenantDates.get(userId) }))
      ]

      if (property.availableRooms < 0) {
        return res.status(400).json({ error: `there are only ${property.numberOfBedrooms} rooms and ${property.tenants.length} tenants were added` })
      }
      await property.save()
      return res.status(200).json(property)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
