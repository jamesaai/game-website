import React, { useEffect, useState } from 'react';

export const MobileDetector = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    // Check if the device is an iPhone
    const isIPhone = /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;
    
    setIsMobile(isIPhone); // Only block iPhones specifically as requested
    setIsDetected(true);
  }, []);

  if (!isDetected) {
    // Show loading state while detecting
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-blue-50 text-xl">Loading...</div>
      </div>
    );
  }

  if (isMobile) {
    // Show error message for iPhone users
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-900 border-2 border-red-600 rounded-lg p-8 text-center">
          <div className="text-red-100 mb-4">
            <svg 
              className="w-16 h-16 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Device Not Supported</h2>
          </div>
          <p className="text-red-200 mb-6">
            This website only works on PC and desktop computers. Please visit us from a desktop or laptop computer for the best experience.
          </p>
          <div className="text-red-300 text-sm">
            <p className="mb-2">Why desktop only?</p>
            <ul className="text-left space-y-1">
              <li>• Advanced graphics and animations</li>
              <li>• Full-screen experience required</li>
              <li>• Complex interactions not mobile-friendly</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Allow desktop users to see the content
  return <>{children}</>;
};
