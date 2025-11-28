import { VIDEO_LINKS } from "@/constants";
import { PropsWithChildren, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

interface BentoTiltProps {
  className?: string;
}

const BentoTilt = ({ children, className = "" }: PropsWithChildren<BentoTiltProps>) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;
    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98,0.98,0.98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div ref={itemRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transform: transformStyle }}>
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: React.ReactNode;
  description?: string;
}

const BentoCard = ({ src, title, description }: BentoCardProps) => (
  <article className="relative size-full">
    <video src={src} loop muted autoPlay className="absolute left-0 top-0 size-full object-cover object-center" width="1920" height="1080" />
    <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
      <div>
        <h1 className="bento-title special-font">{title}</h1>
        {description && <p className="text-xl mt-3 max-w-64 md:text-base">{description}</p>}
      </div>
    </div>
  </article>
);

export const Features = () => (
  <section id="systems" className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">Fire Alarm Systems & Features</p>
        <p className="max-w-2xl font-circular-web text-lg text-blue-50/80 leading-relaxed">
          Explore authentic fire alarm systems, from pull stations to control panels. Experience realistic fire drills and emergency scenarios in our detailed simulation.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src={VIDEO_LINKS.feature1}
          title={<>Fire Ala<b>r</b>m Panels</>}
          description="Interact with realistic fire alarm control panels. Monitor zones, acknowledge alarms, and manage building safety systems just like real fire safety professionals."
        />
      </BentoTilt>

      <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src={VIDEO_LINKS.feature2}
            title={<>Pull Sta<b>t</b>ions</>}
            description="Experience authentic pull station mechanics. Trigger alarms, test systems, and learn proper emergency activation procedures."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src={VIDEO_LINKS.feature3}
            title={<>Notifi<b>c</b>ation Devices</>}
            description="See realistic horns, strobes, and speaker systems in action. Learn how different notification devices respond during various emergency scenarios."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src={VIDEO_LINKS.feature4}
            title={<>Fire D<b>r</b>ills</>}
            description="Participate in scheduled fire drills and emergency evacuations. Practice proper procedures and test your emergency response skills."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-red-600 p-5">
            <h1 className="bento-title special-font max-w-64 text-white">M<b>o</b>re syste<b>m</b>s co<b>m</b>ing!</h1>
            <TiLocationArrow className="m-5 scale-[5] self-end text-white" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <video src={VIDEO_LINKS.feature5} loop muted autoPlay className="size-full object-cover object-center" width="1920" height="1080" />
        </BentoTilt>
      </div>
    </div>
  </section>
);