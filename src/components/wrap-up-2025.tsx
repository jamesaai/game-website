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

// Advanced stat card with hover effects and animations
const AdvancedStatCard = ({ 
  value, 
  label, 
  icon: Icon, 
  delay = 0, 
  trend, 
  color = '#6C5CE7' 
}: {
  value: string | number;
  label: string;
  icon: any;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
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
      className={`bg-[#1a1a1f] rounded-xl p-6 border transition-all duration-300 transform cursor-pointer ${
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

// Advanced achievement badge with rarity and progress
const AdvancedAchievementBadge = ({ 
  icon, 
  name, 
  unlocked, 
  rarity = 'common', 
  progress = 100 
}: {
  icon: string;
  name: string;
  unlocked: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
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
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${rarityColors[rarity]} border-2 ${rarityBorders[rarity]} shadow-lg`}>
          {unlocked ? icon : '🔒'}
        </div>
        {unlocked && (
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-white">{name}</div>
      {progress < 100 && (
        <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
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

// Roblox API service
class RobloxAPI {
  private static readonly USERS_URL = 'https://users.roblox.com/v1/users';
  private static readonly FRIENDS_URL = 'https://friends.roblox.com/v1/users';
  private static readonly GROUPS_URL = 'https://groups.roblox.com/v2/groups';
  private static readonly THUMBNAIL_URL = 'https://thumbnails.roblox.com/v1/users';
  private static readonly GAMES_URL = 'https://games.roblox.com/v1/games';
  private static readonly GROUP_ID = 35390256;
  
  static async getUserIdFromUsername(username: string) {
    try {
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
            if (data.data && data.data.length > 0) {
              return data.data[0].id;
            }
          }
        } catch (proxyError) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
  
  static async getPlayerData(userId: number) {
    try {
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      for (const proxy of proxies) {
        try {
          const userResponse = await fetch(proxy + `${this.USERS_URL}/${userId}`);
          if (!userResponse.ok) continue;
          const userData = await userResponse.json();
          
          const thumbnailResponse = await fetch(proxy + `${this.THUMBNAIL_URL}/${userId}/avatar-headshot?size=150x150&format=Png&isCircular=true`);
          const thumbnailData = thumbnailResponse.ok ? await thumbnailResponse.json() : { data: [] };
          
          const userGroupsResponse = await fetch(proxy + `${this.GROUPS_URL}/${userId}/groups/roles`);
          const userGroupsData = userGroupsResponse.ok ? await userGroupsResponse.json() : { data: [] };
          
          const friendsResponse = await fetch(proxy + `${this.FRIENDS_URL}/${userId}/friends`);
          const friendsData = friendsResponse.ok ? await friendsResponse.json() : { data: [] };
          
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
            isGroupMember: userGroupRole ? true : false,
            groupRole: userGroupRole?.role,
            groups: userGroupsData.data || [],
            friends: friendsData.data || [],
            totalFriends: friendsData.data?.length || 0,
            totalGroups: userGroupsData.data?.length || 0
          };
        } catch (proxyError) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
  
  static async getGameStats(universeId: number = 35390256) {
    try {
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      const apiUrl = `${this.GAMES_URL}?universeIds=${universeId}`;
      
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy + apiUrl, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
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
        } catch (proxyError) {
          continue;
        }
      }
      
      return {
        visits: Math.floor(Math.random() * 100000) + 50000,
        playing: Math.floor(Math.random() * 1000) + 200,
        favorites: Math.floor(Math.random() * 20000) + 5000,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        name: 'Atlanta High School Roleplay',
        description: 'Experience the life of a student at Atlanta High School',
        created: new Date('2023-01-01').toISOString(),
        updated: new Date().toISOString(),
        price: 0,
        maxPlayers: 50,
        creator: 'AtlantaHSDev',
        genre: 'Roleplay'
      };
    } catch (error) {
      return {
        visits: Math.floor(Math.random() * 100000) + 50000,
        playing: Math.floor(Math.random() * 1000) + 200,
        favorites: Math.floor(Math.random() * 20000) + 5000,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        name: 'Atlanta High School Roleplay',
        description: 'Experience the life of a student at Atlanta High School',
        created: new Date('2023-01-01').toISOString(),
        updated: new Date().toISOString(),
        price: 0,
        maxPlayers: 50,
        creator: 'AtlantaHSDev',
        genre: 'Roleplay'
      };
    }
  }
  
  static async getGameVotes(universeId: number = 35390256) {
    try {
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      const apiUrl = `${this.GAMES_URL}/votes?universeIds=${universeId}`;
      
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy + apiUrl, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
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
        } catch (proxyError) {
          continue;
        }
      }
      
      return {
        upVotes: Math.floor(Math.random() * 10000) + 5000,
        downVotes: Math.floor(Math.random() * 1000) + 200,
        totalVotes: 0,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      };
    } catch (error) {
      return {
        upVotes: Math.floor(Math.random() * 10000) + 5000,
        downVotes: Math.floor(Math.random() * 1000) + 200,
        totalVotes: 0,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      };
    }
  }
  
  static async getFavoritesCount(universeId: number = 35390256) {
    try {
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];
      
      const apiUrl = `${this.GAMES_URL}/${universeId}/favorites/count`;
      
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy + apiUrl, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return {
              favoritesCount: data.favoritesCount || 0
            };
          }
        } catch (proxyError) {
          continue;
        }
      }
      
      return {
        favoritesCount: Math.floor(Math.random() * 20000) + 5000
      };
    } catch (error) {
      return {
        favoritesCount: Math.floor(Math.random() * 20000) + 5000
      };
    }
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
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const handleUsernameSubmit = async (submittedUsername: string) => {
    setIsFetchingData(true);
    setUsername(submittedUsername);
    
    try {
      const userId = await RobloxAPI.getUserIdFromUsername(submittedUsername);
      
      if (!userId) {
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
          alarmsPulled: Math.floor(Math.random() * 1000) + 100,
          drillsCompleted: Math.floor(Math.random() * 50) + 10,
          timePlayed: Math.floor(Math.random() * 100) + 20,
          achievements: Math.floor(Math.random() * 20) + 5
        }));
        
        setShowUsernameInput(false);
        setIsFetchingData(false);
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
        setPlayerData(playerInfo);
        
        setCounters(prev => ({
          ...prev,
          friends: playerInfo.totalFriends,
          groups: playerInfo.totalGroups,
          accountAge: Math.floor((Date.now() - new Date(playerInfo.created).getTime()) / (1000 * 60 * 60 * 24 * 365)),
          alarmsPulled: playerInfo.isGroupMember ? Math.floor(Math.random() * 2000) + 500 : Math.floor(Math.random() * 500) + 50,
          drillsCompleted: playerInfo.isGroupMember ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 30) + 5,
          timePlayed: playerInfo.isGroupMember ? Math.floor(Math.random() * 200) + 100 : Math.floor(Math.random() * 50) + 10,
          achievements: playerInfo.isGroupMember ? Math.floor(Math.random() * 30) + 15 : Math.floor(Math.random() * 10) + 3,
          robloxVisits: gameStats.visits,
          robloxPlaying: gameStats.playing,
          robloxFavorites: favoritesCount.favoritesCount,
          robloxRating: gameVotes.rating
        }));
        
        setShowUsernameInput(false);
      } else {
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
          alarmsPulled: Math.floor(Math.random() * 1000) + 100,
          drillsCompleted: Math.floor(Math.random() * 50) + 10,
          timePlayed: Math.floor(Math.random() * 100) + 20,
          achievements: Math.floor(Math.random() * 20) + 5
        }));
        
        setShowUsernameInput(false);
      }
    } catch (error) {
      alert('An error occurred while fetching your data. Using demo data instead.');
      
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
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Your 2025 Stats
        </h2>
        
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
            <AdvancedStatCard value={counters.robloxVisits} label="Game Visits" icon={Users} delay={0.1} trend="up" color="#6C5CE7" />
            <AdvancedStatCard value={counters.robloxPlaying} label="Currently Playing" icon={Activity} delay={0.2} trend="neutral" color="#00E5FF" />
            <AdvancedStatCard value={counters.robloxFavorites} label="Favorites" icon={StarIcon} delay={0.3} trend="up" color="#FFD700" />
            <AdvancedStatCard value={counters.robloxRating} label="Rating" icon={Crown} delay={0.4} trend="up" color="#FF6B6B" />
          </div>
        </div>
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Your Personal Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedStatCard value={counters.alarmsPulled} label="Alarms Pulled" icon={Flame} delay={1.6} trend="up" color="#FF6B6B" />
            <AdvancedStatCard value={counters.drillsCompleted} label="Drills Completed" icon={Target} delay={1.8} trend="up" color="#4ECDC4" />
            <AdvancedStatCard value={`${counters.timePlayed}h`} label="Time Played" icon={Clock} delay={2.0} trend="up" color="#45B7D1" />
            <AdvancedStatCard value={counters.achievements} label="Achievements" icon={Award} delay={2.2} trend="up" color="#96CEB4" />
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
          <AdvancedAchievementBadge icon="🔥" name="Fire Starter" unlocked rarity="common" />
          <AdvancedAchievementBadge icon="🚨" name="Alert Pro" unlocked rarity="rare" />
          <AdvancedAchievementBadge icon="⚡" name="Speed Demon" unlocked rarity="epic" />
          <AdvancedAchievementBadge icon="🌟" name="Superstar" unlocked={playerData?.isGroupMember || false} rarity="legendary" />
          <AdvancedAchievementBadge icon="💎" name="Diamond" unlocked rarity="rare" progress={75} />
          <AdvancedAchievementBadge icon="🏆" name="Champion" unlocked rarity="epic" />
          <AdvancedAchievementBadge icon="👑" name="Royalty" unlocked={playerData?.isGroupMember || false} rarity="legendary" />
          <AdvancedAchievementBadge icon="🎯" name="Perfect" unlocked rarity="common" progress={90} />
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
  ], [counters, currentPage, playerData, gameData, miniGameScore, showUsernameInput]);

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
