import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/messages'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, customHeader)
  return response.data
}

const sendPusherMessage = async (conversationId, message) => {
  const response = await axios.post('/api/pusher', { conversationId, message }, customHeader)
  return response.data
}

const getMessageInfo = async (messageId) => {
  const response = await axios.get(`${baseUrl}/${messageId}`, customHeader)
  return response.data
}

export default { create, sendPusherMessage, getMessageInfo }
