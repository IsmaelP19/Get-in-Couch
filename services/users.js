import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/users'
const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAll = async () => {
  const response = await axios.get(baseUrl, customHeader)
  return response.data
}

const search = async (search, page, limit) => {
  const response = await axios.get(`${baseUrl}/?search=${search}&page=${page}&limit=${limit}`, customHeader)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, customHeader)
  return response.data
}

const update = async (username, newObject) => {
  const response = await axios.put(`${baseUrl}/${username}`, { ...newObject, updating: true }, customHeader)
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

const getSavedProperties = async (username, page, limit) => {
  const response = await axios.get(`${baseUrl}/${username}/saved?page=${page}?limit=${limit}`, customHeader)
  return response.data
}

const updateSavedProperties = async (username, propertyId) => {
  const response = await axios.put(`${baseUrl}/${username}/saved`, { property: propertyId }, customHeader)
  return response.data
}

const getFollowers = async (username, search, page, limit) => {
  const response = await axios.get(`${baseUrl}/${username}/followers?search=${search}&page=${page}&limit=${limit}`, customHeader)
  return response.data
}

const getFollowing = async (username, search, page, limit) => {
  const response = await axios.get(`${baseUrl}/${username}/following?search=${search}&page=${page}&limit=${limit}`, customHeader)
  return response.data
}

export default { getAll, search, create, update, getUser, removeUser, login, follow, getSavedProperties, updateSavedProperties, getFollowers, getFollowing }
