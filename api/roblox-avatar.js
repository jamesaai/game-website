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
    // First, get user ID from username
    const userResponse = await fetch(
      `https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`
    );

    if (!userResponse.ok) {
      throw new Error(`User not found: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    
    if (!userData.id) {
      throw new Error('User ID not found in response');
    }

    // Then, get 3D avatar
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-3d?userId=${userData.id}&size=420x420&format=Png&captureSide=Front`
    );

    if (!avatarResponse.ok) {
      throw new Error(`Avatar fetch failed: ${avatarResponse.status}`);
    }

    const avatarData = await avatarResponse.json();
    const imageUrl = avatarData.data?.[0]?.imageUrl;

    if (!imageUrl) {
      throw new Error('Avatar URL not found in response');
    }

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
      message: error.message 
    });
  }
}
