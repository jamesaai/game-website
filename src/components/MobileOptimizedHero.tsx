import { useEffect, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import { Button } from "./button";
import { Snowflakes } from "./Snowflakes";
import { LINKS } from "@/constants";

export const MobileOptimizedHero = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [isPlayerCountLoading, setIsPlayerCountLoading] = useState(true);
  const [isVisitCountLoading, setIsVisitCountLoading] = useState(true);

  const handlePlayNow = () => {
    window.open(LINKS.robloxGame, "_blank", "noopener,noreferrer");
  };

  const handleJoinGroup = () => {
    window.open(LINKS.discord, "_blank", "noopener,noreferrer");
  };

  // Fetch player count
  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const response = await fetch("https://games.roblox.com/v1/games/3250588358");
        const data = await response.json();
        setPlayerCount(data.data?.playing || 0);
      } catch (error) {
        console.error("Failed to fetch player count:", error);
      } finally {
        setIsPlayerCountLoading(false);
      }
    };

    void fetchPlayerCount();
  }, []);

  // Fetch total visits
  useEffect(() => {
    const fetchTotalVisits = async () => {
      try {
        const response = await fetch("https://games.roblox.com/v1/games/3250588358");
        const data = await response.json();
        setTotalVisits(data.data?.visits || 0);
      } catch (error) {
        console.error("Failed to fetch total visits:", error);
      } finally {
        setIsVisitCountLoading(false);
      }
    };

    void fetchTotalVisits();
  }, []);

  return (
    <section className="relative h-dvh w-screen overflow-hidden">
      <Snowflakes />
      
      {/* Simple gradient background instead of video for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-green-900/50 to-red-900/50">
        <div className="absolute inset-0 bg-black/40" />
      </div>

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
    </section>
  );
};
