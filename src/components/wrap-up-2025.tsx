import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Users, TrendingUp, Code, Star, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WrapUp2025 = () => {
  const [counters, setCounters] = useState({
    visits: 0,
    discord: 0,
    ranking: 0,
    year: 0
  });

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

  return (
    <div ref={sectionRef} className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent" />
        
        <div className="text-center max-w-6xl mx-auto relative z-10">
          <div className="mb-16">
            <h1 className="hero-title text-7xl md:text-9xl font-black mb-8 leading-none">
              <span className="block text-white">
                2025:
              </span>
              <span className="block text-red-500">
                A YEAR OF
              </span>
              <span className="block text-orange-500">
                EXPLOSIVE GROWTH
              </span>
            </h1>
            <p className="hero-subtitle text-2xl md:text-4xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
              From humble beginnings to the undisputed #1 Fire Alarm Simulation Game
            </p>
          </div>
          
          <div className="animate-bounce text-gray-500 mt-16">
            <Star className="w-8 h-8 mx-auto" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-24 text-red-500">
            By The Numbers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="stat-card bg-red-900/20 border border-red-500/30 rounded-3xl p-12 text-center hover:bg-red-900/30 transition-all duration-300">
              <div className="text-7xl font-black text-red-500 mb-6">
                {counters.visits.toLocaleString()}+
              </div>
              <div className="text-white font-bold text-xl mb-2">Website Visits</div>
              <div className="text-gray-400">Massive traffic growth</div>
            </div>
            
            <div className="stat-card bg-blue-900/20 border border-blue-500/30 rounded-3xl p-12 text-center hover:bg-blue-900/30 transition-all duration-300">
              <div className="text-7xl font-black text-blue-500 mb-6">
                {counters.discord.toLocaleString()}+
              </div>
              <div className="text-white font-bold text-xl mb-2">Discord Members</div>
              <div className="text-gray-400">Thriving community</div>
            </div>
            
            <div className="stat-card bg-yellow-900/20 border border-yellow-500/30 rounded-3xl p-12 text-center hover:bg-yellow-900/30 transition-all duration-300">
              <div className="text-7xl font-black text-yellow-500 mb-6">
                #{counters.ranking}
              </div>
              <div className="text-white font-bold text-xl mb-2">Fire Alarm Game</div>
              <div className="text-gray-400">Industry leader</div>
            </div>
            
            <div className="stat-card bg-green-900/20 border border-green-500/30 rounded-3xl p-12 text-center hover:bg-green-900/30 transition-all duration-300">
              <div className="text-7xl font-black text-green-500 mb-6">
                {counters.year}
              </div>
              <div className="text-white font-bold text-xl mb-2">Breakout Year</div>
              <div className="text-gray-400">Unprecedented success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section ref={achievementsRef} className="py-32 px-6 bg-gradient-to-t from-red-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-24 text-red-500">
            Major Accomplishments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="achievement-card bg-red-900/20 border border-red-500/30 rounded-3xl p-12 hover:bg-red-900/30 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mr-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-yellow-400">
                  Industry Recognition
                </h3>
              </div>
              <p className="text-gray-300 text-xl leading-relaxed">
                Established ourselves as the premier fire alarm simulation game in the Roblox ecosystem
              </p>
            </div>
            
            <div className="achievement-card bg-blue-900/20 border border-blue-500/30 rounded-3xl p-12 hover:bg-blue-900/30 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-400">
                  Community Growth
                </h3>
              </div>
              <p className="text-gray-300 text-xl leading-relaxed">
                Built a vibrant Discord community of over 1,250+ engaged members
              </p>
            </div>
            
            <div className="achievement-card bg-green-900/20 border border-green-500/30 rounded-3xl p-12 hover:bg-green-900/30 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mr-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-400">
                  Traffic Explosion
                </h3>
              </div>
              <p className="text-gray-300 text-xl leading-relaxed">
                Achieved remarkable website traffic with 50,000+ visits and counting
              </p>
            </div>
            
            <div className="achievement-card bg-purple-900/20 border border-purple-500/30 rounded-3xl p-12 hover:bg-purple-900/30 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mr-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-purple-400">
                  Technical Excellence
                </h3>
              </div>
              <p className="text-gray-300 text-xl leading-relaxed">
                Delivered cutting-edge realistic fire alarm simulation technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-16 text-red-500">
            What's Next?
          </h2>
          <p className="text-3xl text-gray-300 mb-20 leading-relaxed font-light">
            2025 was just the beginning. We're already planning bigger things for 2026 - 
            new features, enhanced realism, and continued community growth.
          </p>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-3xl p-16">
            <div className="text-4xl font-bold mb-8 text-orange-400">
              Thank You For Being Part Of Our Journey
            </div>
            <p className="text-gray-300 text-xl leading-relaxed">
              To every player, community member, and supporter - you made this possible. 
              Here's to an even bigger 2026!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-red-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-6 mb-8">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-red-500">
              Atlanta High Fire Alarm Simulation
            </span>
          </div>
          <p className="text-gray-400 text-lg">
            © 2025 Atlanta High. #1 Fire Alarm Simulation Game
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WrapUp2025;
