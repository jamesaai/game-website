import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { AnimatedTitle } from "./animated-title";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    return () => {
      clipAnimation.kill();
    };
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-black to-black text-blue-50">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5 px-6">
        <p className="font-circular-web text-sm uppercase tracking-widest text-blue-50/60 md:text-[10px]">
          Welcome to Atlanta High
        </p>

        <AnimatedTitle containerClass="mt-5 !text-blue-50 text-center">
          {"Exp<b>e</b>rience the most re<b>a</b>listic <br /> fire alarm simulation"}
        </AnimatedTitle>

        <div className="about-subtext max-w-2xl text-center">
          <p className="text-lg md:text-xl">A realistic high school fire safety simulation on Roblox</p>
          <p className="mt-2 text-blue-50/80">Learn, test, and master fire alarm systems in an immersive environment</p>
        </div>
      </div>

      <div className="h-screen w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="/img/about.webp"
            alt="Atlanta High Fire Alarm System"
            className="absolute left-0 top-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};