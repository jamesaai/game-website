// Simple test endpoint to verify the proxy is working

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test with a known Roblox user
    const username = 'Roblox'; // Official Roblox account
    console.log(`Testing with username: ${username}`);
    
    const userResponse = await fetch(
      `https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`
    );

    const responseText = await userResponse.text();
    console.log(`Response status: ${userResponse.status}`);
    console.log(`Response text: ${responseText.substring(0, 500)}...`);

    if (!userResponse.ok) {
      return res.status(500).json({ 
        error: 'API test failed',
        status: userResponse.status,
        response: responseText.substring(0, 500)
      });
    }

    const userData = await userResponse.json();
    
    return res.status(200).json({
      success: true,
      message: 'Proxy is working',
      userData: {
        id: userData.id,
        name: userData.name,
        displayName: userData.displayName
      }
    });

  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({ 
      error: 'Test failed',
      message: error.message,
      details: error.toString()
    });
  }
}
