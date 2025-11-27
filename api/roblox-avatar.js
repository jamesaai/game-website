// Vercel Serverless Function to proxy Roblox user avatar requests
// This avoids CORS issues by calling Roblox from the server side

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

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    console.log(`Fetching avatar for username: ${username}`);
    
    // First, get user ID from username
    const userResponse = await fetch(
      `https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`
    );

    console.log(`User API response status: ${userResponse.status}`);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log(`User API error response: ${errorText}`);
      throw new Error(`User not found (status: ${userResponse.status})`);
    }

    const userData = await userResponse.json();
    console.log(`User data:`, JSON.stringify(userData, null, 2));
    
    if (!userData.id) {
      throw new Error('User ID not found in response');
    }

    console.log(`Found user ID: ${userData.id}`);

    // Then, get 3D avatar object
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-3d?userId=${userData.id}&size=420x420&format=Png&captureSide=Front`
    );

    console.log(`Avatar API response status: ${avatarResponse.status}`);

    if (!avatarResponse.ok) {
      const errorText = await avatarResponse.text();
      console.log(`Avatar API error response: ${errorText}`);
      throw new Error(`Avatar fetch failed (status: ${avatarResponse.status})`);
    }

    const avatarData = await avatarResponse.json();
    console.log(`Avatar data:`, JSON.stringify(avatarData, null, 2));
    
    const imageUrl = avatarData.data?.[0]?.imageUrl;

    if (!imageUrl) {
      throw new Error('Avatar URL not found in response');
    }

    console.log(`Avatar URL: ${imageUrl}`);

    return res.status(200).json({
      success: true,
      userId: userData.id,
      username: userData.name,
      displayName: userData.displayName,
      avatarUrl: imageUrl
    });

  } catch (error) {
    console.error('Roblox avatar proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch avatar',
      message: error.message,
      details: error.toString()
    });
  }
}
