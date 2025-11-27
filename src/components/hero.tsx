import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import { Button } from "./button";
import { VIDEO_LINKS, LINKS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [isPlayerCountLoading, setIsPlayerCountLoading] = useState(true);

  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const totalVideos = 4;
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVideoClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

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

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });

        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            void nextVideoRef.current?.play();
          },
        });

        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

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
        const resp = await fetch(
          "https://games.roblox.com/v1/games?universeIds=8107420919"
        );
        if (!resp.ok) {
          setIsPlayerCountLoading(false);
          return;
        }

        const data: { data: Array<{ playing: number }> } = await resp.json();
        const playing = data.data?.[0]?.playing;
        if (typeof playing === "number") {
          setPlayerCount(playing);
        }
      } catch {
        // fail silently, keep fallback UI
      } finally {
        setIsPlayerCountLoading(false);
      }
    };

    void fetchPlayerCount();
  }, []);

  return (
    <section id="hero" className="relative h-dvh w-screen overflow-x-hidden bg-black">
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
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-200/10"
      >
        {/* Background video layer */}
        <div className="absolute inset-0">
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
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

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                id="play-now"
                leftIcon={TiLocationArrow}
                containerClass="bg-red-300 text-black px-8 py-3 rounded-full flex-center gap-2 text-sm font-semibold hover:bg-red-400 transition"
              >
                <span onClick={handlePlayNow}>Play Now on Roblox</span>
              </Button>

              <Button
                id="join-group"
                containerClass="border border-white/20 bg-black/40 px-8 py-3 rounded-full text-sm font-semibold text-blue-50 hover:bg-white/10 transition"
                onClick={handleJoinGroup}
              >
                <span>Join Group</span>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="border-hsla rounded-xl bg-black/50 px-4 py-5 text-left">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Currently Playing</p>
                <p className="mt-2 text-2xl font-semibold text-blue-50">
                  {isPlayerCountLoading ? "--" : playerCount ?? 0}
                </p>
              </div>

              <div className="border-hsla rounded-xl bg-black/50 px-4 py-5 text-left">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Total Visits</p>
                <p className="mt-2 text-2xl font-semibold text-blue-50">18.0M</p>
              </div>

              <div className="border-hsla rounded-xl bg-black/50 px-4 py-5 text-left">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Favorites</p>
                <p className="mt-2 text-2xl font-semibold text-blue-50">98.2K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};