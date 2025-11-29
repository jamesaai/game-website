import { useEffect } from "react";

export const PassRedirect = () => {
  useEffect(() => {
    window.location.href = "https://0d1fa6d2-18c2-4be3-bc78-564e2b737060.paylinks.godaddy.com/staffmod";
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-300">You are being redirected to the payment portal.</p>
      </div>
    </div>
  );
};
