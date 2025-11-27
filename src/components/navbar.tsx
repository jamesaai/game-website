import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiRoblox } from "react-icons/si";
import { TiLocationArrow } from "react-icons/ti";
import { useWindowScroll } from "react-use";

import { LINKS, NAV_ITEMS } from "@/constants";
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
    window.open(LINKS.robloxGame, "_blank");
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
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Link to="/" className="transition hover:opacity-75">
              <img src="/img/logo.png" alt="Atlanta High Logo" className="w-10" />
            </Link>

            <Button
              id="play-button"
              rightIcon={TiLocationArrow}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
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
                  className={({ isActive }) =>
                    cn("nav-hover-btn", isActive && "font-semibold text-blue-50")
                  }
                  end={path === "/"}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-1 p-2 transition hover:opacity-75"
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
                href={LINKS.robloxGame}
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:opacity-75"
                title="Play on Roblox"
              >
                <SiRoblox className="size-5 text-white" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};