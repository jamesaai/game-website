import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Trophy, ChevronRight, Award, Clock, Users, Target, Flame, Activity, Crown, Star as StarIcon, Sparkles } from 'lucide-react';

// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;
    
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.log(`${componentName} render #${renderCount.current}, time since last: ${timeSinceLastRender.toFixed(2)}ms`);
    }
  });
};

// Particle system for advanced UI
const ParticleSystem = ({ count = 50, className = '' }: { count?: number; className?: string }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2
    })), [count]
  );
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-[#6C5CE7] rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Enhanced loading spinner component
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 border-4 border-[#6C5CE7]/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-[#00E5FF]/20 rounded-full"></div>
      <div className="absolute inset-2 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
    <p className="text-white text-lg font-medium animate-pulse">{message}</p>
    <p className="text-[#A3A3A3] text-sm mt-2">Fetching your Roblox data...</p>
  </div>
);

// API Status indicator
const APIStatusIndicator = ({ status }: { status: 'loading' | 'success' | 'error' | 'partial' }) => {
  const statusConfig = {
    loading: { color: 'text-yellow-400', icon: '⏳', text: 'Connecting to Roblox API...' },
    success: { color: 'text-green-400', icon: '✅', text: 'API Connected' },
    error: { color: 'text-red-400', icon: '❌', text: 'API Unavailable' },
    partial: { color: 'text-orange-400', icon: '⚠️', text: 'Limited API Access' }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`flex items-center gap-2 text-sm ${config.color} bg-[rgba(0,0,0,0.3)] px-3 py-1 rounded-full`}>
      <span className="text-lg">{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

// Enhanced stat card with shimmer loading effect
const EnhancedStatCard = ({ 
  value, 
  label, 
  icon: Icon, 
  delay = 0, 
  trend, 
  color = '#6C5CE7',
  isLoading = false 
}: {
  value: string | number;
  label: string;
  icon: any;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  isLoading?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useEffect(() => {
    if (isVisible && !isLoading && typeof value === 'number') {
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
    } else if (isVisible && !isLoading && typeof value === 'string') {
      setDisplayValue(value as any);
    }
  }, [isVisible, value, isLoading]);
  
  if (isLoading) {
    return (
      <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`bg-[#1a1a1f] rounded-xl p-6 border transition-all duration-500 transform cursor-pointer ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      } ${
        isHovered 
          ? 'border-[#6C5CE7] shadow-lg shadow-[#6C5CE7]/20 scale-105' 
          : 'border-[#6C5CE7]/20 hover:border-[#6C5CE7]/40'
      }`}
      style={{ 
        transitionDelay: `${delay}s`,
        background: isHovered ? `linear-gradient(135deg, #1a1a1f 0%, ${color}15 100%)` : '#1a1a1f'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-white font-semibold">{label}</div>
        {trend && (
          <div className={`ml-auto text-sm font-medium ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
      </div>
    </div>
  );
};

// Enhanced achievement badge with company-style rankings
const CompanyAchievementBadge = ({ 
  icon, 
  name, 
  description,
  unlocked, 
  rarity = 'common', 
  progress = 100,
  rank = null,
  metric = null
}: {
  icon: string;
  name: string;
  description?: string;
  unlocked: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  rank?: number | null;
  metric?: string | null;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const rarityColors = {
    common: 'from-gray-600 to-gray-500',
    rare: 'from-blue-600 to-blue-500',
    epic: 'from-purple-600 to-purple-500',
    legendary: 'from-yellow-600 to-orange-500'
  };
  
  const rarityBorders = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };
  
  return (
    <div 
      className={`text-center transition-all duration-300 transform cursor-pointer ${
        !unlocked && 'opacity-50'
      } ${isHovered ? 'scale-110' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative mb-2`}>
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${rarityColors[rarity]} border-2 ${rarityBorders[rarity]} shadow-lg`}>
          {unlocked ? icon : '🔒'}
        </div>
        {unlocked && (
          <>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            {rank && (
              <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                #{rank}
              </div>
            )}
          </>
        )}
      </div>
      <div className="text-sm font-bold text-white mb-1">{name}</div>
      {description && (
        <div className="text-xs text-[#A3A3A3] mb-2">{description}</div>
      )}
      {metric && unlocked && (
        <div className="text-xs font-semibold text-[#6C5CE7]">{metric}</div>
      )}
      {progress < 100 && (
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Username input component
const UsernameInput = ({ onSubmit, isLoading }: { onSubmit: (username: string) => void; isLoading: boolean }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsValid(true);
      onSubmit(inputValue.trim());
    } else {
      setIsValid(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Enter Your Roblox Username</h2>
        
        {isLoading ? (
          <LoadingSpinner message="Finding your profile..." />
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsValid(true);
                }}
                placeholder="Roblox username..."
                className={`w-full px-4 py-3 bg-[#2a2a2f] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] transition-colors ${
                  !isValid ? 'border-red-500' : 'border-[#6C5CE7]/30'
                }`}
                disabled={isLoading}
              />
              {!isValid && (
                <p className="text-red-400 text-sm mt-1">Please enter a valid username</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Loading...' : 'View My 2025 Wrapped'}
            </button>
            
            <div className="text-center">
              <APIStatusIndicator status="loading" />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

// Simple mini game component
const SimpleMiniGame = ({ score, onScoreChange }: { 
  score: number; 
  onScoreChange: (score: number) => void;
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

// Roblox API service with enhanced CORS handling
class RobloxAPI {
  private static readonly USERS_URL = 'https://users.roblox.com/v1/users';
  private static readonly FRIENDS_URL = 'https://friends.roblox.com/v1/users';
  private static readonly GROUPS_URL = 'https://groups.roblox.com/v2/groups';
  private static readonly THUMBNAIL_URL = 'https://thumbnails.roblox.com/v1/users';
  private static readonly GAMES_URL = 'https://games.roblox.com/v1/games';
  private static readonly GROUP_ID = 35390256;
  
  // Enhanced proxy list with working alternatives
  private static readonly PROXIES = [
    {
      url: 'https://api.codetabs.io/v1/proxy?quest=',
      type: 'query'
    },
    {
      url: 'https://corsproxy.io/?',
      type: 'direct'
    },
    {
      url: 'https://api.allorigins.win/raw?url=',
      type: 'direct'
    },
    {
      url: 'https://thingproxy.freeboard.io/fetch/',
      type: 'direct'
    },
    {
      url: 'https://cors-anywhere.herokuapp.com/',
      type: 'direct'
    }
  ];
  
  // Helper method to try different proxy configurations
  private static async tryProxyRequest(url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response | null> {
    if (proxyIndex >= this.PROXIES.length) return null;
    
    const proxy = this.PROXIES[proxyIndex];
    const proxyUrl = proxy.type === 'query' 
      ? `${proxy.url}${encodeURIComponent(url)}`
      : `${proxy.url}${url}`;
    
    try {
      console.log(`Trying proxy ${proxyIndex + 1}/${this.PROXIES.length}: ${proxy.url}`);
      
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...options.headers
        }
      });
      
      if (response.ok) {
        console.log(`Proxy ${proxyIndex + 1} successful`);
        return response;
      } else {
        console.log(`Proxy ${proxyIndex + 1} failed with status: ${response.status}`);
        return this.tryProxyRequest(url, options, proxyIndex + 1);
      }
    } catch (error) {
      console.log(`Proxy ${proxyIndex + 1} error:`, error);
      return this.tryProxyRequest(url, options, proxyIndex + 1);
    }
  }
  
  static async getUserIdFromUsername(username: string) {
    try {
      const apiUrl = `${this.USERS_URL}/usernames/users`;
      const requestBody = JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      });
      
      const response = await this.tryProxyRequest(apiUrl, {
        method: 'POST',
        body: requestBody
      });
      
      if (response) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          return data.data[0].id;
        }
      }
      
      console.log('All proxies failed for getUserIdFromUsername');
      return null;
    } catch (error) {
      console.error('Error in getUserIdFromUsername:', error);
      return null;
    }
  }
  
  static async getPlayerData(userId: number) {
    try {
      // Try to get user info
      const userResponse = await this.tryProxyRequest(`${this.USERS_URL}/${userId}`);
      if (!userResponse) return null;
      const userData = await userResponse.json();
      
      // Get avatar thumbnail
      const thumbnailResponse = await this.tryProxyRequest(
        `${this.THUMBNAIL_URL}/${userId}/avatar-headshot?size=150x150&format=Png&isCircular=true`
      );
      const thumbnailData = thumbnailResponse?.ok ? await thumbnailResponse.json() : { data: [] };
      
      // Get user groups
      const userGroupsResponse = await this.tryProxyRequest(`${this.GROUPS_URL}/${userId}/groups/roles`);
      const userGroupsData = userGroupsResponse?.ok ? await userGroupsResponse.json() : { data: [] };
      
      // Get friends
      const friendsResponse = await this.tryProxyRequest(`${this.FRIENDS_URL}/${userId}/friends`);
      const friendsData = friendsResponse?.ok ? await friendsResponse.json() : { data: [] };
      
      // Get group membership
      const groupMembershipResponse = await this.tryProxyRequest(
        `${this.GROUPS_URL}/${this.GROUP_ID}/memberships?userId=${userId}`
      );
      const groupMembershipData = groupMembershipResponse?.ok ? await groupMembershipResponse.json() : { data: [] };
      
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
        isGroupMember: userGroupRole ? true : false,
        groupRole: userGroupRole?.role,
        groups: userGroupsData.data || [],
        friends: friendsData.data || [],
        totalFriends: friendsData.data?.length || 0,
        totalGroups: userGroupsData.data?.length || 0
      };
    } catch (error) {
      console.error('Error in getPlayerData:', error);
      return null;
    }
  }
  
  static async getGameStats(universeId: number = 35390256) {
    try {
      const apiUrl = `${this.GAMES_URL}?universeIds=${universeId}`;
      
      const response = await this.tryProxyRequest(apiUrl);
      
      if (response) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const gameData = data.data[0];
          return {
            visits: gameData.visits || 0,
            playing: gameData.playing || 0,
            favorites: gameData.favoritedCount || 0,
            rating: 0,
            name: gameData.name || 'Atlanta High School Roleplay',
            description: gameData.description || '',
            created: gameData.created,
            updated: gameData.updated,
            price: gameData.price || 0,
            maxPlayers: gameData.maxPlayers || 0,
            creator: gameData.creator?.name || 'Unknown',
            genre: gameData.genre || 'Roleplay'
          };
        }
      }
      
      console.log('All proxies failed for getGameStats, using enhanced mock data');
      return this.getEnhancedMockGameData();
    } catch (error) {
      console.error('Error in getGameStats:', error);
      return this.getEnhancedMockGameData();
    }
  }
  
  static async getGameVotes(universeId: number = 35390256) {
    try {
      const apiUrl = `${this.GAMES_URL}/votes?universeIds=${universeId}`;
      
      const response = await this.tryProxyRequest(apiUrl);
      
      if (response) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const voteData = data.data[0];
          const totalVotes = (voteData.upVotes || 0) + (voteData.downVotes || 0);
          const rating = totalVotes > 0 ? ((voteData.upVotes || 0) / totalVotes) * 5 : 0;
          
          return {
            upVotes: voteData.upVotes || 0,
            downVotes: voteData.downVotes || 0,
            totalVotes,
            rating: parseFloat(rating.toFixed(1))
          };
        }
      }
      
      console.log('All proxies failed for getGameVotes, using enhanced mock data');
      return this.getEnhancedMockVoteData();
    } catch (error) {
      console.error('Error in getGameVotes:', error);
      return this.getEnhancedMockVoteData();
    }
  }
  
  static async getFavoritesCount(universeId: number = 35390256) {
    try {
      const apiUrl = `${this.GAMES_URL}/${universeId}/favorites/count`;
      
      const response = await this.tryProxyRequest(apiUrl);
      
      if (response) {
        const data = await response.json();
        return {
          favoritesCount: data.favoritesCount || 0
        };
      }
      
      console.log('All proxies failed for getFavoritesCount, using enhanced mock data');
      return this.getEnhancedMockFavoritesData();
    } catch (error) {
      console.error('Error in getFavoritesCount:', error);
      return this.getEnhancedMockFavoritesData();
    }
  }
  
  // Enhanced mock data methods with more realistic values
  private static getEnhancedMockGameData() {
    return {
      visits: 127843,
      playing: 342,
      favorites: 28947,
      rating: 4.7,
      name: 'Atlanta High School Roleplay',
      description: 'Experience authentic high school life in Atlanta! Join as a student, teacher, or staff member. Attend classes, join clubs, participate in events, and create your own story in our immersive roleplay community.',
      created: '2023-01-15T08:00:00.000Z',
      updated: new Date().toISOString(),
      price: 0,
      maxPlayers: 60,
      creator: 'AtlantaHSDevelopment',
      genre: 'Roleplay'
    };
  }
  
  private static getEnhancedMockVoteData() {
    const upVotes = 15420;
    const downVotes = 890;
    const totalVotes = upVotes + downVotes;
    const rating = (upVotes / totalVotes) * 5;
    
    return {
      upVotes,
      downVotes,
      totalVotes,
      rating: parseFloat(rating.toFixed(1))
    };
  }
  
  private static getEnhancedMockFavoritesData() {
    return {
      favoritesCount: 28947
    };
  }
}

const WrapUp2025 = () => {
  usePerformanceMonitor('WrapUp2025');
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
  const [gameData, setGameData] = useState<any>(null);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [, setUsername] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error' | 'partial'>('loading');
  const [loadingStats, setLoadingStats] = useState(true);
  const [playerRankings, setPlayerRankings] = useState({
    fireAlarmRank: 0,
    drillRank: 0,
    attendanceRank: 0,
    socialRank: 0
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const handleUsernameSubmit = async (submittedUsername: string) => {
    setIsFetchingData(true);
    setLoadingStats(true);
    setApiStatus('loading');
    setUsername(submittedUsername);
    
    // Generate random rankings for company achievements
    const rankings = {
      fireAlarmRank: Math.floor(Math.random() * 50) + 1,
      drillRank: Math.floor(Math.random() * 100) + 1,
      attendanceRank: Math.floor(Math.random() * 200) + 1,
      socialRank: Math.floor(Math.random() * 150) + 1
    };
    setPlayerRankings(rankings);
    
    try {
      const userId = await RobloxAPI.getUserIdFromUsername(submittedUsername);
      
      if (!userId) {
        setApiStatus('error');
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
          isGroupMember: false,
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
          alarmsPulled: Math.floor(Math.random() * 3000) + 500,
          drillsCompleted: Math.floor(Math.random() * 200) + 50,
          timePlayed: Math.floor(Math.random() * 300) + 100,
          achievements: Math.floor(Math.random() * 40) + 10
        }));
        
        setShowUsernameInput(false);
        setIsFetchingData(false);
        setLoadingStats(false);
        return;
      }
      
      const playerInfo = await RobloxAPI.getPlayerData(userId);
      const gameStats = await RobloxAPI.getGameStats();
      const gameVotes = await RobloxAPI.getGameVotes();
      const favoritesCount = await RobloxAPI.getFavoritesCount();
      
      setGameData({
        ...gameStats,
        ...gameVotes,
        ...favoritesCount
      });
      
      if (playerInfo) {
        setApiStatus('success');
        setPlayerData(playerInfo);
        
        // Generate enhanced stats based on group membership and rankings
        const isGroupMember = playerInfo.isGroupMember;
        const baseMultiplier = isGroupMember ? 2.5 : 1.0;
        
        setCounters(prev => ({
          ...prev,
          friends: playerInfo.totalFriends,
          groups: playerInfo.totalGroups,
          accountAge: Math.floor((Date.now() - new Date(playerInfo.created).getTime()) / (1000 * 60 * 60 * 24 * 365)),
          alarmsPulled: Math.floor((Math.random() * 4000 + 1000) * baseMultiplier),
          drillsCompleted: Math.floor((Math.random() * 300 + 100) * baseMultiplier),
          timePlayed: Math.floor((Math.random() * 400 + 150) * baseMultiplier),
          achievements: Math.floor((Math.random() * 50 + 20) * baseMultiplier),
          robloxVisits: gameStats.visits,
          robloxPlaying: gameStats.playing,
          robloxFavorites: favoritesCount.favoritesCount,
          robloxRating: gameVotes.rating
        }));
        
        setShowUsernameInput(false);
      } else {
        setApiStatus('partial');
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
          isGroupMember: false,
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
          alarmsPulled: Math.floor(Math.random() * 3000) + 500,
          drillsCompleted: Math.floor(Math.random() * 200) + 50,
          timePlayed: Math.floor(Math.random() * 300) + 100,
          achievements: Math.floor(Math.random() * 40) + 10,
          robloxVisits: gameStats.visits,
          robloxPlaying: gameStats.playing,
          robloxFavorites: favoritesCount.favoritesCount,
          robloxRating: gameVotes.rating
        }));
        
        setShowUsernameInput(false);
      }
    } catch (error) {
      setApiStatus('error');
      console.error('API Error:', error);
      
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
        isGroupMember: false,
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
        alarmsPulled: Math.floor(Math.random() * 3000) + 500,
        drillsCompleted: Math.floor(Math.random() * 200) + 50,
        timePlayed: Math.floor(Math.random() * 300) + 100,
        achievements: Math.floor(Math.random() * 40) + 10
      }));
      
      setShowUsernameInput(false);
    } finally {
      setIsFetchingData(false);
      setTimeout(() => setLoadingStats(false), 1000);
    }
  };
  
  useEffect(() => {
    let timeoutId: number;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }, 16);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);
  
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
  
  useEffect(() => {
    document.body.classList.add('animations-enabled');
    return () => {
      document.body.classList.remove('animations-enabled');
    };
  }, []);
  
  const pages = useMemo(() => [
    <div key="page-1" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto relative z-20">
        {showUsernameInput ? (
          <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isFetchingData} />
        ) : (
          <>
            <div className="mb-12">
              {playerData && (
                <div className="bg-[#1a1a1f] rounded-xl p-4 mb-8 border border-[#6C5CE7]/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src={playerData.avatarUrl} 
                      alt={playerData.displayName} 
                      className="w-16 h-16 rounded-xl border-2 border-[#6C5CE7] shadow-lg shadow-[#6C5CE7]/20"
                    />
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold text-white">{playerData.displayName}</h3>
                      <p className="text-[#A3A3A3] text-sm">@{playerData.name}</p>
                      <div className={`text-xs px-3 py-1 rounded-full inline-block mt-2 font-medium ${
                        playerData.isGroupMember 
                          ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white shadow-lg' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {playerData.groupRank === 'Guest' ? 'Not in Group' : playerData.groupRank}
                      </div>
                      {playerData.isVerified && (
                        <div className="flex items-center gap-1 mt-1">
                          <Trophy className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-400">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
                2025 Wrapped
              </h1>
              <p className="text-xl text-center text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
                Your year in review at Atlanta High School Roleplay
              </p>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setCurrentPage(1)}
                className="px-8 py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
              >
                See Your Stats
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>,

    <div key="page-2" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            Your 2025 Stats
          </h2>
          <APIStatusIndicator status={apiStatus} />
        </div>
        
        {gameData && (
          <div className="bg-[#1a1a1f] rounded-xl p-6 mb-8 border border-[#6C5CE7]/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#6C5CE7]" />
              {gameData.name}
            </h3>
            <p className="text-[#A3A3A3] text-sm mb-4">{gameData.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Creator</div>
                <div className="text-white font-medium">{gameData.creator}</div>
              </div>
              <div>
                <div className="text-gray-400">Genre</div>
                <div className="text-white font-medium">{gameData.genre}</div>
              </div>
              <div>
                <div className="text-gray-400">Max Players</div>
                <div className="text-white font-medium">{gameData.maxPlayers}</div>
              </div>
              <div>
                <div className="text-gray-400">Price</div>
                <div className="text-white font-medium">{gameData.price === 0 ? 'Free' : `${gameData.price} Robux`}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Roblox Game Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedStatCard value={counters.robloxVisits} label="Game Visits" icon={Users} delay={0.1} trend="up" color="#6C5CE7" isLoading={loadingStats} />
            <EnhancedStatCard value={counters.robloxPlaying} label="Currently Playing" icon={Activity} delay={0.2} trend="neutral" color="#00E5FF" isLoading={loadingStats} />
            <EnhancedStatCard value={counters.robloxFavorites} label="Favorites" icon={StarIcon} delay={0.3} trend="up" color="#FFD700" isLoading={loadingStats} />
            <EnhancedStatCard value={counters.robloxRating} label="Rating" icon={Crown} delay={0.4} trend="up" color="#FF6B6B" isLoading={loadingStats} />
          </div>
        </div>
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Your Personal Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedStatCard value={counters.alarmsPulled} label="Alarms Pulled" icon={Flame} delay={1.6} trend="up" color="#FF6B6B" isLoading={loadingStats} />
            <EnhancedStatCard value={counters.drillsCompleted} label="Drills Completed" icon={Target} delay={1.8} trend="up" color="#4ECDC4" isLoading={loadingStats} />
            <EnhancedStatCard value={`${counters.timePlayed}h`} label="Time Played" icon={Clock} delay={2.0} trend="up" color="#45B7D1" isLoading={loadingStats} />
            <EnhancedStatCard value={counters.achievements} label="Achievements" icon={Award} delay={2.2} trend="up" color="#96CEB4" isLoading={loadingStats} />
          </div>
        </div>
        
        <div className="flex justify-center">
          <SimpleMiniGame score={miniGameScore} onScoreChange={setMiniGameScore} />
        </div>
      </div>
    </div>,

    <div key="page-3" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11]">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Achievement Collection
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CompanyAchievementBadge 
            icon="🔥" 
            name="Fire Alarm Master" 
            description="Pulled the most fire alarms"
            unlocked 
            rarity="legendary" 
            rank={playerRankings.fireAlarmRank}
            metric={`${counters.alarmsPulled} pulls`}
          />
          <CompanyAchievementBadge 
            icon="🚨" 
            name="Drill Champion" 
            description="Excellence in safety drills"
            unlocked 
            rarity="epic" 
            rank={playerRankings.drillRank}
            metric={`${counters.drillsCompleted} drills`}
          />
          <CompanyAchievementBadge 
            icon="📚" 
            name="Perfect Attendance" 
            description="Never missed a class"
            unlocked 
            rarity="rare" 
            rank={playerRankings.attendanceRank}
            metric={`${counters.timePlayed} hours`}
          />
          <CompanyAchievementBadge 
            icon="👑" 
            name="Social Butterfly" 
            description="Most popular student"
            unlocked={playerData?.isGroupMember || false} 
            rarity="legendary" 
            rank={playerRankings.socialRank}
            metric={`${counters.friends} friends`}
          />
          <CompanyAchievementBadge 
            icon="💎" 
            name="Diamond Member" 
            description="Premium status achieved"
            unlocked={playerData?.isGroupMember || false} 
            rarity="legendary"
            progress={playerData?.isGroupMember ? 100 : 60}
          />
          <CompanyAchievementBadge 
            icon="🏆" 
            name="Year Champion" 
            description="Top performer of 2025"
            unlocked 
            rarity="epic"
            metric={`Top ${Math.floor(counters.achievements / 10)}%`}
          />
          <CompanyAchievementBadge 
            icon="⚡" 
            name="Speed Runner" 
            description="Fastest response times"
            unlocked 
            rarity="rare"
            metric={`${Math.floor(Math.random() * 50 + 10)} sec avg`}
          />
          <CompanyAchievementBadge 
            icon="🎯" 
            name="Perfect Score" 
            description="100% accuracy rate"
            unlocked 
            rarity="epic"
            progress={90}
            metric="98.5% accuracy"
          />
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => setShowUsernameInput(true)}
            className="px-6 py-3 bg-[#6C5CE7] text-white font-semibold rounded-lg hover:bg-[#5a4bd7] transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  ], [counters, currentPage, playerData, gameData, miniGameScore, showUsernameInput, playerRankings]);

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

  const parallaxStyle = useCallback(() => {
    return {
      transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
    };
  }, [mousePosition]);

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0E0E11] text-white overflow-hidden relative" style={parallaxStyle()}>
      <ParticleSystem count={30} />
      
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

      <div className="pt-20">
        <div className="relative">
          {pages[currentPage]}
        </div>
      </div>
      
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
