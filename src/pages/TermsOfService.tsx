import { Link } from "react-router-dom";

export const TermsOfService = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="text-red-500 hover:text-red-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-red-500">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">Last updated: November 28, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Agreement to Terms</h2>
          <p className="text-gray-300 mb-6">
            By accessing and using Atlanta High Fire Alarm Simulation ("the Game"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Description of Service</h2>
          <p className="text-gray-300 mb-6">
            Atlanta High is a Roblox game that simulates fire alarm systems in a virtual school environment. The game is designed for educational and entertainment purposes, allowing users to learn about fire safety systems and emergency procedures.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Age Requirements</h2>
          <p className="text-gray-300 mb-6">
            You must be at least 13 years old to use our services, or you must have parental permission if you are under 13. Users must comply with Roblox's age requirements and terms of service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Acceptable Use</h2>
          <p className="text-gray-300 mb-6">
            You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
            <li>Using the game for any illegal or unauthorized purpose</li>
            <li>Exploiting bugs or glitches for unfair advantage</li>
            <li>Using cheats, hacks, or third-party software</li>
            <li>Harassing, bullying, or threatening other players</li>
            <li>Sharing inappropriate content or language</li>
            <li>Impersonating other users or staff members</li>
            <li>Attempting to gain unauthorized access to our systems</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Roblox Platform Terms</h2>
          <p className="text-gray-300 mb-6">
            Our game operates on the Roblox platform. By using our game, you also agree to Roblox's Terms of Service and Community Standards. Roblox's terms take precedence in case of conflicts.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Virtual Items and Currency</h2>
          <p className="text-gray-300 mb-6">
            The game may include virtual items, currency, or other digital assets. These items have no real-world value and are provided for entertainment purposes only. All virtual items remain the property of Atlanta High.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Intellectual Property</h2>
          <p className="text-gray-300 mb-6">
            All content, features, and functionality of the game are owned by Atlanta High and are protected by copyright, trademark, and other intellectual property laws. You may not use, copy, reproduce, or distribute our content without permission.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">User-Generated Content</h2>
          <p className="text-gray-300 mb-6">
            You may be able to create or share content within the game. By doing so, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content for the purpose of operating and improving our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Privacy and Data Collection</h2>
          <p className="text-gray-300 mb-6">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Disclaimers</h2>
          <p className="text-gray-300 mb-6">
            The game is provided "as is" without warranties of any kind. We do not guarantee that the game will be error-free, uninterrupted, or meet your specific requirements. The game is for educational and entertainment purposes only and should not be used for real emergency training.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Limitation of Liability</h2>
          <p className="text-gray-300 mb-6">
            To the maximum extent permitted by law, Atlanta High shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the game, including but not limited to loss of data or loss of virtual items.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Suspension and Termination</h2>
          <p className="text-gray-300 mb-6">
            We reserve the right to suspend or terminate your access to the game at our sole discretion, with or without notice, for any reason, including violation of these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Changes to Terms</h2>
          <p className="text-gray-300 mb-6">
            We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the new Terms. We will post the updated Terms on this page with a new "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Governing Law</h2>
          <p className="text-gray-300 mb-6">
            These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved through binding arbitration.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Severability</h2>
          <p className="text-gray-300 mb-6">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Contact Information</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-gray-300">Email: legal@atlantahigh.com</p>
            <p className="text-gray-300">Roblox: Atlanta High Developer</p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Educational Disclaimer</h2>
          <p className="text-gray-300 mb-6">
            This game is a simulation and should not be considered a substitute for professional fire safety training. Always follow real-world fire safety procedures and emergency protocols in actual emergency situations.
          </p>
        </div>
      </div>
    </div>
  );
};
