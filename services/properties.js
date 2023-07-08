import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/properties'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAll = async (page) => {
  const url = page ? `${baseUrl}?page=${page}` : baseUrl
  const response = await axios.get(url, customHeader)
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

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, customHeader)
  return response.data
}
const getCommentsByProperty = async (id, limit, page) => {
  const response = await axios.get(`${baseUrl}/${id}/comments?page=${page}&limit=${limit}`, customHeader)
  return response.data
}

export default { getAll, create, getProperty, removeProperty, update, getCommentsByProperty }
