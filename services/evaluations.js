import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/evaluations'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getUserStats = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`, customHeader)
  return response.data
}

const evaluateUser = async (evaluationObject) => {
  const response = await axios.post(baseUrl, evaluationObject, customHeader)
  return response.data
}

const updateEvaluation = async (evaluationObject, username) => {
  const response = await axios.put(`${baseUrl}/${username}`, evaluationObject, customHeader)
  return response.data
}

const getEvaluation = async (authorId, userId) => {
  const response = await axios.get(`${baseUrl}?author=${authorId}&user=${userId}`, customHeader)
  return response.data
}

export default { getUserStats, evaluateUser, updateEvaluation, getEvaluation }