import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/properties'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAll = async (page, search, all) => {
  let response
  if (all) {
    response = await axios.get(`${baseUrl}?all=${all}`, customHeader)
  } else {
    let url = `${baseUrl}?page=${page}`
    if (search) url += `&${search}`

    response = await axios.get(url, customHeader)
  }
  return response.data
}

const getMine = async (page, search, userId) => {
  const customHeader = {
    headers: {
      'X-Origin': 'getincouch.vercel.app',
      Authorization: userId
    }
  }

  let url = `${baseUrl}/mine?page=${page}`
  if (search) url += `&${search}`
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

const getTenants = async (id, userId) => {
  const customHeader = {
    headers: {
      'X-Origin': 'getincouch.vercel.app',
      Authorization: userId
    }
  }

  const response = await axios.get(`${baseUrl}/${id}/tenants`, customHeader)
  return response.data
}

const removeProperty = async (id, loggedUser) => {
  customHeader.data = { loggedUser }
  const response = await axios.delete(`${baseUrl}/${id}`, customHeader)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, customHeader)
  return response.data
}

const updateTenants = async (id, userId, newObject) => {
  const customHeader = {
    headers: {
      'X-Origin': 'getincouch.vercel.app',
      Authorization: userId
    }
  }
  const response = await axios.put(`${baseUrl}/${id}/tenants`, newObject, customHeader)
  return response.data
}

const getCommentsByProperty = async (id, limit, page) => {
  const response = await axios.get(`${baseUrl}/${id}/comments?page=${page}&limit=${limit}`, customHeader)
  return response.data
}

export default { getAll, getMine, create, getProperty, getTenants, removeProperty, update, updateTenants, getCommentsByProperty }
