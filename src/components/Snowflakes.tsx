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
    const flakeCount = isMobile ? 30 : 100; // Fewer snowflakes on mobile
    const flakes: Snowflake[] = Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      size: Math.random() * 4 + 1,
    }));
    setSnowflakes(flakes);
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
          }
        }
        
        .snowflake {
          position: absolute;
          color: white;
          user-select: none;
          pointer-events: none;
          animation: snowfall linear infinite;
        }
      `}</style>
      
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            fontSize: `${flake.size}px`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};
