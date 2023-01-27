const User = require('../models/user')

const aux = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  aux
}
