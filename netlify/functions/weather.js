/**
 * Netlify Function to proxy AccuWeather API requests
 * This solves CORS issues by making requests from the server
 */

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get API key from environment variable
  // Netlify Functions can access env vars with or without VITE_ prefix
  const apiKey = process.env.ACCUWEATHER_API_KEY || process.env.VITE_ACCUWEATHER_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Weather API key not configured' }),
    };
  }

  // Get the endpoint and query parameters from the request
  const { endpoint, ...queryParams } = event.queryStringParameters || {};
  
  if (!endpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing endpoint parameter' }),
    };
  }

  try {
    // Build the AccuWeather API URL
    const queryString = new URLSearchParams({
      ...queryParams,
      apikey: apiKey,
    }).toString();

    const apiUrl = `https://dataservice.accuweather.com/${endpoint}?${queryString}`;
    
    console.log('Proxying request to:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'));

    // Make the request to AccuWeather
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AccuWeather API error:', errorText);
      return {
        statusCode: response.status,
        body: errorText,
      };
    }

    const data = await response.json();

    // Return the data with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch weather data',
        message: error.message 
      }),
    };
  }
};

