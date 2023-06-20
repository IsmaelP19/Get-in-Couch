import axios from 'axios'
const baseUrl = '/api/users'
const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAll = async () => {
  const response = await axios.get(baseUrl, customHeader)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, customHeader)
  return response.data
}

const getUser = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`, customHeader)
  return response.data
}

const removeUser = async (username) => {
  const response = await axios.delete(`${baseUrl}/${username}`, customHeader)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post('api/login', credentials, customHeader)
  return response.data
}

const follow = async (username, newFollower) => {
  const response = await axios.put(`${baseUrl}/${username}`, { username: newFollower }, customHeader)

  return response.data
}

export default { getAll, create, getUser, removeUser, login, follow }
