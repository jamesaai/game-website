import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import { Button } from "./button";
import { Snowflakes } from "./Snowflakes";
import { MobileOptimizedHero } from "./MobileOptimizedHero";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { VIDEO_LINKS, LINKS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const isMobile = useMobileDetection();
  
  // Return mobile-optimized version for mobile devices
  if (isMobile) {
    return <MobileOptimizedHero />;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [isPlayerCountLoading, setIsPlayerCountLoading] = useState(true);
  const [isVisitCountLoading, setIsVisitCountLoading] = useState(true);

  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const totalVideos = 4;
  const currentIndex = 1; // static since we removed mini preview

  const handlePlayNow = () => {
    window.open(LINKS.robloxGame, "_blank", "noopener,noreferrer");
  };

  const handleJoinGroup = () => {
    window.open(LINKS.discord, "_blank", "noopener,noreferrer");
  };

  const VIDEO_KEYS = ["hero1", "hero2", "hero3", "hero4"] as const;

  const getVideoSrc = (i: number) => {
    const key = VIDEO_KEYS[i - 1];
    return VIDEO_LINKS[key];
  };

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const resp = await fetch("/api/roblox-players");
        if (!resp.ok) {
          setIsPlayerCountLoading(false);
          return;
        }

        const data: { data: Array<{ playing?: number; visits?: number; favoritedCount?: number; favorites?: number }> } = await resp.json();
        const game = data.data?.[0];
        if (game) {
          if (typeof game.playing === "number") setPlayerCount(game.playing);
          if (typeof game.visits === "number") setTotalVisits(game.visits);
        }
        setIsVisitCountLoading(false);
      } catch {
        // fail silently, keep fallback UI
      } finally {
        setIsPlayerCountLoading(false);
      }
    };

    void fetchPlayerCount();
  }, []);

  return (
    <section className="relative h-dvh w-screen overflow-hidden">
      <Snowflakes />
      <div className="bg-black">
        {isLoading && (
          <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
            <div className="three-body">
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
          </div>
        )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-200/10 pt-16"
      >
        {/* Background video layer */}
        <div className="absolute inset-0">
          {/* Hidden preview mask - disabled for cleaner UX */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 overflow-hidden rounded-lg hidden">
            <div className="origin-center scale-50 opacity-0">
              <video
                ref={nextVideoRef}
                src={getVideoSrc(1)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          <video
            src={
              currentIndex === totalVideos - 1 ? getVideoSrc(1) : getVideoSrc(currentIndex)
            }
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        {/* Foreground content */}
        <div className="relative z-40 flex h-full w-full flex-col items-center justify-center px-6">
          <div className="max-w-5xl text-center">
            <h1 className="special-font hero-heading text-blue-100">
              Atlanta <b>H</b>igh.
            </h1>

            <p className="mx-auto mt-4 max-w-xl font-robert-regular text-blue-100/80 text-lg md:text-xl">
              Explore the most realistic fire alarm simulation on Roblox. Learn fire safety systems,
              run drills, and master emergency procedures in a modern high school.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-6 sm:px-0">
              <Button
                id="play-now"
                leftIcon={TiLocationArrow}
                containerClass="bg-gradient-to-r from-green-600 to-red-600 text-white px-6 sm:px-8 py-3 rounded-full flex-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-red-700 transition-all duration-300 w-full sm:w-auto border-2 border-green-400/30"
                onClick={handlePlayNow}
              >
                <span>🎄 Play Now on Roblox</span>
              </Button>

              <Button
                id="join-group"
                containerClass="border border-green-400/50 bg-gradient-to-r from-green-600/20 to-red-600/20 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full text-sm font-semibold text-white hover:from-green-600/30 hover:to-red-600/30 transition-all duration-300 w-full sm:w-auto"
                onClick={handleJoinGroup}
              >
                <span>🎅 Join Group</span>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 px-4 sm:grid-cols-3 sm:px-0">
              <div className="border border-green-400/30 rounded-xl bg-gradient-to-br from-red-600/30 to-green-600/30 backdrop-blur-sm px-4 py-5 text-left shadow-lg shadow-red-600/20">
                <p className="text-xs uppercase tracking-wide text-green-100/90 font-semibold">🎅 Currently Playing</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {isPlayerCountLoading ? "--" : playerCount ?? 0}
                </p>
              </div>

              <div className="border border-red-400/30 rounded-xl bg-gradient-to-br from-green-600/30 to-red-600/30 backdrop-blur-sm px-4 py-5 text-left shadow-lg shadow-green-600/20">
                <p className="text-xs uppercase tracking-wide text-red-100/90 font-semibold">🎄 Total Visits</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {isVisitCountLoading ? "--" : totalVisits ?? 0}
                </p>
              </div>

              <div className="border border-green-400/30 rounded-xl bg-gradient-to-br from-red-600/30 to-green-600/30 backdrop-blur-sm px-4 py-5 text-left shadow-lg shadow-red-600/20">
                <p className="text-xs uppercase tracking-wide text-green-100/90 font-semibold">🎁 Server Status</p>
                <p className="mt-2 text-2xl font-semibold text-green-300">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};