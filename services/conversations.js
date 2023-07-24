import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/conversations'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAllConversations = async (id) => {
  const response = await axios.get(`${baseUrl}?user=${id}`, customHeader)
  return response.data
}

const getMessagesFromConversation = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/`, customHeader)
  return response.data
}

export default { getAllConversations, getMessagesFromConversation }
