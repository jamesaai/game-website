import { useEffect, useState } from "react";

export const PassRedirect = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    window.location.href = "https://0d1fa6d2-18c2-4be3-bc78-564e2b737060.paylinks.godaddy.com/staffmod";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
        </div>

        {/* Heading with animated dots */}
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Redirecting{dots}
        </h1>
        
        <p className="text-gray-300 text-lg mb-6">
          Taking you to the payment portal
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full animate-pulse" style={{ width: "70%" }}></div>
        </div>

        <p className="text-gray-400 text-sm">
          Please wait while we securely connect you
        </p>
      </div>
    </div>
  );
};