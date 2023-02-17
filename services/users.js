import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const getUser = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`)
  return response.data
}

const removeUser = async (username) => {
  const response = await axios.delete(`${baseUrl}/${username}`)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post('api/login', credentials)
  return response.data
}

export default { getAll, create, getUser, removeUser, login }
