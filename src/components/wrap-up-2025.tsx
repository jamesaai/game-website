import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, ChevronRight, Sparkles, TrendingUp, Award, Clock, Users, Target, Flame, Activity, Crown, Star as StarIcon } from 'lucide-react';

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

// Simplified mini-game
const SimpleMiniGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete(score);
    }
  }, [isActive, timeLeft, onComplete]);
  
  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(10);
  };
  
  const handleClick = () => {
    if (isActive) {
      setScore(score + 1);
    }
  };
  
  return (
    <div className="bg-[#1a1a1f] rounded-xl p-6 text-center border border-[#6C5CE7]/20">
      <h3 className="text-xl font-bold text-white mb-4">🔥 Speed Challenge</h3>
      
      {!isActive ? (
        <button 
          onClick={startGame}
          className="px-6 py-3 bg-[#6C5CE7] text-white font-semibold rounded-lg transition-colors hover:bg-[#5a4bd7]"
        >
          {timeLeft === 0 ? 'Try Again' : 'Start Game'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-white text-sm">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          
          <button
            onClick={handleClick}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full text-white font-bold text-xl transition-colors"
          >
            🔥
          </button>
        </div>
      )}
    </div>
  );
};

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

// Simplified stat card
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
    <div className="bg-[#1a1a1f] rounded-xl p-6 border border-[#6C5CE7]/20 hover:border-[#6C5CE7]/40 transition-all duration-300">
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
          <SimpleMiniGame onComplete={(score) => setMiniGameScore(score)} />
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
    </div>
  );
};

export default WrapUp2025;
