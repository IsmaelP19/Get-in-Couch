import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/conversations'

const customHeader = { headers: { 'X-Origin': 'getincouch.vercel.app' } }

const getAllConversations = async () => {
  const response = await axios.get(`${baseUrl}`, customHeader)
  return response.data
}

export default { getAllConversations }
