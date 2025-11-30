import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, ChevronRight, Share2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WrapUp2025 = () => {
  const [counters, setCounters] = useState({
    visits: 0,
    discord: 0,
    ranking: 0,
    year: 0
  });
  const [currentPage, setCurrentPage] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Counter animation
    const animateCounter = (target: number, key: keyof typeof counters) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 20);
    };

    // GSAP animations
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'power4.out'
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
          
          // Start counters
          animateCounter(50000, 'visits');
          animateCounter(1250, 'discord');
          animateCounter(1, 'ranking');
          animateCounter(2025, 'year');
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
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pages = [
    // Page 1: Welcome
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="hero-title text-6xl md:text-8xl font-black mb-8 leading-none bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            2025 WRAPPED
          </h1>
          <p className="hero-subtitle text-2xl md:text-3xl text-[#A3A3A3] font-light max-w-2xl mx-auto leading-relaxed">
            Your year in Atlanta High Fire Alarm Simulation
          </p>
        </div>
        
        <button 
          onClick={() => setCurrentPage(1)}
          className="group relative px-12 py-4 bg-[#6C5CE7] text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#6C5CE7]/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            START
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>,

    // Page 2: Stats
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-white">
          YOUR 2025 STATS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card group bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6C5CE7]/20 hover:scale-105">
            <div className="text-5xl md:text-6xl font-black text-[#6C5CE7] mb-4">
              {counters.visits.toLocaleString()}+
            </div>
            <div className="text-white font-bold text-lg mb-2">ALARMS PULLED</div>
            <div className="text-[#A3A3A3]">Massive dedication</div>
          </div>
          
          <div className="stat-card group bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center border border-[rgba(0,229,255,0.3)] hover:border-[#00E5FF]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00E5FF]/20 hover:scale-105">
            <div className="text-5xl md:text-6xl font-black text-[#00E5FF] mb-4">
              {counters.discord.toLocaleString()}+
            </div>
            <div className="text-white font-bold text-lg mb-2">DRILLS COMPLETED</div>
            <div className="text-[#A3A3A3]">Expert training</div>
          </div>
          
          <div className="stat-card group bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center border border-[rgba(255,107,107,0.3)] hover:border-[#FF6B6B]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF6B6B]/20 hover:scale-105">
            <div className="text-5xl md:text-6xl font-black text-[#FF6B6B] mb-4">
              42h
            </div>
            <div className="text-white font-bold text-lg mb-2">TIME PLAYED</div>
            <div className="text-[#A3A3A3]">True commitment</div>
          </div>
          
          <div className="stat-card group bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 text-center border border-[rgba(46,213,115,0.3)] hover:border-[#2ED573]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#2ED573]/20 hover:scale-105">
            <div className="text-5xl md:text-6xl font-black text-[#2ED573] mb-4">
              15
            </div>
            <div className="text-white font-bold text-lg mb-2">ACHIEVEMENTS</div>
            <div className="text-[#A3A3A3]">Elite status</div>
          </div>
        </div>
      </div>
    </div>,

    // Page 3: Achievements
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-white">
          TOP ACHIEVEMENTS
        </h2>
        
        <div className="space-y-6">
          {[
            {name: "Master Alarm Puller", desc: "Pulled 1000+ alarms", icon: "🔥", color: "#6C5CE7"},
            {name: "Drill Expert", desc: "Completed 50+ drills", icon: "🚨", color: "#00E5FF"},
            {name: "Speed Demon", desc: "Fastest evacuation time", icon: "⚡", color: "#FF6B6B"},
            {name: "Community Hero", desc: "Helped 100+ players", icon: "🌟", color: "#2ED573"}
          ].map((achievement, i) => (
            <div key={i} className="achievement-card group bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-2xl p-8 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6C5CE7]/20 hover:scale-105">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7] to-[#00E5FF] rounded-2xl flex items-center justify-center text-3xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{achievement.name}</h3>
                  <p className="text-[#A3A3A3] text-lg">{achievement.desc}</p>
                </div>
                <Trophy className="w-8 h-8 text-[#6C5CE7]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Page 4: Thank You
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-3xl p-16 border border-[rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-300">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
              THANK YOU!
            </h2>
            <p className="text-xl text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto">
              For being part of our amazing community in 2025. Your dedication makes Atlanta High the #1 fire alarm simulation game!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-3 bg-[#00E5FF] text-[#0E0E11] font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00E5FF]/50">
              <span className="relative z-10 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                SHARE RESULTS
              </span>
            </button>
            
            <button 
              onClick={() => setCurrentPage(0)}
              className="group relative px-8 py-3 bg-[rgba(255,255,255,0.1)] text-white font-semibold rounded-2xl border border-[rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.2)]"
            >
              REPLAY
            </button>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#0E0E11] text-white overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A3A3A3]">2025 WRAPPED</span>
            <span className="text-sm text-[#A3A3A3]">{currentPage + 1} / {pages.length}</span>
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] rounded-full transition-all duration-500"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-[rgba(14,14,17,0.8)] backdrop-blur-xl rounded-full px-6 py-3 border border-[rgba(255,255,255,0.1)]">
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-colors disabled:opacity-50"
          disabled={currentPage === 0}
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentPage ? 'bg-[#00E5FF] w-8' : 'bg-[rgba(255,255,255,0.3)]'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-colors disabled:opacity-50"
          disabled={currentPage === pages.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Content */}
      <div className="pt-20">
        {pages[currentPage]}
      </div>
    </div>
  );
};

export default WrapUp2025;
