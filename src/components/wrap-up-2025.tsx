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
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-xl z-50 border-b border-red-500/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Atlanta High
                </span>
              </div>
              <div className="text-sm text-gray-400 font-medium">
                2025 Year in Review
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
          
          <div className="text-center max-w-5xl mx-auto relative z-10">
            <div className="mb-12">
              <h1 className="hero-title text-6xl md:text-8xl font-black mb-8 leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  2025: A YEAR OF
                </span>
                <span className="block bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent mt-2">
                  EXPLOSIVE GROWTH
                </span>
              </h1>
              <p className="hero-subtitle text-2xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                From humble beginnings to the undisputed #1 Fire Alarm Simulation Game
              </p>
            </div>
            
            <div className="animate-bounce text-gray-500 mt-16">
              <Star className="w-6 h-6 mx-auto" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-24 px-6 relative">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              By The Numbers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="stat-card group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="text-6xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {counters.visits.toLocaleString()}+
                </div>
                <div className="text-gray-200 font-semibold mb-2 text-lg">Website Visits</div>
                <div className="text-sm text-gray-500">Massive traffic growth</div>
              </div>
              
              <div className="stat-card group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {counters.discord.toLocaleString()}+
                </div>
                <div className="text-gray-200 font-semibold mb-2 text-lg">Discord Members</div>
                <div className="text-sm text-gray-500">Thriving community</div>
              </div>
              
              <div className="stat-card group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  #{counters.ranking}
                </div>
                <div className="text-gray-200 font-semibold mb-2 text-lg">Fire Alarm Game</div>
                <div className="text-sm text-gray-500">Industry leader</div>
              </div>
              
              <div className="stat-card group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {counters.year}
                </div>
                <div className="text-gray-200 font-semibold mb-2 text-lg">Breakout Year</div>
                <div className="text-sm text-gray-500">Unprecedented success</div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section ref={achievementsRef} className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none" />
          
          <div className="container mx-auto relative z-10">
            <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Major Accomplishments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="achievement-card bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/30">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Industry Recognition
                  </h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Established ourselves as the premier fire alarm simulation game in the Roblox ecosystem
                </p>
              </div>
              
              <div className="achievement-card bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Community Growth
                  </h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Built a vibrant Discord community of over 1,250+ engaged members
                </p>
              </div>
              
              <div className="achievement-card bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Traffic Explosion
                  </h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Achieved remarkable website traffic with 50,000+ visits and counting
                </p>
              </div>
              
              <div className="achievement-card bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Technical Excellence
                  </h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Delivered cutting-edge realistic fire alarm simulation technology
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              What's Next?
            </h2>
            <p className="text-2xl text-gray-300 mb-16 leading-relaxed font-light">
              2025 was just the beginning. We're already planning bigger things for 2026 - 
              new features, enhanced realism, and continued community growth.
            </p>
            
            <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl rounded-3xl p-12 border border-red-500/30">
              <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Thank You For Being Part Of Our Journey
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To every player, community member, and supporter - you made this possible. 
                Here's to an even bigger 2026!
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-red-500/20">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Atlanta High Fire Alarm Simulation
              </span>
            </div>
            <p className="text-gray-400 font-medium">
              © 2025 Atlanta High. #1 Fire Alarm Simulation Game
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WrapUp2025;
