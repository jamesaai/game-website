import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiRoblox } from "react-icons/si";
import { useWindowScroll } from "react-use";

import { LINKS, NAV_ITEMS, EXTERNAL_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const { y: currentScrollY } = useWindowScroll();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying(!isAudioPlaying);
    setIsIndicatorActive(!isIndicatorActive);

    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
    }
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
      className="fixed inset-x-0 top-0 z-50 h-16 border-none transition-all duration-700"
    >
      <div className="flex h-full items-center justify-center px-4 sm:px-6">
        <div className="flex items-center justify-between w-full max-w-2xl rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl px-4 sm:px-6 py-2 shadow-lg shadow-black/20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="transition hover:opacity-75">
              <img src="/img/logo.png" alt="Atlanta High Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            </Link>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    "text-xs sm:text-sm font-medium transition-all duration-200 hover:text-white",
                    isActive ? "text-white font-semibold" : "text-gray-400"
                  )
                }
                end={path === "/"}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleAudioIndicator}
              className="p-1.5 sm:p-2 transition hover:opacity-75"
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </a>

            <a
              href={LINKS.robloxGame}
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:opacity-75"
            >
              <SiRoblox size={14} className="sm:size-16" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};