import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, ChevronRight, Share2, Sparkles, TrendingUp, Award, Clock, Users, Target, Flame, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

// Particle system component
const ParticleSystem = ({ count = 50 }: { count?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const particles = Array.from({ length: count }, () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: linear-gradient(135deg, #6C5CE7, #00E5FF);
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.3};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      containerRef.current!.appendChild(particle);
      
      // Animate particle
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: 'power2.out'
      });
      
      return particle;
    });
    
    return () => {
      particles.forEach(particle => particle.remove());
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
  delay = 0 
}: {
  value: string | number;
  label: string;
  description: string;
  icon: any;
  delay?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
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
      className="group relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(108,92,231,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
      
      {/* Icon with animation */}
      <div className="relative mb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        )}
      </div>
      
      {/* Animated value */}
      <div className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
        {formattedValue}
      </div>
      
      <div className="text-white font-bold text-lg mb-2">{label}</div>
      <div className="text-[#A3A3A3] text-sm">{description}</div>
      
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
      className="group relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(108,92,231,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-6 relative z-10">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-2xl flex items-center justify-center text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            {achievement.icon}
          </div>
          {achievement.unlocked && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform duration-300 group-hover:translate-x-2">
            {achievement.name}
          </h3>
          <p className="text-[#A3A3A3] text-lg mb-4">{achievement.description}</p>
          
          {/* Progress bar */}
          {achievement.progress !== undefined && (
            <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Floating elements */}
        <div className="relative">
          <Trophy className="w-8 h-8 text-[#6C5CE7] transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
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
    achievements: 0
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          animateCounter(50000, 'visits');
          setTimeout(() => animateCounter(1250, 'discord'), 200);
          setTimeout(() => animateCounter(1, 'ranking'), 400);
          setTimeout(() => animateCounter(2025, 'year'), 600);
          setTimeout(() => animateCounter(1247, 'alarmsPulled'), 800);
          setTimeout(() => animateCounter(89, 'drillsCompleted'), 1000);
          setTimeout(() => animateCounter(42, 'timePlayed'), 1200);
          setTimeout(() => animateCounter(15, 'achievements'), 1400);
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
  }, [animateCounter]);
  
  // Memoized pages for performance
  const pages = useMemo(() => [
    // Page 1: Welcome with enhanced effects
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={30} />
      
      <div className="text-center max-w-4xl mx-auto relative z-20">
        <div className="mb-16">
          <h1 className="hero-title text-6xl md:text-9xl font-black mb-8 leading-none bg-gradient-to-r from-[#6C5CE7] via-[#00E5FF] to-[#6C5CE7] bg-clip-text text-transparent bg-size-200 animate-gradient">
            2025 WRAPPED
          </h1>
          
          <div className="relative inline-block">
            <p className="hero-subtitle text-2xl md:text-4xl text-[#A3A3A3] font-light max-w-2xl mx-auto leading-relaxed floating">
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
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-full opacity-20 blur-xl animate-pulse floating" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#00E5FF] to-[#6C5CE7] rounded-full opacity-20 blur-xl animate-pulse floating" style={{ animationDelay: '1s' }} />
      </div>
    </div>,

    // Page 2: Enhanced Stats with real-time animations
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={20} />
      
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white floating">
          <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            YOUR 2025 STATS
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AdvancedStatCard
            value={counters.visits}
            label="ALARMS PULLED"
            description="Massive dedication"
            icon={Flame}
            delay={0}
          />
          
          <AdvancedStatCard
            value={counters.discord}
            label="DRILLS COMPLETED"
            description="Expert training"
            icon={Target}
            delay={0.2}
          />
          
          <AdvancedStatCard
            value={`${counters.timePlayed}h`}
            label="TIME PLAYED"
            description="True commitment"
            icon={Clock}
            delay={0.4}
          />
          
          <AdvancedStatCard
            value={counters.achievements}
            label="ACHIEVEMENTS"
            description="Elite status"
            icon={Award}
            delay={0.6}
          />
        </div>
        
        {/* Additional stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <AdvancedStatCard
            value={counters.alarmsPulled}
            label="TOTAL VISITS"
            description="Community growth"
            icon={Users}
            delay={0.8}
          />
          
          <AdvancedStatCard
            value={counters.drillsCompleted}
            label="SUCCESS RATE"
            description="Perfect execution"
            icon={TrendingUp}
            delay={1.0}
          />
          
          <AdvancedStatCard
            value="98%"
            label="ACCURACY"
            description="Precision skills"
            icon={Target}
            delay={1.2}
          />
        </div>
      </div>
    </div>,

    // Page 3: Enhanced Achievements with progress tracking
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={25} />
      
      <div className="max-w-5xl mx-auto w-full relative z-20">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white floating">
          <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            TOP ACHIEVEMENTS
          </span>
        </h2>
        
        <div className="space-y-6">
          {[
            {
              name: "Master Alarm Puller",
              description: "Pulled 1000+ alarms with perfect timing",
              icon: "🔥",
              color: "#6C5CE7",
              progress: 100,
              unlocked: true
            },
            {
              name: "Drill Expert",
              description: "Completed 50+ emergency drills",
              icon: "🚨",
              color: "#00E5FF",
              progress: 89,
              unlocked: true
            },
            {
              name: "Speed Demon",
              description: "Fastest evacuation time recorded",
              icon: "⚡",
              color: "#FF6B6B",
              progress: 100,
              unlocked: true
            },
            {
              name: "Community Hero",
              description: "Helped 100+ players during drills",
              icon: "🌟",
              color: "#2ED573",
              progress: 75,
              unlocked: false
            },
            {
              name: "Perfect Record",
              description: "100% success rate in all scenarios",
              icon: "💎",
              color: "#6C5CE7",
              progress: 95,
              unlocked: false
            },
            {
              name: "Night Owl",
              description: "Completed 20+ night drills",
              icon: "🦉",
              color: "#00E5FF",
              progress: 60,
              unlocked: false
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
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <ParticleSystem count={40} />
      
      <div className="max-w-4xl mx-auto w-full relative z-20">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-3xl p-16 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00E5FF]/10 opacity-50" />
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#6C5CE7] via-[#00E5FF] to-[#6C5CE7] bg-clip-text text-transparent bg-size-200 animate-gradient">
              THANK YOU!
            </h2>
            
            <div className="relative inline-block mb-8">
              <p className="text-xl text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto">
                For being part of our amazing community in 2025. Your dedication makes Atlanta High the #1 fire alarm simulation game!
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] opacity-10 blur-xl -z-10" />
            </div>
            
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="text-center">
                <div className="text-3xl font-black text-[#6C5CE7] mb-1">{counters.visits.toLocaleString()}</div>
                <div className="text-sm text-[#A3A3A3]">Total Actions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#00E5FF] mb-1">{counters.discord.toLocaleString()}</div>
                <div className="text-sm text-[#A3A3A3]">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF6B6B] mb-1">{counters.timePlayed}h</div>
                <div className="text-sm text-[#A3A3A3]">Hours Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#2ED573] mb-1">{counters.achievements}</div>
                <div className="text-sm text-[#A3A3A3]">Achievements</div>
              </div>
            </div>
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
  ], [counters, currentPage, animateCounter]);
  
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
  
  // Parallax effect based on mouse position
  const parallaxStyle = useMemo(() => ({
    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
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
