import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Trophy, ChevronRight, Award, Clock, Users, Target, Flame, Activity, Crown, Star as StarIcon, Sparkles, Shield, TrendingUp, Gamepad2 } from 'lucide-react';

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

// Enhanced particle system with multiple types and better performance
const ParticleSystem = ({ count = 80, className = '' }: { count?: number; className?: string }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
      type: Math.random() > 0.7 ? 'glow' : 'normal',
      color: Math.random() > 0.5 ? '#6C5CE7' : '#00E5FF'
    })), [count]
  );
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === 'glow' ? 'blur-sm opacity-30' : 'opacity-20'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: particle.type === 'glow' ? `0 0 ${particle.size * 2}px ${particle.color}` : 'none'
          }}
        />
      ))}
    </div>
  );
};

// Enhanced loading spinner with better animations
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 border-4 border-[#6C5CE7]/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-[#00E5FF]/20 rounded-full"></div>
      <div className="absolute inset-2 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      <div className="absolute inset-4 border-2 border-yellow-400/30 rounded-full"></div>
      <div className="absolute inset-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      
      {/* Central glow effect */}
      <div className="absolute inset-8 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full opacity-50 animate-pulse"></div>
    </div>
    <p className="text-white text-xl font-semibold animate-pulse mb-2">{message}</p>
    <p className="text-[#A3A3A3] text-sm animate-pulse">Connecting to Roblox servers...</p>
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

// Ultra-enhanced stat card with premium animations and effects
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
      const duration = 2500;
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
      <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#6C5CE7]/20 overflow-hidden relative">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-700 rounded w-1/2"></div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
      </div>
    );
  }
  
  return (
    <div 
      className={`bg-[#1a1a1f] rounded-2xl p-8 border transition-all duration-700 transform cursor-pointer relative overflow-hidden group ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      } ${
        isHovered 
          ? 'border-[#6C5CE7] shadow-2xl shadow-[#6C5CE7]/40 scale-105' 
          : 'border-[#6C5CE7]/20 hover:border-[#6C5CE7]/40'
      }`}
      style={{ 
        transitionDelay: `${delay}s`,
        background: isHovered 
          ? `linear-gradient(135deg, #1a1a1f 0%, ${color}20 50%, ${color}10 100%)` 
          : 'linear-gradient(135deg, #1a1a1f 0%, #1a1a1f 100%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg"
            style={{ 
              backgroundColor: color,
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg">{label}</div>
            {trend && (
              <div className={`text-sm font-medium flex items-center gap-1 ${
                trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingUp className="w-4 h-4 rotate-180" /> : <div className="w-4 h-4" />}
                {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-white mb-2">
          {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        </div>
        
        {/* Progress bar for visual effect */}
        <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] h-1 rounded-full transition-all duration-1000"
            style={{ 
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${delay + 0.5}s`
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Ultra-enhanced achievement badge with premium effects
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
  
  const rarityGlow = {
    common: 'shadow-gray-500/30',
    rare: 'shadow-blue-500/40',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/60'
  };
  
  return (
    <div 
      className={`text-center transition-all duration-500 transform cursor-pointer relative ${
        !unlocked && 'opacity-50 grayscale'
      } ${isHovered ? 'scale-110 -translate-y-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      {unlocked && (
        <div 
          className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${rarityGlow[rarity]}`}
          style={{ 
            background: `linear-gradient(135deg, ${rarityColors[rarity].split(' ')[0].replace('from-', '')} 0%, ${rarityColors[rarity].split(' ')[2].replace('to-', '')} 100%)`
          }}
        />
      )}
      
      <div className={`relative mb-3`}>
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${rarityColors[rarity]} border-2 ${rarityBorders[rarity]} shadow-xl transition-all duration-500 ${
          isHovered ? 'rotate-6 scale-110' : ''
        }`}>
          {unlocked ? icon : '🔒'}
        </div>
        
        {unlocked && (
          <>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            {rank && (
              <div className="absolute -top-3 -left-3 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce">
                #{rank}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="text-sm font-bold text-white mb-1">{name}</div>
      {description && (
        <div className="text-xs text-[#A3A3A3] mb-2 px-2">{description}</div>
      )}
      {metric && unlocked && (
        <div className="text-xs font-semibold text-[#6C5CE7] mb-2 px-2 py-1 bg-[#6C5CE7]/10 rounded-full">
          {metric}
        </div>
      )}
      {progress < 100 && (
        <div className="mt-3 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Enhanced username input with premium styling
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
      <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#6C5CE7]/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/5 to-[#00E5FF]/5"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2 text-center bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            Enter Your Roblox Username
          </h2>
          <p className="text-[#A3A3A3] text-center mb-6">Discover your 2025 gaming journey</p>
          
          {isLoading ? (
            <LoadingSpinner message="Finding your profile..." />
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Gamepad2 className="w-5 h-5 text-[#6C5CE7]" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsValid(true);
                  }}
                  placeholder="Roblox username..."
                  className={`w-full pl-12 pr-4 py-4 bg-[#2a2a2f] border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] transition-all duration-300 ${
                    !isValid ? 'border-red-500' : 'border-[#6C5CE7]/30'
                  }`}
                  disabled={isLoading}
                />
                {!isValid && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Please enter a valid username
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {isLoading ? 'Loading...' : 'View My 2025 Wrapped'}
                </span>
              </button>
              
              <div className="text-center">
                <APIStatusIndicator status="loading" />
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-[#6C5CE7] rounded-full opacity-20"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#00E5FF] rounded-full opacity-20"></div>
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

// Roblox API service using backend endpoint
class RobloxAPI {
  private static readonly API_BASE = '/api';
  
  static async getWrappedData(username: string) {
    try {
      console.log(`Fetching wrapped data for: ${username}`);
      
      const response = await fetch(`${this.API_BASE}/roblox-wrapped?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching wrapped data:', error);
      throw error;
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
    
    try {
      const response = await RobloxAPI.getWrappedData(submittedUsername);
      
      if (response.success) {
        setApiStatus(response.apiStatus || 'success');
        setPlayerData(response.user);
        setGameData(response.game);
        setPlayerRankings({
          fireAlarmRank: response.stats.fireAlarmRank,
          drillRank: response.stats.drillRank,
          attendanceRank: response.stats.attendanceRank,
          socialRank: response.stats.socialRank
        });
        
        setCounters(prev => ({
          ...prev,
          friends: response.user.totalFriends,
          groups: response.user.totalGroups,
          accountAge: response.user.accountAge,
          alarmsPulled: response.stats.alarmsPulled,
          drillsCompleted: response.stats.drillsCompleted,
          timePlayed: response.stats.timePlayed,
          achievements: response.stats.achievements,
          robloxVisits: response.game.visits,
          robloxPlaying: response.game.playing,
          robloxFavorites: response.game.favorites,
          robloxRating: response.game.rating
        }));
        
        setShowUsernameInput(false);
      } else {
        // Handle API error with mock data
        setApiStatus('error');
        setPlayerData(response.user);
        setGameData(response.game);
        setPlayerRankings({
          fireAlarmRank: response.stats.fireAlarmRank,
          drillRank: response.stats.drillRank,
          attendanceRank: response.stats.attendanceRank,
          socialRank: response.stats.socialRank
        });
        
        setCounters(prev => ({
          ...prev,
          friends: response.user.totalFriends,
          groups: response.user.totalGroups,
          accountAge: response.user.accountAge,
          alarmsPulled: response.stats.alarmsPulled,
          drillsCompleted: response.stats.drillsCompleted,
          timePlayed: response.stats.timePlayed,
          achievements: response.stats.achievements,
          robloxVisits: response.game.visits,
          robloxPlaying: response.game.playing,
          robloxFavorites: response.game.favorites,
          robloxRating: response.game.rating
        }));
        
        setShowUsernameInput(false);
      }
    } catch (error) {
      console.error('Error in handleUsernameSubmit:', error);
      setApiStatus('error');
      
      // Fallback to mock data
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
        totalGroups: Math.floor(Math.random() * 5),
        accountAge: Math.floor(Math.random() * 5) + 1
      };
      
      const mockGameData = {
        visits: 127843,
        playing: 342,
        favorites: 28947,
        rating: 4.7,
        name: 'Atlanta High School Roleplay',
        description: 'Experience authentic high school life in Atlanta!',
        creator: 'AtlantaHSDevelopment',
        genre: 'Roleplay',
        maxPlayers: 60,
        price: 0
      };
      
      setPlayerData(mockPlayerData);
      setGameData(mockGameData);
      
      setCounters(prev => ({
        ...prev,
        friends: mockPlayerData.totalFriends,
        groups: mockPlayerData.totalGroups,
        accountAge: mockPlayerData.accountAge,
        alarmsPulled: Math.floor(Math.random() * 3000) + 500,
        drillsCompleted: Math.floor(Math.random() * 200) + 50,
        timePlayed: Math.floor(Math.random() * 300) + 100,
        achievements: Math.floor(Math.random() * 40) + 10,
        robloxVisits: mockGameData.visits,
        robloxPlaying: mockGameData.playing,
        robloxFavorites: mockGameData.favorites,
        robloxRating: mockGameData.rating
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
    <div key="page-1" className="min-h-screen flex items-center justify-center px-6 relative bg-[#0E0E11] overflow-hidden">
      <ParticleSystem count={100} className="opacity-30" />
      
      <div className="max-w-4xl mx-auto relative z-20">
        {showUsernameInput ? (
          <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isFetchingData} />
        ) : (
          <>
            <div className="mb-12">
              {playerData && (
                <div className="bg-[#1a1a1f] rounded-2xl p-6 mb-8 border border-[#6C5CE7]/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00E5FF]/10"></div>
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={playerData.avatarUrl} 
                        alt={playerData.displayName} 
                        className="w-20 h-20 rounded-2xl border-3 border-[#6C5CE7] shadow-xl shadow-[#6C5CE7]/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1a1a1f]"></div>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{playerData.displayName}</h3>
                      <p className="text-[#A3A3A3] text-sm mb-3">@{playerData.name}</p>
                      <div className={`text-sm px-4 py-2 rounded-full inline-block font-semibold shadow-lg ${
                        playerData.isGroupMember 
                          ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {playerData.groupRank === 'Guest' ? 'Not in Group' : playerData.groupRank}
                      </div>
                      {playerData.isVerified && (
                        <div className="flex items-center gap-2 mt-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-blue-400 font-medium">Verified User</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-12">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#6C5CE7] via-[#00E5FF] to-purple-400 bg-clip-text text-transparent animate-gradient">
                  2025 Wrapped
                </h1>
                <p className="text-2xl text-[#A3A3A3] mb-4 max-w-3xl mx-auto leading-relaxed">
                  Your incredible year in review at
                </p>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Crown className="w-6 h-6 text-[#6C5CE7]" />
                  <span className="text-2xl font-bold text-white">Atlanta High School Roleplay</span>
                  <Crown className="w-6 h-6 text-[#00E5FF]" />
                </div>
                
                {/* Quick stats preview */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#6C5CE7]">{counters.alarmsPulled.toLocaleString()}</div>
                    <div className="text-sm text-[#A3A3A3]">Fire Alarms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00E5FF]">{counters.drillsCompleted.toLocaleString()}</div>
                    <div className="text-sm text-[#A3A3A3]">Drills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{counters.timePlayed}h</div>
                    <div className="text-sm text-[#A3A3A3]">Time Played</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setCurrentPage(1)}
                className="px-12 py-5 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span className="text-lg">View Your Stats</span>
                <ChevronRight className="w-6 h-6" />
              </button>
              <p className="text-[#A3A3A3] text-sm mt-4">Press → or Space to continue</p>
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
