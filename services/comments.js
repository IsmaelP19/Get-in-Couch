import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/comments'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, customHeader)
  return response.data
}

const getAllComments = async () => {
  const response = await axios.get(`${baseUrl}`, customHeader)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, customHeader)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, customHeader)
  return response.data
}

export default { create, getAllComments, remove, update }
