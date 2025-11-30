import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useWindowScroll } from "react-use";

import { NAV_ITEMS, EXTERNAL_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { useSecretAccess } from "@/hooks/useSecretAccess";

const SecretKeypad = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [input, setInput] = useState("");
  const keypadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && keypadRef.current) {
      gsap.fromTo(keypadRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleKeyPress = (value: string) => {
    if (value === "CLEAR") {
      setInput("");
    } else if (value === "ENTER") {
      if (input === "2025") {
        onSuccess();
        onClose();
      } else {
        gsap.to(keypadRef.current, {
          x: "-=10",
          duration: 0.075,
          ease: "power2.inOut",
          repeat: 4,
          yoyo: true,
          onComplete: () => setInput("")
        });
      }
    } else if (input.length < 4) {
      setInput(input + value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center pt-20">
      <div ref={keypadRef} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-red-500/30 shadow-2xl shadow-red-500/20 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">ACCESS REQUIRED</h3>
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-xl font-mono text-red-400">
                  {input[i] || "•"}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 border border-gray-600"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress("CLEAR")}
            className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 border border-gray-600 text-sm"
          >
            CLR
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 border border-gray-600"
          >
            0
          </button>
          <button
            onClick={() => handleKeyPress("ENTER")}
            className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 border border-green-500"
          >
            ✓
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-25T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
      <span className="hidden sm:inline">🎄</span>
      <span className="font-mono text-[10px] sm:text-xs">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </div>
  );
};

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const { secretSequence, showKeypad, setShowKeypad } = useSecretAccess();

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
        <div className="flex items-center justify-between w-full max-w-4xl rounded-2xl border border-green-400/30 bg-gradient-to-r from-green-900/80 to-red-900/80 backdrop-blur-2xl px-4 sm:px-6 py-2 shadow-lg shadow-green-600/20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="transition hover:opacity-75">
              <img src="/atlanta-high-logo.png" alt="Atlanta High Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
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
            <CountdownTimer />
            
            {/* Secret Sequence Indicator */}
            {secretSequence && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-900/30 border border-red-500/30 rounded">
                {secretSequence.split('').map((digit, i) => (
                  <span key={i} className="text-xs font-mono text-red-400">
                    {digit}
                  </span>
                ))}
                <span className="text-xs text-red-400 animate-pulse">_</span>
              </div>
            )}
            
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
          </div>
        </div>
      </div>
      
      <SecretKeypad
        isOpen={showKeypad}
        onClose={() => setShowKeypad(false)}
        onSuccess={() => navigate("/2025")}
      />
    </header>
  );
};