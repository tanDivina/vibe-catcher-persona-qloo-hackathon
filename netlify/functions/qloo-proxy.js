// This is your new, secure backend proxy.
// Its only job is to receive requests from your frontend and safely forward them to the Qloo API.
// This file should be located at: /netlify/functions/qloo-proxy.js

// Use 'require' because this is a standard Netlify Function (CommonJS)
require('dotenv').config();
const axios = require('axios');

const QLOO_API_KEY = process.env.QLOO_API_KEY;

// Fail fast if the API key is not configured in the environment
if (!QLOO_API_KEY) {
  throw new Error("QLOO_API_KEY is not defined in your environment variables. Please set it in your .env file for local dev or in the Netlify UI for production.");
}

// Create a pre-configured Axios instance for all Qloo API calls
const qlooApi = axios.create({
  baseURL: 'https://hackathon.api.qloo.com',
  headers: { 'X-Api-Key': QLOO_API_KEY } // Using the correct header
});

// This is the main handler for your Netlify serverless function
exports.handler = async (event) => {
  // Set up CORS headers to allow your frontend to talk to this function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // We will only accept POST requests
    'Content-Type': 'application/json'
  };

  // Handle preflight CORS requests from the browser
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  // Reject any requests that are not POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // The frontend will send a JSON body with the target Qloo path and the parameters
    const { targetPath, params } = JSON.parse(event.body);

    console.log(`Proxying request to Qloo endpoint: ${targetPath}`);
    console.log(`With params:`, params);

    // Make the GET request to the Qloo API on behalf of the frontend
    const response = await qlooApi.get(targetPath, { params });
    
    // Send the successful response from Qloo back to the frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('💥 Error in Qloo proxy function:', error.response?.data || error.message);
    // If Qloo returns an error, forward that error back to the frontend
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ error: `Failed to proxy request: ${error.message}` })
    };
  }
};