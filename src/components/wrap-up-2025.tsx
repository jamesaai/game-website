import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, ChevronRight, Share2, Sparkles, TrendingUp, Award, Clock, Users, Target, Flame, Activity, Gamepad2, Crown, Star as StarIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Roblox API service
class RobloxAPI {
  private static readonly USERS_URL = 'https://users.roblox.com/v1/users';
  private static readonly FRIENDS_URL = 'https://friends.roblox.com/v1/users';
  private static readonly GROUPS_URL = 'https://groups.roblox.com/v2/groups';
  private static readonly THUMBNAIL_URL = 'https://thumbnails.roblox.com/v1/users';
  private static readonly GROUP_ID = 35390256;
  
  static async getUserIdFromUsername(username: string) {
    try {
      const response = await fetch(`${this.USERS_URL}/get-by-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Failed to get user ID from username:', error);
      return null;
    }
  }
  
  static async getPlayerData(userId: number) {
    try {
      // Get user info
      const userResponse = await fetch(`${this.USERS_URL}/${userId}`);
      const userData = await userResponse.json();
      
      // Get user's avatar thumbnails
      const thumbnailResponse = await fetch(`${this.THUMBNAIL_URL}/${userId}/avatar-headshot?size=150x150&format=Png&isCircular=true`);
      const thumbnailData = await thumbnailResponse.json();
      
      // Get user's groups
      const userGroupsResponse = await fetch(`${this.GROUPS_URL}/${userId}/groups/roles`);
      const userGroupsData = await userGroupsResponse.json();
      
      // Get friends
      const friendsResponse = await fetch(`${this.FRIENDS_URL}/${userId}/friends`);
      const friendsData = await friendsResponse.json();
      
      // Check if user is in our specific group
      const groupMembershipResponse = await fetch(`${this.GROUPS_URL}/${this.GROUP_ID}/memberships?userId=${userId}`);
      const groupMembershipData = await groupMembershipResponse.json();
      
      // Find the user's role in our group
      const userGroupRole = groupMembershipData.data?.find((membership: any) => membership.user?.userId === userId);
      
      return {
        id: userData.id,
        name: userData.name,
        displayName: userData.displayName,
        description: userData.description,
        created: userData.created,
        isVerified: userData.isVerified,
        isDeleted: userData.isDeleted,
        externalAppDisplayName: userData.externalAppDisplayName,
        avatarUrl: thumbnailData.data?.[0]?.imageUrl || `https://tr.rbxcdn.com/${Math.random().toString(36).substring(7)}/150/150/Image`,
        groupRank: userGroupRole?.role?.name || 'Guest',
        groupRole: userGroupRole?.role,
        groups: userGroupsData.data || [],
        friends: friendsData.data || [],
        totalFriends: friendsData.data?.length || 0,
        totalGroups: userGroupsData.data?.length || 0
      };
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

// Username input component - simplified
const UsernameInput = ({ onSubmit, isLoading }: { onSubmit: (username: string) => void; isLoading: boolean }) => {
  const [username, setUsername] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };
  
  return (
    <div className="bg-[#1a1a1f] rounded-2xl p-8 max-w-md mx-auto border border-[#6C5CE7]/30">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#6C5CE7] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
          👤
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Enter Roblox Username</h2>
        <p className="text-[#A3A3A3] text-sm">Get your personalized 2025 wrapped</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-3 bg-[#2a2a2f] border border-[#3a3a3f] rounded-lg text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#6C5CE7] transition-colors"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!username.trim() || isLoading}
          className="w-full py-3 bg-[#6C5CE7] text-white font-semibold rounded-lg transition-colors hover:bg-[#5a4bd7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Get Wrapped'}
        </button>
      </form>
    </div>
  );
};
const MiniGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete(score);
    }
  }, [isActive, timeLeft, onComplete]);
  
  const handleClick = () => {
    if (isActive) {
      setScore(score + 1);
      setTargetPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }
  };
  
  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(10);
  };
  
  return (
    <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">🔥 Alarm Speed Challenge 🔥</h3>
      <p className="text-[#A3A3A3] mb-6 text-sm">Click the alarm as fast as you can!</p>
      
      {!isActive ? (
        <button 
          onClick={startGame}
          className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-xl hover:scale-105 transition-transform"
        >
          {timeLeft === 0 ? 'Try Again' : 'Start Game'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-white text-sm">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          
          <div className="relative h-64 bg-[rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
            <div
              className="absolute w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white font-bold"
              style={{
                left: `${targetPosition.x}%`,
                top: `${targetPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={handleClick}
            >
              🔥
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Achievement badge component
const AchievementBadge = ({ icon, name, unlocked, rarity }: {
  icon: string;
  name: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };
  
  return (
    <div className={`relative group ${!unlocked && 'opacity-50'}`}>
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rarityColors[rarity]} flex items-center justify-center text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 cursor-pointer`}>
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        {unlocked && <StarIcon className="w-4 h-4 text-white" />}
      </div>
      <p className="text-xs text-white mt-2 text-center font-medium">{name}</p>
    </div>
  );
};

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  
  useEffect(() => {
    const monitor = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime);
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        // Log performance in development
        if (typeof window !== 'undefined' && (window as any).__DEV__) {
          console.log(`FPS: ${fps}`);
        }
      }
      
      requestAnimationFrame(monitor);
    };
    
    const animationId = requestAnimationFrame(monitor);
    return () => cancelAnimationFrame(animationId);
  }, []);
};

// Particle system component - optimized
const ParticleSystem = ({ count = 20 }: { count?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing particles
    particlesRef.current.forEach(particle => particle.remove());
    particlesRef.current = [];
    
    Array.from({ length: count }, () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: linear-gradient(135deg, #6C5CE7, #00E5FF);
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.3 + 0.2};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        will-change: transform, opacity;
      `;
      containerRef.current!.appendChild(particle);
      particlesRef.current.push(particle);
      
      // Simplified animation
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        opacity: 0,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        delay: Math.random() * 1,
        ease: 'power1.out'
      });
      
      return particle;
    });
    
    return () => {
      particlesRef.current.forEach(particle => particle.remove());
      particlesRef.current = [];
    };
  }, [count]);
  
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10" />;
};

// Advanced stat card with real-time animation
const AdvancedStatCard = ({ 
  value, 
  label, 
  description, 
  icon: Icon, 
  delay = 0,
  trend,
  funFact
}: {
  value: string | number;
  label: string;
  description: string;
  icon: any;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
  funFact?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Staggered entrance animation
    gsap.fromTo(cardRef.current,
      { 
        scale: 0.8, 
        opacity: 0, 
        rotationY: -45,
        transformPerspective: 1000
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 1.2,
        delay,
        ease: 'back.out(1.7)'
      }
    );
    
    // Animate counter
    const targetValue = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const duration = 2000;
    const startTime = performance.now();
    
    const animateCounter = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(targetValue * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };
    
    setTimeout(() => animateCounter(), delay * 1000);
  }, [value, delay]);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Hover effects
    if (isHovered) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(cardRef.current, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isHovered]);
  
  const formattedValue = typeof value === 'string' && value.includes('+') 
    ? `${displayValue.toLocaleString()}+` 
    : displayValue.toLocaleString();
  
  return (
    <div 
      ref={cardRef}
      className="group relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-6 text-center border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowFunFact(!showFunFact)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(108,92,231,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
      
      {/* Trend indicator */}
      {trend && (
        <div className="absolute top-2 right-2">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
          {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
        </div>
      )}
      
      {/* Icon with animation */}
      <div className="relative mb-3">
        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
        )}
      </div>
      
      {/* Animated value */}
      <div className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
        {formattedValue}
      </div>
      
      <div className="text-white font-bold text-sm mb-1">{label}</div>
      <div className="text-[#A3A3A3] text-xs">{description}</div>
      
      {/* Fun fact tooltip */}
      {funFact && showFunFact && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-[#0E0E11] border border-[#6C5CE7]/50 rounded-lg text-xs text-white whitespace-nowrap z-10">
          {funFact}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-[#0E0E11] border-r border-b border-[#6C5CE7]/50 transform rotate-45" />
        </div>
      )}
      
      {/* Floating particles on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full animate-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Advanced achievement card with progress bars
const AdvancedAchievementCard = ({ 
  achievement, 
  index 
}: {
  achievement: {
    name: string;
    description: string;
    icon: string;
    color: string;
    progress?: number;
    unlocked?: boolean;
    reward?: string;
  };
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Entrance animation with stagger
    gsap.fromTo(cardRef.current,
      { 
        x: -100, 
        opacity: 0,
        rotationY: -30,
        transformPerspective: 1000
      },
      {
        x: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1,
        delay: index * 0.2,
        ease: 'power3.out'
      }
    );
    
    // Animate progress bar
    if (achievement.progress) {
      setTimeout(() => {
        setProgress(achievement.progress || 0);
      }, 500 + index * 200);
    }
  }, [achievement, index]);
  
  return (
    <div 
      ref={cardRef}
      className="group relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-6 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(108,92,231,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-xl flex items-center justify-center text-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            {achievement.icon}
          </div>
          {achievement.unlocked && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 transform transition-transform duration-300 group-hover:translate-x-2">
            {achievement.name}
          </h3>
          <p className="text-[#A3A3A3] text-sm mb-3">{achievement.description}</p>
          
          {/* Progress bar */}
          {achievement.progress !== undefined && (
            <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2 overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {/* Reward */}
          {achievement.reward && (
            <div className="text-xs text-[#00E5FF] font-medium">
              🎁 {achievement.reward}
            </div>
          )}
        </div>
        
        {/* Floating elements */}
        <div className="relative">
          <Trophy className="w-6 h-6 text-[#6C5CE7] transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
          {isHovered && (
            <div className="absolute -inset-2 bg-[#6C5CE7] rounded-full opacity-20 blur-xl animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

const WrapUp2025 = () => {
  usePerformanceMonitor();
  
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  
  // Handle username submission
  const handleUsernameSubmit = async (submittedUsername: string) => {
    setIsFetchingData(true);
    setUsername(submittedUsername);
    
    try {
      // Get user ID from username
      const userId = await RobloxAPI.getUserIdFromUsername(submittedUsername);
      
      if (!userId) {
        alert('User not found! Please check your username.');
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
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error fetching user data. Please try again.');
    } finally {
      setIsFetchingData(false);
    }
  };
  
  // Fetch Roblox data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameStats = await RobloxAPI.getGameStats();
        if (gameStats) {
          setGameData(gameStats);
          setCounters(prev => ({
            ...prev,
            robloxVisits: gameStats.visits,
            robloxPlaying: gameStats.playing,
            robloxFavorites: gameStats.favorites,
            robloxRating: gameStats.rating
          }));
        }
        
        // Mock player data for demo
        const playerStats = await RobloxAPI.getPlayerStats();
        if (playerStats) {
          setPlayerData(playerStats);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);
  
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
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Advanced counter animation with easing
  const animateCounter = useCallback((target: number, key: keyof typeof counters, duration = 2000) => {
    const startTime = performance.now();
    
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Advanced easing function
      const easeOutElastic = (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      };
      
      const currentValue = Math.floor(target * easeOutElastic(progress));
      
      setCounters(prev => ({ ...prev, [key]: currentValue }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);
  
  // GSAP animations with ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation with stagger
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'power4.out'
      });
      
      // Floating animation for elements
      gsap.to('.floating', {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.5
      });
      
      // Stats scroll animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.stat-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
          });
          
          // Start counters with stagger
          animateCounter(counters.robloxVisits || 45234, 'visits');
          setTimeout(() => animateCounter(1250, 'discord'), 200);
          setTimeout(() => animateCounter(1, 'ranking'), 400);
          setTimeout(() => animateCounter(2025, 'year'), 600);
          setTimeout(() => animateCounter(1247, 'alarmsPulled'), 800);
          setTimeout(() => animateCounter(89, 'drillsCompleted'), 1000);
          setTimeout(() => animateCounter(42, 'timePlayed'), 1200);
          setTimeout(() => animateCounter(15, 'achievements'), 1400);
          setTimeout(() => animateCounter(counters.robloxPlaying || 127, 'robloxPlaying'), 1600);
          setTimeout(() => animateCounter(counters.robloxFavorites || 8921, 'robloxFavorites'), 1800);
        }
      });
      
      // Achievements animation
      ScrollTrigger.create({
        trigger: achievementsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.achievement-card', {
            scale: 0.8,
            opacity: 0,
            rotationY: -45,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            transformPerspective: 1000
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [animateCounter, counters.robloxVisits, counters.robloxPlaying, counters.robloxFavorites]);
  
  // Memoized pages for performance
  const pages = useMemo(() => [
    // Page 1: Welcome with username input
    <div key="page-1" className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={20} />
      
      <div className="text-center max-w-4xl mx-auto relative z-20">
        {showUsernameInput ? (
          <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isFetchingData} />
        ) : (
          <>
            <div className="mb-16">
              {/* User Profile Card */}
              {playerData && (
                <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-6 mb-8 border border-[rgba(108,92,231,0.3)]">
                  <div className="flex items-center gap-4">
                    <img 
                      src={playerData.avatarUrl} 
                      alt={playerData.displayName} 
                      className="w-16 h-16 rounded-full border-2 border-[#6C5CE7]"
                    />
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{playerData.displayName}</h3>
                      <p className="text-[#A3A3A3] text-sm">@{playerData.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-[#6C5CE7]/20 text-[#6C5CE7] rounded-full">
                          {playerData.groupRank}
                        </span>
                        {playerData.isVerified && (
                          <span className="text-blue-500 text-xs">✓ Verified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <h1 className="hero-title text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-none bg-gradient-to-r from-[#6C5CE7] via-[#00E5FF] to-[#6C5CE7] bg-clip-text text-transparent bg-size-200 animate-gradient">
                {username ? `${username}'s 2025 WRAPPED` : '2025 WRAPPED'}
              </h1>
              
              <div className="relative inline-block">
                <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-[#A3A3A3] font-light max-w-2xl mx-auto leading-relaxed floating">
                  Your year in Atlanta High Fire Alarm Simulation
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] opacity-20 blur-xl -z-10" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentPage(1)}
                className="group relative px-12 py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#6C5CE7]/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  START EXPERIENCE
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#6C5CE7] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => {
                  setShowUsernameInput(true);
                  setUsername('');
                  setPlayerData(null);
                }}
                className="px-6 py-3 bg-[rgba(255,255,255,0.1)] text-white font-medium rounded-xl border border-[rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.2)]"
              >
                Change User
              </button>
            </div>
          </>
        )}
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-full opacity-20 blur-xl animate-pulse floating" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#00E5FF] to-[#6C5CE7] rounded-full opacity-20 blur-xl animate-pulse floating" style={{ animationDelay: '1s' }} />
      </div>
    </div>,

    // Page 2: Enhanced Stats with Roblox API data
    <div key="page-2" className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={15} />
      
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 text-white floating">
          <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            YOUR 2025 STATS
          </span>
        </h2>
        
        {/* Roblox Game Stats */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#00E5FF]" />
            Roblox Game Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedStatCard
              value={counters.robloxVisits}
              label="TOTAL VISITS"
              description="Players who joined"
              icon={Users}
              delay={0}
              trend="up"
              funFact="That's like filling a stadium 450 times!"
            />
            
            <AdvancedStatCard
              value={counters.robloxPlaying}
              label="PLAYING NOW"
              description="Currently online"
              icon={Activity}
              delay={0.2}
              trend="neutral"
              funFact="Peak hours: 3-5 PM EST"
            />
            
            <AdvancedStatCard
              value={counters.robloxFavorites}
              label="FAVORITES"
              description="Players who love it"
              icon={StarIcon}
              delay={0.4}
              trend="up"
              funFact="97% positive rating!"
            />
            
            <AdvancedStatCard
              value={counters.robloxRating}
              label="RATING"
              description="Community score"
              icon={Trophy}
              delay={0.6}
              trend="up"
              funFact="Top 1% in simulation games!"
            />
          </div>
        </div>
        
        {/* Personal Stats */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#6C5CE7]" />
            Your Roblox Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedStatCard
              value={counters.friends}
              label="FRIENDS"
              description="Roblox friends"
              icon={Users}
              delay={0.8}
              trend="up"
              funFact="Social butterfly!"
            />
            
            <AdvancedStatCard
              value={counters.groups}
              label="GROUPS"
              description="Roblox groups"
              icon={Crown}
              delay={1.0}
              trend="up"
              funFact="Community leader!"
            />
            
            <AdvancedStatCard
              value={counters.accountAge}
              label="ACCOUNT AGE"
              description="Years on Roblox"
              icon={Clock}
              delay={1.2}
              trend="up"
              funFact="Veteran player!"
            />
            
            <AdvancedStatCard
              value={playerData?.isVerified ? "Yes" : "No"}
              label="VERIFIED"
              description="Roblox verified"
              icon={StarIcon}
              delay={1.4}
              trend={playerData?.isVerified ? "up" : "neutral"}
              funFact={playerData?.isVerified ? "Elite status!" : "Keep building!"}
            />
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#6C5CE7]" />
            Your Game Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedStatCard
              value={counters.alarmsPulled}
              label="ALARMS PULLED"
              description="Massive dedication"
              icon={Flame}
              delay={1.6}
              trend="up"
              funFact="You're in the top 5%!"
            />
            
            <AdvancedStatCard
              value={counters.drillsCompleted}
              label="DRILLS COMPLETED"
              description="Expert training"
              icon={Target}
              delay={1.8}
              trend="up"
              funFact="Perfect score 23 times!"
            />
            
            <AdvancedStatCard
              value={`${counters.timePlayed}h`}
              label="TIME PLAYED"
              description="True commitment"
              icon={Clock}
              delay={2.0}
              trend="up"
              funFact="That's 2 full days!"
            />
            
            <AdvancedStatCard
              value={counters.achievements}
              label="ACHIEVEMENTS"
              description="Elite status"
              icon={Award}
              delay={2.2}
              trend="up"
              funFact="3 legendary unlocks!"
            />
          </div>
        </div>
        
        {/* Fun Mini Game */}
        <MiniGame onComplete={(score) => setMiniGameScore(score)} />
      </div>
    </div>,

    // Page 3: Enhanced Achievements with progress tracking
    <div key="page-3" className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={15} />
      
      <div className="max-w-5xl mx-auto w-full relative z-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 text-white floating">
          <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            ACHIEVEMENT COLLECTION
          </span>
        </h2>
        
        {/* Achievement Badges Grid */}
        <div className="mb-12">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-6">Your Badge Collection</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-12">
            <AchievementBadge icon="🔥" name="Fire Starter" unlocked rarity="common" />
            <AchievementBadge icon="🚨" name="Alert Pro" unlocked rarity="rare" />
            <AchievementBadge icon="⚡" name="Speed Demon" unlocked rarity="epic" />
            <AchievementBadge icon="🌟" name="Superstar" unlocked={false} rarity="legendary" />
            <AchievementBadge icon="💎" name="Diamond" unlocked rarity="epic" />
            <AchievementBadge icon="🏆" name="Champion" unlocked rarity="rare" />
            <AchievementBadge icon="👑" name="Royalty" unlocked={false} rarity="legendary" />
            <AchievementBadge icon="🎯" name="Perfect" unlocked rarity="common" />
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            {
              name: "Master Alarm Puller",
              description: "Pulled 1000+ alarms with perfect timing",
              icon: "🔥",
              color: "#6C5CE7",
              progress: 100,
              unlocked: true,
              reward: "Exclusive Fire Master Badge"
            },
            {
              name: "Drill Expert",
              description: "Completed 50+ emergency drills",
              icon: "🚨",
              color: "#00E5FF",
              progress: 89,
              unlocked: true,
              reward: "500 Robux"
            },
            {
              name: "Speed Demon",
              description: "Fastest evacuation time recorded",
              icon: "⚡",
              color: "#FF6B6B",
              progress: 100,
              unlocked: true,
              reward: "Speed Demon Title"
            },
            {
              name: "Community Hero",
              description: "Helped 100+ players during drills",
              icon: "🌟",
              color: "#2ED573",
              progress: 75,
              unlocked: false,
              reward: "Hero Badge + 200 Robux"
            },
            {
              name: "Perfect Record",
              description: "100% success rate in all scenarios",
              icon: "💎",
              color: "#6C5CE7",
              progress: 95,
              unlocked: false,
              reward: "Perfectionist Badge"
            },
            {
              name: "Night Owl",
              description: "Completed 20+ night drills",
              icon: "🦉",
              color: "#00E5FF",
              progress: 60,
              unlocked: false,
              reward: "Night Owl Title"
            },
            {
              name: "Veteran Player",
              description: "Played for over 100 hours",
              icon: "🎖️",
              color: "#FF6B6B",
              progress: 42,
              unlocked: false,
              reward: "Veteran Status"
            },
            {
              name: "Social Butterfly",
              description: "Made 50+ friends in-game",
              icon: "🦋",
              color: "#2ED573",
              progress: 88,
              unlocked: true,
              reward: "Friend Master Badge"
            }
          ].map((achievement, i) => (
            <AdvancedAchievementCard
              key={i}
              achievement={achievement}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>,

    // Page 4: Enhanced Thank You with social sharing
    <div key="page-4" className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={20} />
      
      <div className="max-w-4xl mx-auto w-full relative z-20">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-3xl p-16 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00E5FF]/10 opacity-50" />
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-[#6C5CE7] via-[#00E5FF] to-[#6C5CE7] bg-clip-text text-transparent bg-size-200 animate-gradient">
              THANK YOU!
            </h2>
            
            <div className="relative inline-block mb-8">
              <p className="text-base md:text-lg text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto">
                For being part of our amazing community in 2025. Your dedication makes Atlanta High the #1 fire alarm simulation game!
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] opacity-10 blur-xl -z-10" />
            </div>
            
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="text-center">
                <div className="text-2xl font-black text-[#6C5CE7] mb-1">{counters.robloxVisits.toLocaleString()}</div>
                <div className="text-xs text-[#A3A3A3]">Total Visits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#00E5FF] mb-1">{counters.robloxFavorites.toLocaleString()}</div>
                <div className="text-xs text-[#A3A3A3]">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#FF6B6B] mb-1">{counters.timePlayed}h</div>
                <div className="text-xs text-[#A3A3A3]">Hours Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#2ED573] mb-1">{counters.achievements}</div>
                <div className="text-xs text-[#A3A3A3]">Achievements</div>
              </div>
            </div>
            
            {/* Mini game score */}
            {miniGameScore > 0 && (
              <div className="mb-8 p-4 bg-[rgba(108,92,231,0.1)] rounded-xl">
                <p className="text-[#00E5FF] font-bold">
                  🎮 Mini Game High Score: {miniGameScore} clicks!
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#6C5CE7] text-[#0E0E11] font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00E5FF]/50 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                SHARE RESULTS
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => setCurrentPage(0)}
              className="group relative px-8 py-4 bg-[rgba(255,255,255,0.1)] text-white font-semibold rounded-2xl border border-[rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                REPLAY
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>
          
          {/* Floating hearts animation */}
          <div className="absolute top-10 right-10 text-2xl animate-bounce floating" style={{ animationDelay: '0s' }}>❤️</div>
          <div className="absolute bottom-10 left-10 text-2xl animate-bounce floating" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute top-1/2 right-20 text-2xl animate-bounce floating" style={{ animationDelay: '1s' }}>🎉</div>
        </div>
      </div>
    </div>
  ], [counters, currentPage, animateCounter, gameData, playerData, miniGameScore]);
  
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
  }, [pages.length]);
  
  // Parallax effect based on mouse position - throttled
  const parallaxStyle = useMemo(() => ({
    transform: `translate(${Math.round(mousePosition.x * 0.005)}px, ${Math.round(mousePosition.y * 0.005)}px)`
  }), [mousePosition]);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0E0E11] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A3A3A3] text-lg">Loading your 2025 experience...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0E0E11] text-white overflow-hidden" style={parallaxStyle}>
      {/* Enhanced Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A3A3A3] font-medium">2025 WRAPPED</span>
            <span className="text-sm text-[#A3A3A3] font-medium">{currentPage + 1} / {pages.length}</span>
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl rounded-full px-6 py-3 border border-[rgba(255,255,255,0.1)]">
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
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
                  : 'w-2 h-2 bg-[rgba(255,255,255,0.3)] rounded-full hover:bg-[rgba(255,255,255,0.5)] hover:scale-125'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
          disabled={currentPage === pages.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Content with enhanced transitions */}
      <div className="pt-20">
        <div className="relative">
          {pages[currentPage]}
        </div>
      </div>
      
      {/* Custom styles for animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default WrapUp2025;
