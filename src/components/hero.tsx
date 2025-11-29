import { useEffect, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Users, Eye, Heart } from "lucide-react";

// Mock Button component
const Button = ({ children, leftIcon: Icon, containerClass, onClick, id }) => (
  <button id={id} className={containerClass} onClick={onClick}>
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// Mock Snowflakes component
const Snowflakes = () => <div className="snowflakes-container" />;

// Mock mobile detection
const useMobileDetection = () => false;

// Mock constants
const VIDEO_LINKS = {
  hero1: "https://assets.mixkit.co/videos/preview/mixkit-school-hallway-with-lockers-47308-large.mp4"
};

const LINKS = {
  robloxGame: "https://www.roblox.com",
  discord: "https://discord.com"
};

export default function ImprovedHero() {
  const isMobile = useMobileDetection();
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number | null>(null);
  const [isPlayerCountLoading, setIsPlayerCountLoading] = useState(true);
  const [isVisitCountLoading, setIsVisitCountLoading] = useState(true);

  const totalVideos = 1;

  const handlePlayNow = () => {
    window.open(LINKS.robloxGame, "_blank", "noopener,noreferrer");
  };

  const handleJoinGroup = () => {
    window.open(LINKS.discord, "_blank", "noopener,noreferrer");
  };

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const resp = await fetch("/api/roblox-players", { 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        if (!resp.ok) {
          setIsPlayerCountLoading(false);
          setIsVisitCountLoading(false);
          return;
        }

        const data: { data: Array<{ playing?: number; visits?: number; favoritedCount?: number }> } = await resp.json();
        const game = data.data?.[0];
        if (game) {
          if (typeof game.playing === "number") setPlayerCount(game.playing);
          if (typeof game.visits === "number") setTotalVisits(game.visits);
          if (typeof game.favoritedCount === "number") setFavoritesCount(game.favoritedCount);
        }
        setIsVisitCountLoading(false);
      } catch (error) {
        setIsVisitCountLoading(false);
      } finally {
        setIsPlayerCountLoading(false);
      }
    };

    void fetchPlayerCount();
  }, []);

  // Format large numbers
  const formatNumber = (num: number | null) => {
    if (num === null) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <Snowflakes />
      
      {isLoading && (
        <div className="flex items-center justify-center absolute z-[100] h-screen w-screen overflow-hidden bg-gray-900">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      <div className="relative z-10 h-screen w-screen overflow-hidden">
        {/* Background video layer */}
        <div className="absolute inset-0">
          <video
            src={VIDEO_LINKS.hero1}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 w-full h-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        
        {/* Dark overlay - lighter than before to show more video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

        {/* Foreground content */}
        <div className="relative z-40 flex h-full w-full flex-col items-center justify-center px-6">
          <div className="max-w-5xl text-center">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
              Hi, we're <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Atlanta High.</span>
            </h1>

            {/* Tagline */}
            <p className="mx-auto mt-6 max-w-2xl text-gray-300 text-lg md:text-xl leading-relaxed">
              Explore the most realistic fire alarm simulation on Roblox. Learn fire safety systems,
              run drills, and master emergency procedures in a modern high school.
            </p>

            {/* Stats Cards */}
            <div className="mt-12 grid gap-6 px-4 sm:grid-cols-3 sm:px-0 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 px-6 py-6 text-center hover:bg-black/50 transition-all duration-300">
                <div className="flex justify-center mb-3">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {isPlayerCountLoading ? "--" : playerCount ?? 0}
                </p>
                <p className="text-sm text-gray-400 font-medium">Currently Playing</p>
              </div>

              <div className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 px-6 py-6 text-center hover:bg-black/50 transition-all duration-300">
                <div className="flex justify-center mb-3">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {isVisitCountLoading ? "--" : formatNumber(totalVisits)}
                </p>
                <p className="text-sm text-gray-400 font-medium">Total Visits</p>
              </div>

              <div className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 px-6 py-6 text-center hover:bg-black/50 transition-all duration-300">
                <div className="flex justify-center mb-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {isVisitCountLoading ? "--" : formatNumber(favoritesCount)}
                </p>
                <p className="text-sm text-gray-400 font-medium">Favorites</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-6 sm:px-0">
              <Button
                id="play-now"
                leftIcon={TiLocationArrow}
                containerClass="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full flex items-center justify-center gap-2 text-base font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 w-full sm:w-auto"
                onClick={handlePlayNow}
              >
                <span>Play Now</span>
              </Button>

              <Button
                id="join-group"
                containerClass="border-2 border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-3.5 rounded-full text-base font-semibold text-white transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                onClick={handleJoinGroup}
              >
                <span>Join Group →</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}