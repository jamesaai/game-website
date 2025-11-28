import { Button } from "./button";
import { LINKS } from "@/constants";
import { useState } from "react";

interface ImageClipBoxProps {
  src: string;
  alt: string;
  clipClass?: string;
}

const ImageClipBox = ({ src, alt, clipClass }: ImageClipBoxProps) => (
  <div className={clipClass}>
    <img src={src} alt={alt} width="400" height="300" />
  </div>
);

export const Contact = () => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleJoinDiscord = () => {
    window.open(LINKS.discord, "_blank");
  };

  const handleAgreeRules = () => {
    setHasAgreed(true);
    setShowForm(true);
  };

  const handleOpenApplication = () => {
    if (hasAgreed) {
      window.open('https://melonly.xyz/forms/7383328359192727552', '_blank');
    }
  };

  return (
    <section id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-gradient-to-b from-gray-900 via-black to-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            alt="Fire Alarm Panel"
            clipClass="contact-clip-path-1"
          />

          <ImageClipBox
            src="/img/contact-2.webp"
            alt="Pull Station"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            alt="Fire alarm device partial"
            clipClass="absolute md:scale-125"
          />

          <ImageClipBox
            src="/img/swordman.webp"
            alt="Fire alarm system"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="font-circular-web text-[10px] uppercase tracking-widest text-blue-50/60">Join Our Community</p>

          <p className="special-font mt-10 w-full font-zentry text-5xl leading-[0.9] md:text-[6rem]">
            Join th<b>o</b>usands of
            <br /> fire safety <br /> enth<b>u</b>siasts
          </p>

          <Button
            containerClass="mt-10 cursor-pointer bg-blue-600 px-8 py-3 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={handleJoinDiscord}
          >
            Join Discord
          </Button>
        </div>

        {/* Staff Application Section */}
        <div className="relative z-10 mt-20 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-blue-50">Staff Application</h2>
            <p className="text-gray-300 mb-6">
              Apply to join our staff team and help make our community better!
            </p>
            
            {!hasAgreed && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-4">
                  Before applying, you must agree to all of our community rules and guidelines.
                </p>
                <Button
                  containerClass="cursor-pointer bg-green-600 px-6 py-2 rounded-lg text-white hover:bg-green-700 transition"
                  onClick={handleAgreeRules}
                >
                  I Agree to All Rules
                </Button>
              </div>
            )}

            {showForm && (
              <div className="w-full">
                <div className="mb-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
                  <p className="text-green-400 text-sm">
                    ✓ Thank you for agreeing to our rules! You can now access the application form.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold mb-3 text-blue-50">Application Form</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Click the button below to open the staff application form in a new window.
                  </p>
                  <Button
                    containerClass="cursor-pointer bg-purple-600 px-6 py-2 rounded-lg text-white hover:bg-purple-700 transition"
                    onClick={handleOpenApplication}
                  >
                    Open Application Form
                  </Button>
                  
                  {/* Note about embedding */}
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Note: The application form will open in a new tab for the best experience.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};