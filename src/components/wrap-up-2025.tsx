import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Trophy, ChevronRight, Award, Clock, Users, Target, Flame, Activity, Crown, Star as StarIcon } from 'lucide-react';

// Simplified username input component
const UsernameInput = ({ onSubmit, isLoading }: { onSubmit: (username: string) => void; isLoading: boolean }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Enter Your Roblox Username</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Roblox username..."
            className="w-full px-4 py-3 bg-[#2a2a2f] border border-[#6C5CE7]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'View My 2025 Wrapped'}
          </button>
        </div>
      </div>
    </form>
  );
};

// Simple mini game component
const SimpleMiniGame = ({ score, onScoreChange, onComplete }: { 
  score: number; 
  onScoreChange: (score: number) => void;
  onComplete?: (score: number) => void;
}) => {
  const handleClick = () => {
    onScoreChange(score + 1);
  };
  
  return (
    <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20">
      <h3 className="text-xl font-bold text-white mb-4">Click Challenge!</h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#6C5CE7] mb-4">{score}</div>
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Click Me!
        </button>
      </div>
    </div>
  );
};

// Roblox API service
class RobloxAPI {
  private static readonly USERS_URL = 'https://users.roblox.com/v1/users';
  private static readonly FRIENDS_URL = 'https://friends.roblox.com/v1/users';
  private static readonly GROUPS_URL = 'https://groups.roblox.com/v2/groups';
  private static readonly THUMBNAIL_URL = 'https://thumbnails.roblox.com/v1/users';
  private static readonly GROUP_ID = 35390256;
  
  static async getUserIdFromUsername(username: string) {
    try {
      // Try multiple CORS proxy options
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      const apiUrl = `${this.USERS_URL}/usernames/users`;
      
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy + apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              usernames: [username],
              excludeBannedUsers: false
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('API Response Data:', data);
            
            if (data.data && data.data.length > 0) {
              return data.data[0].id;
            }
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed, trying next...`);
          continue;
        }
      }
      
      console.error('All proxies failed, using fallback');
      return null;
    } catch (error) {
      console.error('Failed to get user ID from username:', error);
      return null;
    }
  }
  
  static async getPlayerData(userId: number) {
    try {
      // Try multiple CORS proxy options
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      for (const proxy of proxies) {
        try {
          // Get user info
          const userResponse = await fetch(proxy + `${this.USERS_URL}/${userId}`);
          if (!userResponse.ok) continue;
          const userData = await userResponse.json();
          
          // Get user's avatar thumbnails
          const thumbnailResponse = await fetch(proxy + `${this.THUMBNAIL_URL}/${userId}/avatar-headshot?size=150x150&format=Png&isCircular=true`);
          const thumbnailData = thumbnailResponse.ok ? await thumbnailResponse.json() : { data: [] };
          
          // Get user's groups
          const userGroupsResponse = await fetch(proxy + `${this.GROUPS_URL}/${userId}/groups/roles`);
          const userGroupsData = userGroupsResponse.ok ? await userGroupsResponse.json() : { data: [] };
          
          // Get friends
          const friendsResponse = await fetch(proxy + `${this.FRIENDS_URL}/${userId}/friends`);
          const friendsData = friendsResponse.ok ? await friendsResponse.json() : { data: [] };
          
          // Get group membership
          const groupMembershipResponse = await fetch(proxy + `${this.GROUPS_URL}/${this.GROUP_ID}/memberships?userId=${userId}`);
          const groupMembershipData = groupMembershipResponse.ok ? await groupMembershipResponse.json() : { data: [] };
          
          const userGroupRole = groupMembershipData.data?.find((membership: any) => membership.user?.userId === userId);

          return {
            id: userData.id,
            name: userData.name,
            displayName: userData.displayName,
            description: userData.description || '',
            created: userData.created,
            isVerified: userData.hasVerifiedBadge || false,
            isDeleted: userData.isDeleted || false,
            externalAppDisplayName: userData.externalAppDisplayName || '',
            avatarUrl: thumbnailData.data?.[0]?.imageUrl || `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
            groupRank: userGroupRole?.role?.name || 'Guest',
            groupRole: userGroupRole?.role,
            groups: userGroupsData.data || [],
            friends: friendsData.data || [],
            totalFriends: friendsData.data?.length || 0,
            totalGroups: userGroupsData.data?.length || 0
          };
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed for getPlayerData, trying next...`);
          continue;
        }
      }
      
      console.error('All proxies failed for getPlayerData, using fallback');
      return null;
    } catch (error) {
      console.error('Failed to fetch player data:', error);
      return null;
    }
  }
  
  static async getGameStats() {
    try {
      // Mock data for now - replace with actual Roblox API calls
      const mockData = {
        visits: 45234,
        playing: 127,
        favorites: 8921,
        rating: 4.8,
        totalVotes: 3421
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    } catch (error) {
      console.error('Failed to fetch Roblox stats:', error);
      return null;
    }
  }
  
  static async getPlayerStats() {
    try {
      // Mock player data - replace with actual API calls
      const mockPlayerData = {
        totalVisits: Math.floor(Math.random() * 1000) + 100,
        playtime: Math.floor(Math.random() * 100) + 20,
        achievements: Math.floor(Math.random() * 15) + 5,
        friends: Math.floor(Math.random() * 200) + 50,
        groupRank: 'Senior Fire Marshal',
        joinedDate: new Date('2024-01-15'),
        lastSeen: new Date(),
        badges: Math.floor(Math.random() * 50) + 10,
        avatarUrl: `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`
      };
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPlayerData;
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
      return null;
    }
  }
}

// Simplified stat card with CSS animations
const SimpleStatCard = ({ value, label, icon: Icon, delay = 0 }: {
  value: string | number;
  label: string;
  icon: any;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      const duration = 2000;
      const startTime = performance.now();
      const targetValue = value;
      
      const animateCounter = () => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(targetValue * easeOutQuart);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        }
      };
      
      requestAnimationFrame(animateCounter);
    } else if (isVisible && typeof value === 'string') {
      setDisplayValue(value as any);
    }
  }, [isVisible, value]);
  
  return (
    <div 
      className={`bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20 hover:border-[#6C5CE7]/40 transition-all duration-300 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#6C5CE7] rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-white font-semibold">{label}</div>
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
      </div>
    </div>
  );
};

const WrapUp2025 = () => {
  const [counters, setCounters] = useState({
    visits: 0,
    discord: 0,
    ranking: 0,
    year: 0,
    alarmsPulled: 0,
    drillsCompleted: 0,
    timePlayed: 0,
    achievements: 0,
    robloxVisits: 0,
    robloxPlaying: 0,
    robloxFavorites: 0,
    robloxRating: 0,
    friends: 0,
    groups: 0,
    accountAge: 0
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerData, setPlayerData] = useState<any>(null);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);

// Simplified achievement badge
const SimpleAchievementBadge = ({ icon, name, unlocked }: {
  icon: string;
  name: string;
  unlocked: boolean;
}) => {
  return (
    <div className={`text-center ${!unlocked && 'opacity-50'}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-2 ${
        unlocked ? 'bg-[#6C5CE7]' : 'bg-[#3a3a3f]'
      }`}>
        {icon}
      </div>
      <p className="text-xs text-white">{name}</p>
    </div>
  );
};

// Simplified stat card with CSS animations
const SimpleStatCard = ({ 
  value, 
  label, 
  icon: Icon,
  delay = 0
}: {
  value: string | number;
  label: string;
  icon: any;
  delay?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      const duration = 1500;
      const increment = value / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else if (isVisible && typeof value === 'string') {
      setDisplayValue(value as any);
    }
  }, [isVisible, value]);
  
  return (
    <div 
      className={`bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20 hover:border-[#6C5CE7]/40 transition-all duration-300 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#6C5CE7] rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-white font-semibold">{label}</div>
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
      </div>
    </div>
  );
};

const WrapUp2025 = () => {
    visits: 0,
    discord: 0,
    ranking: 0,
    year: 0,
    alarmsPulled: 0,
    drillsCompleted: 0,
    timePlayed: 0,
    achievements: 0,
    robloxVisits: 0,
    robloxPlaying: 0,
    robloxFavorites: 0,
    robloxRating: 0,
    friends: 0,
    groups: 0,
    accountAge: 0
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerData, setPlayerData] = useState<any>(null);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Handle username submission
  const handleUsernameSubmit = async (submittedUsername: string) => {
    setIsFetchingData(true);
    setUsername(submittedUsername);
    
    try {
      // Get user ID from username
      const userId = await RobloxAPI.getUserIdFromUsername(submittedUsername);
      
      if (!userId) {
        // Use mock data if API fails
        console.log('API failed, using mock data for username:', submittedUsername);
        const mockPlayerData = {
          id: Math.floor(Math.random() * 1000000000),
          name: submittedUsername,
          displayName: submittedUsername,
          description: 'Demo user - API unavailable',
          created: new Date().toISOString(),
          isVerified: false,
          isDeleted: false,
          externalAppDisplayName: '',
          avatarUrl: `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
          groupRank: 'Member',
          groupRole: null,
          groups: [],
          friends: [],
          totalFriends: Math.floor(Math.random() * 100),
          totalGroups: Math.floor(Math.random() * 5)
        };
        
        setPlayerData(mockPlayerData);
        setCounters(prev => ({
          ...prev,
          friends: mockPlayerData.totalFriends,
          groups: mockPlayerData.totalGroups,
          accountAge: Math.floor(Math.random() * 5) + 1,
          // Mock some game-specific stats
          alarmsPulled: Math.floor(Math.random() * 1000) + 100,
          drillsCompleted: Math.floor(Math.random() * 50) + 10,
          timePlayed: Math.floor(Math.random() * 100) + 20,
          achievements: Math.floor(Math.random() * 20) + 5
        }));
        
        setShowUsernameInput(false);
        setIsFetchingData(false);
        return;
      }
      
      // Get player data
      const playerInfo = await RobloxAPI.getPlayerData(userId);
      
      if (playerInfo) {
        setPlayerData(playerInfo);
        
        // Update counters with real data
        setCounters(prev => ({
          ...prev,
          friends: playerInfo.totalFriends,
          groups: playerInfo.totalGroups,
          accountAge: Math.floor((Date.now() - new Date(playerInfo.created).getTime()) / (1000 * 60 * 60 * 24 * 365)),
          // Mock some game-specific stats for now
          alarmsPulled: Math.floor(Math.random() * 1000) + 100,
          drillsCompleted: Math.floor(Math.random() * 50) + 10,
          timePlayed: Math.floor(Math.random() * 100) + 20,
          achievements: Math.floor(Math.random() * 20) + 5
        }));
        
        setShowUsernameInput(false);
      } else {
        // Fallback to mock data if getPlayerData fails
        const mockPlayerData = {
          id: userId,
          name: submittedUsername,
          displayName: submittedUsername,
          description: 'Demo user - Partial API failure',
          created: new Date().toISOString(),
          isVerified: false,
          isDeleted: false,
          externalAppDisplayName: '',
          avatarUrl: `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
          groupRank: 'Member',
          groupRole: null,
          groups: [],
          friends: [],
          totalFriends: Math.floor(Math.random() * 100),
          totalGroups: Math.floor(Math.random() * 5)
        };
        
        setPlayerData(mockPlayerData);
        setCounters(prev => ({
          ...prev,
          friends: mockPlayerData.totalFriends,
          groups: mockPlayerData.totalGroups,
          accountAge: Math.floor(Math.random() * 5) + 1,
          alarmsPulled: Math.floor(Math.random() * 1000) + 100,
          drillsCompleted: Math.floor(Math.random() * 50) + 10,
          timePlayed: Math.floor(Math.random() * 100) + 20,
          achievements: Math.floor(Math.random() * 20) + 5
        }));
        
        setShowUsernameInput(false);
      }
    } catch (error) {
      console.error('Error in handleUsernameSubmit:', error);
      alert('An error occurred while fetching your data. Using demo data instead.');
      
      // Final fallback to mock data
      const mockPlayerData = {
        id: Math.floor(Math.random() * 1000000000),
        name: submittedUsername,
        displayName: submittedUsername,
        description: 'Demo user - API error',
        created: new Date().toISOString(),
        isVerified: false,
        isDeleted: false,
        externalAppDisplayName: '',
        avatarUrl: `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
        groupRank: 'Member',
        groupRole: null,
        groups: [],
        friends: [],
        totalFriends: Math.floor(Math.random() * 100),
        totalGroups: Math.floor(Math.random() * 5)
      };
      
      setPlayerData(mockPlayerData);
      setCounters(prev => ({
        ...prev,
        friends: mockPlayerData.totalFriends,
        groups: mockPlayerData.totalGroups,
        accountAge: Math.floor(Math.random() * 5) + 1,
        alarmsPulled: Math.floor(Math.random() * 1000) + 100,
        drillsCompleted: Math.floor(Math.random() * 50) + 10,
        timePlayed: Math.floor(Math.random() * 100) + 20,
        achievements: Math.floor(Math.random() * 20) + 5
      }));
      
      setShowUsernameInput(false);
    } finally {
      setIsFetchingData(false);
    }
  };
  
  // Mouse tracking for parallax effects - throttled
  useEffect(() => {
    let timeoutId: number;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }, 16); // ~60fps throttle
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Loading animation
  // Initialize counters
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounters(prev => ({
        ...prev,
        visits: Math.floor(Math.random() * 10000) + 1000,
        discord: Math.floor(Math.random() * 5000) + 500,
        ranking: Math.floor(Math.random() * 100) + 1,
        year: 2025
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // CSS-based animations instead of GSAP
  useEffect(() => {
    // Add CSS animations class to body
    document.body.classList.add('animations-enabled');
    return () => {
      document.body.classList.remove('animations-enabled');
    };
  }, []);
  
  // Memoized pages for performance
  const pages = useMemo(() => [
    // Page 1: Welcome with username input - simplified
    <div key="page-1" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto relative z-20">
        {showUsernameInput ? (
          <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isFetchingData} />
        ) : (
          <>
            <div className="mb-12">
              {/* User Profile Card - simplified */}
              {playerData && (
                <div className="bg-[#1a1a1f] rounded-xl p-4 mb-8 border border-[#6C5CE7]/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src={playerData.avatarUrl} 
                      alt={playerData.displayName} 
                      className="w-12 h-12 rounded-full border-2 border-[#6C5CE7]"
                    />
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white">{playerData.displayName}</h3>
                      <p className="text-[#A3A3A3] text-sm">@{playerData.name}</p>
                      <div className="text-xs px-2 py-1 bg-[#6C5CE7]/20 text-[#6C5CE7] rounded-full inline-block mt-1">
                        {playerData.groupRank}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 text-white text-center">
                {username ? `${username}'s 2025 Wrapped` : '2025 Wrapped'}
              </h1>
              
              <p className="text-[#A3A3A3] text-center max-w-2xl mx-auto">
                Your year in Atlanta High Fire Alarm Simulation
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentPage(1)}
                className="px-8 py-3 bg-[#6C5CE7] text-white font-semibold rounded-lg transition-colors hover:bg-[#5a4bd7]"
              >
                Start Experience
              </button>
              
              <button 
                onClick={() => {
                  setShowUsernameInput(true);
                  setUsername('');
                  setPlayerData(null);
                }}
                className="px-6 py-3 bg-[#2a2a2f] text-white font-medium rounded-lg border border-[#3a3a3f] transition-colors hover:bg-[#3a3a3f]"
              >
                Change User
              </button>
            </div>
          </>
        )}
      </div>
    </div>,

    // Page 2: Stats - simplified
    <div key="page-2" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Your 2025 Stats
        </h2>
        
        {/* Roblox Game Stats */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Game Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SimpleStatCard value={counters.robloxVisits} label="Total Visits" icon={Users} delay={0} />
            <SimpleStatCard value={counters.robloxPlaying} label="Playing Now" icon={Activity} delay={0.2} />
            <SimpleStatCard value={counters.robloxFavorites} label="Favorites" icon={Trophy} delay={0.4} />
            <SimpleStatCard value={counters.robloxRating} label="Rating" icon={StarIcon} delay={0.6} />
          </div>
        </div>
        
        {/* Your Profile Stats */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SimpleStatCard value={counters.friends} label="Friends" icon={Users} delay={0.8} />
            <SimpleStatCard value={counters.groups} label="Groups" icon={Crown} delay={1.0} />
            <SimpleStatCard value={counters.accountAge} label="Account Age (years)" icon={Clock} delay={1.2} />
            <SimpleStatCard value={playerData?.isVerified ? "Yes" : "No"} label="Verified" icon={StarIcon} delay={1.4} />
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Your Game Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SimpleStatCard value={counters.alarmsPulled} label="Alarms Pulled" icon={Flame} delay={1.6} />
            <SimpleStatCard value={counters.drillsCompleted} label="Drills Completed" icon={Target} delay={1.8} />
            <SimpleStatCard value={`${counters.timePlayed}h`} label="Time Played" icon={Clock} delay={2.0} />
            <SimpleStatCard value={counters.achievements} label="Achievements" icon={Award} delay={2.2} />
          </div>
        </div>
        
        {/* Simple Mini Game */}
        <div className="flex justify-center">
          <SimpleMiniGame score={miniGameScore} onScoreChange={setMiniGameScore} />
        </div>
      </div>
    </div>,

    // Page 3: Achievements - simplified
    <div key="page-3" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Achievement Collection
        </h2>
        
        {/* Achievement Badges Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Your Badges</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-12">
            <SimpleAchievementBadge icon="🔥" name="Fire Starter" unlocked />
            <SimpleAchievementBadge icon="🚨" name="Alert Pro" unlocked />
            <SimpleAchievementBadge icon="⚡" name="Speed Demon" unlocked />
            <SimpleAchievementBadge icon="🌟" name="Superstar" unlocked={false} />
            <SimpleAchievementBadge icon="💎" name="Diamond" unlocked />
            <SimpleAchievementBadge icon="🏆" name="Champion" unlocked />
            <SimpleAchievementBadge icon="👑" name="Royalty" unlocked={false} />
            <SimpleAchievementBadge icon="🎯" name="Perfect" unlocked />
          </div>
        </div>
        
        {/* Achievement Progress */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20">
          <h3 className="text-xl font-bold text-white mb-6">Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>Fire Alarm Master</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-[#2a2a2f] rounded-full h-2">
                <div className="w-3/4 bg-[#6C5CE7] h-2 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>Speed Runner</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-[#2a2a2f] rounded-full h-2">
                <div className="w-3/5 bg-[#6C5CE7] h-2 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>Perfect Score</span>
                <span>90%</span>
              </div>
              <div className="w-full bg-[#2a2a2f] rounded-full h-2">
                <div className="w-11/12 bg-[#6C5CE7] h-2 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Page 4: Thank You - simplified
    <div key="page-4" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#6C5CE7]/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Thank You!
            </h2>
            
            <p className="text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
              For being part of our amazing community in 2025. Your dedication makes Atlanta High the #1 fire alarm simulation game!
            </p>
            
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#6C5CE7]">{counters.robloxVisits.toLocaleString()}</div>
                <div className="text-sm text-[#A3A3A3]">Total Visits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#6C5CE7]">{counters.robloxPlaying}</div>
                <div className="text-sm text-[#A3A3A3]">Playing Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#6C5CE7]">{counters.alarmsPulled.toLocaleString()}</div>
                <div className="text-sm text-[#A3A3A3]">Alarms Pulled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#6C5CE7]">{miniGameScore}</div>
                <div className="text-sm text-[#A3A3A3]">Game Score</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setCurrentPage(0)}
                className="px-6 py-3 bg-[#6C5CE7] text-white font-semibold rounded-lg transition-colors hover:bg-[#5a4bd7]"
              >
                View Again
              </button>
              
              <button 
                onClick={() => {
                  setShowUsernameInput(true);
                  setUsername('');
                  setPlayerData(null);
                  setCurrentPage(0);
                }}
                className="px-6 py-3 bg-[#2a2a2f] text-white font-medium rounded-lg border border-[#3a3a3f] transition-colors hover:bg-[#3a3a3f]"
              >
                New User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ], [counters, currentPage, playerData, miniGameScore, showUsernameInput]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage(prev => Math.min(pages.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax style calculation
  const parallaxStyle = useCallback(() => {
    return {
      transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`
    };
  }, [mousePosition]);

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0E0E11] text-white overflow-hidden" style={parallaxStyle()}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A3A3A3] font-medium">2025 WRAPPED</span>
            <span className="text-sm text-[#A3A3A3] font-medium">{currentPage + 1} / {pages.length}</span>
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl rounded-full px-6 py-3 border border-[rgba(255,255,255,0.1)]">
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 0}
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`transition-all duration-300 ${
                i === currentPage 
                  ? 'w-8 h-2 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full' 
                  : 'w-2 h-2 bg-[rgba(255,255,255,0.3)] rounded-full hover:bg-[rgba(255,255,255,0.5)]'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === pages.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Content */}
      <div className="pt-20">
        <div className="relative">
          {pages[currentPage]}
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animations-enabled .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animations-enabled .fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
        
        .animations-enabled .float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animations-enabled .stagger-1 { animation-delay: 0.1s; }
        .animations-enabled .stagger-2 { animation-delay: 0.2s; }
        .animations-enabled .stagger-3 { animation-delay: 0.3s; }
        .animations-enabled .stagger-4 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default WrapUp2025;
