import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiRoblox } from "react-icons/si";
import { TiLocationArrow } from "react-icons/ti";
import { useWindowScroll } from "react-use";

import { LINKS, NAV_ITEMS, EXTERNAL_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

import { Button } from "./button";

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const { y: currentScrollY } = useWindowScroll();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const handlePlayGame = () => {
    window.open(LINKS.robloxGame, "_blank", "noopener,noreferrer");
  };

  // Play / pause audio
  useEffect(() => {
    if (isAudioPlaying) void audioElementRef.current?.play();
    else audioElementRef.current?.pause();
  }, [isAudioPlaying]);

  // Navbar show/hide on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // GSAP animation for slide in/out
  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <header
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <div className="absolute top-1/2 w-full -translate-y-1/2">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-3 sm:px-4 py-2 shadow-lg shadow-black/20">
          <nav className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-7">
              <Link to="/" className="transition hover:opacity-75">
                <img src="/img/logo.png" alt="Atlanta High Logo" className="w-8 sm:w-10" />
              </Link>

              <Button
                id="play-button"
                rightIcon={TiLocationArrow}
                containerClass="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hidden sm:flex"
              >
                <span onClick={handlePlayGame}>Play Game</span>
              </Button>
            </div>

            <div className="flex h-full items-center">
              <div className="hidden md:block">
                {NAV_ITEMS.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }: { isActive: boolean }) =>
                      cn("nav-hover-btn", isActive && "font-semibold text-blue-50")
                    }
                    end={path === "/"}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleAudioIndicator}
                  className="ml-4 sm:ml-10 flex items-center space-x-1 p-1.5 sm:p-2 transition hover:opacity-75"
                  title="Play Ambient Sound"
                >
                  <audio
                    ref={audioElementRef}
                    src="/audio/loop.mp3"
                    className="hidden"
                    loop
                  />

                  {Array(4)
                    .fill("")
                    .map((_, i) => (
                      <div
                        key={i + 1}
                        className={cn(
                          "indicator-line",
                          isIndicatorActive && "active"
                        )}
                        style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                      />
                    ))}
                </button>

                <a
                  href={EXTERNAL_LINKS.status}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:opacity-75 hidden sm:block"
                  title="Server Status"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </a>

                <a
                  href={LINKS.robloxGame}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:opacity-75"
                >
                  <SiRoblox size={20} className="sm:size-24" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};