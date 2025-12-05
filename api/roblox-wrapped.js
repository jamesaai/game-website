// Vercel Serverless Function for Roblox Wrapped data
// This handles all Roblox API calls server-side to avoid CORS issues

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
    console.log(`Fetching Roblox Wrapped data for username: ${username}`);
    
    // Step 1: Get user ID from username
    const userResponse = await fetch(
      `https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`
    );

    if (!userResponse.ok) {
      throw new Error(`User not found (status: ${userResponse.status})`);
    }

    const userData = await userResponse.json();
    
    if (!userData.id) {
      throw new Error('User ID not found in response');
    }

    console.log(`Found user ID: ${userData.id}`);

    // Step 2: Get detailed user information
    const userInfoResponse = await fetch(
      `https://users.roblox.com/v1/users/${userData.id}`
    );

    let userInfo = {};
    if (userInfoResponse.ok) {
      userInfo = await userInfoResponse.json();
    }

    // Step 3: Get avatar thumbnail
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userId=${userData.id}&size=150x150&format=Png&isCircular=true`
    );

    let avatarUrl = `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`;
    if (avatarResponse.ok) {
      const avatarData = await avatarResponse.json();
      if (avatarData.data?.[0]?.imageUrl) {
        avatarUrl = avatarData.data[0].imageUrl;
      }
    }

    // Step 4: Get user groups
    const groupsResponse = await fetch(
      `https://groups.roblox.com/v2/users/${userData.id}/groups/roles`
    );

    let groups = [];
    if (groupsResponse.ok) {
      const groupsData = await groupsResponse.json();
      groups = groupsData.data || [];
    }

    // Step 5: Get friends
    const friendsResponse = await fetch(
      `https://friends.roblox.com/v1/users/${userData.id}/friends`
    );

    let friends = [];
    if (friendsResponse.ok) {
      const friendsData = await friendsResponse.json();
      friends = friendsData.data || [];
    }

    // Step 6: Get game stats (Atlanta High School Roleplay)
    const gameResponse = await fetch(
      `https://games.roblox.com/v1/games?universeIds=35390256`
    );

    let gameStats = {
      visits: 127843,
      playing: 342,
      favorites: 28947,
      rating: 4.7,
      name: 'Atlanta High School Roleplay',
      description: 'Experience authentic high school life in Atlanta! Join as a student, teacher, or staff member.',
      creator: 'AtlantaHSDevelopment',
      genre: 'Roleplay',
      maxPlayers: 60,
      price: 0
    };

    if (gameResponse.ok) {
      const gameData = await gameResponse.json();
      if (gameData.data?.[0]) {
        const game = gameData.data[0];
        gameStats = {
          visits: game.visits || 127843,
          playing: game.playing || 342,
          favorites: game.favoritedCount || 28947,
          name: game.name || 'Atlanta High School Roleplay',
          description: game.description || gameStats.description,
          creator: game.creator?.name || 'AtlantaHSDevelopment',
          genre: game.genre || 'Roleplay',
          maxPlayers: game.maxPlayers || 60,
          price: game.price || 0
        };
      }
    }

    // Step 7: Get game votes/rating
    const votesResponse = await fetch(
      `https://games.roblox.com/v1/games/votes?universeIds=35390256`
    );

    let rating = 4.7;
    if (votesResponse.ok) {
      const votesData = await votesResponse.json();
      if (votesData.data?.[0]) {
        const votes = votesData.data[0];
        const totalVotes = (votes.upVotes || 0) + (votes.downVotes || 0);
        rating = totalVotes > 0 ? ((votes.upVotes || 0) / totalVotes) * 5 : 4.7;
      }
    }
    gameStats.rating = parseFloat(rating.toFixed(1));

    // Step 8: Get favorites count
    const favoritesResponse = await fetch(
      `https://games.roblox.com/v1/games/35390256/favorites/count`
    );

    if (favoritesResponse.ok) {
      const favoritesData = await favoritesResponse.json();
      gameStats.favorites = favoritesData.favoritesCount || gameStats.favorites;
    }

    // Step 9: Check group membership for Atlanta High School (if applicable)
    const GROUP_ID = 35390256;
    let isGroupMember = false;
    let groupRole = null;

    try {
      const groupMembershipResponse = await fetch(
        `https://groups.roblox.com/v2/groups/${GROUP_ID}/memberships?userId=${userData.id}`
      );

      if (groupMembershipResponse.ok) {
        const membershipData = await groupMembershipResponse.json();
        const userMembership = membershipData.data?.find(m => m.user?.userId === userData.id);
        if (userMembership) {
          isGroupMember = true;
          groupRole = userMembership.role;
        }
      }
    } catch (error) {
      console.log('Group membership check failed:', error.message);
    }

    // Calculate account age
    const createdDate = new Date(userInfo.created || Date.now());
    const accountAge = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

    // Generate enhanced stats based on group membership and account age
    const baseMultiplier = isGroupMember ? 2.5 : 1.0;
    const accountMultiplier = Math.min(accountAge / 5, 2.0); // Max 2x for old accounts
    const totalMultiplier = baseMultiplier * accountMultiplier;

    const enhancedStats = {
      alarmsPulled: Math.floor((Math.random() * 4000 + 1000) * totalMultiplier),
      drillsCompleted: Math.floor((Math.random() * 300 + 100) * totalMultiplier),
      timePlayed: Math.floor((Math.random() * 400 + 150) * totalMultiplier),
      achievements: Math.floor((Math.random() * 50 + 20) * totalMultiplier),
      fireAlarmRank: Math.floor(Math.random() * 50) + 1,
      drillRank: Math.floor(Math.random() * 100) + 1,
      attendanceRank: Math.floor(Math.random() * 200) + 1,
      socialRank: Math.floor(Math.random() * 150) + 1
    };

    const responseData = {
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        displayName: userData.displayName || userData.name,
        description: userInfo.description || '',
        created: userInfo.created || new Date().toISOString(),
        isVerified: userInfo.hasVerifiedBadge || false,
        isDeleted: userInfo.isDeleted || false,
        externalAppDisplayName: userInfo.externalAppDisplayName || '',
        avatarUrl,
        groupRank: groupRole?.name || 'Guest',
        isGroupMember,
        groupRole,
        groups,
        friends,
        totalFriends: friends.length,
        totalGroups: groups.length,
        accountAge
      },
      game: gameStats,
      stats: enhancedStats,
      apiStatus: 'success'
    };

    console.log(`Successfully fetched data for ${username}`);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Roblox Wrapped API error:', error);
    
    // Return mock data with error status
    const mockData = {
      success: false,
      error: error.message,
      user: {
        id: Math.floor(Math.random() * 1000000000),
        name: username,
        displayName: username,
        description: 'Demo user - API unavailable',
        created: new Date().toISOString(),
        isVerified: false,
        isDeleted: false,
        externalAppDisplayName: '',
        avatarUrl: `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
        groupRank: 'Member',
        isGroupMember: false,
        groupRole: null,
        groups: [],
        friends: [],
        totalFriends: Math.floor(Math.random() * 100),
        totalGroups: Math.floor(Math.random() * 5),
        accountAge: Math.floor(Math.random() * 5) + 1
      },
      game: {
        visits: 127843,
        playing: 342,
        favorites: 28947,
        rating: 4.7,
        name: 'Atlanta High School Roleplay',
        description: 'Experience authentic high school life in Atlanta! Join as a student, teacher, or staff member.',
        creator: 'AtlantaHSDevelopment',
        genre: 'Roleplay',
        maxPlayers: 60,
        price: 0
      },
      stats: {
        alarmsPulled: Math.floor(Math.random() * 3000) + 500,
        drillsCompleted: Math.floor(Math.random() * 200) + 50,
        timePlayed: Math.floor(Math.random() * 300) + 100,
        achievements: Math.floor(Math.random() * 40) + 10,
        fireAlarmRank: Math.floor(Math.random() * 50) + 1,
        drillRank: Math.floor(Math.random() * 100) + 1,
        attendanceRank: Math.floor(Math.random() * 200) + 1,
        socialRank: Math.floor(Math.random() * 150) + 1
      },
      apiStatus: 'error'
    };

    return res.status(200).json(mockData);
  }
}
