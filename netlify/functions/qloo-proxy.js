// This is your new, secure backend proxy.
// Its only job is to receive requests from your frontend and safely forward them to the Qloo API.
require('dotenv').config();
const axios = require('axios');

const QLOO_API_KEY = process.env.QLOO_API_KEY;
if (!QLOO_API_KEY) {
  throw new Error("QLOO_API_KEY is not defined in your environment variables.");
}

const qlooApi = axios.create({
  baseURL: 'https://hackathon.api.qloo.com',
  headers: { 'X-Api-Key': QLOO_API_KEY }
});

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod === 'OPTIONS') { return { statusCode: 204, headers }; }
  if (event.httpMethod !== 'POST') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }; }

  try {
    const { targetPath, params } = JSON.parse(event.body);
    console.log(`Proxying request to Qloo: ${targetPath}`);
    const response = await qlooApi.get(targetPath, { params });
    return { statusCode: 200, headers, body: JSON.stringify(response.data) };
  } catch (error) {
    console.error('💥 Error in Qloo proxy function:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ error: `Failed to proxy request: ${error.message}` })
    };
  }
};
