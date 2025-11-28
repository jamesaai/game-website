import { useEffect, useState } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export const Snowflakes = () => {
  const isMobile = useMobileDetection();
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakeCount = isMobile ? 15 : 40; // Reduced count for better performance
    const flakes: Snowflake[] = Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2, // Shorter animations
      opacity: Math.random() * 0.6 + 0.2, // Reduced opacity range
      size: Math.random() * 3 + 1, // Smaller size range
    }));
    setSnowflakes(flakes);
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white user-select-none pointer-events-none animate-pulse"
          style={{
            left: `${flake.left}%`,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            opacity: flake.opacity,
            fontSize: `${flake.size}px`,
            animationDelay: `${Math.random() * 2}s`,
            transform: 'translateY(-100px)',
          }}
        >
          ❄
        </div>
      ))}
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
