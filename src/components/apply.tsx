import { useEffect } from "react";

const Apply = () => {
  useEffect(() => {
    document.title = "Apply | Atlanta High";
  }, []);

  return (
    <div className="min-h-screen bg-black text-blue-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Staff Application</h1>
        <div className="bg-gray-900 rounded-lg p-4 shadow-2xl">
          <iframe 
            src="https://melonly.xyz/forms/7383328359192727552" 
            width="100%" 
            height="600" 
            frameBorder="0"
            className="w-full rounded"
            title="Staff Application Form"
          >
            Your browser does not support iframes.
          </iframe>
        </div>
      </div>
    </div>
  );
};

export { Apply };
