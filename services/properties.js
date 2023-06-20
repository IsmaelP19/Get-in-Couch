import axios from 'axios'
const baseUrl = '/api/properties'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAll = async () => {
  const response = await axios.get(baseUrl, customHeader)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, customHeader)
  return response.data
}

const getProperty = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, customHeader)
  return response.data
}

const removeProperty = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, customHeader)
  return response.data
}

export default { getAll, create, getProperty, removeProperty }
