import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { AnimatedTitle } from "./animated-title";
import { Button } from "./button";
import { LINKS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface StaffMember {
  name: string;
  role: string;
  description: string;
  image: string;
  badge?: string;
  socials?: {
    discord?: string;
    twitter?: string;
    youtube?: string;
  };
}

const STAFF_MEMBERS: StaffMember[] = [
  {
    name: "Blake Flyz",
    role: "Founder & Lead Developer",
    description: "Creator of Atlanta High and the fire alarm simulation system. Passionate about realistic emergency training.",
    image: "/img/staff/blake.webp",
    badge: "Owner",
    socials: {
      discord: "blakeflyz",
      twitter: "blakeflyz",
      youtube: "@blake-flyz",
    },
  },
  {
    name: "Alex Chen",
    role: "Senior Developer",
    description: "Systems architect and gameplay engineer. Specializes in fire alarm mechanics and emergency protocols.",
    image: "/img/staff/alex.webp",
    badge: "Admin",
    socials: {
      discord: "alexchen",
    },
  },
  {
    name: "Sam Rivera",
    role: "Community Manager",
    description: "Keeps the community engaged and organizes events. Expert in fire safety education and training programs.",
    image: "/img/staff/sam.webp",
    badge: "Staff",
    socials: {
      discord: "samrivera",
      twitter: "samrivera",
    },
  },
  {
    name: "Jordan Kim",
    role: "Level Designer",
    description: "Creates immersive school environments and realistic fire alarm system layouts.",
    image: "/img/staff/jordan.webp",
    badge: "Builder",
    socials: {
      discord: "jordankim",
      youtube: "@jordan-builds",
    },
  },
  {
    name: "Morgan Taylor",
    role: "QA Lead",
    description: "Ensures all fire alarm systems work perfectly. Runs extensive testing on emergency scenarios.",
    image: "/img/staff/morgan.webp",
    badge: "Tester",
    socials: {
      discord: "morgan",
    },
  },
  {
    name: "Casey Wright",
    role: "Script Writer",
    description: "Develops engaging training scenarios and educational content for fire safety protocols.",
    image: "/img/staff/casey.webp",
    badge: "Contributor",
    socials: {
      discord: "casey",
      twitter: "caseywrites",
    },
  },
];

const StaffCard = ({ member, index }: { member: StaffMember; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Badge */}
      {member.badge && (
        <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white">
          {member.badge}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Avatar */}
        <div className="mb-4 flex justify-center">
          <div className="relative size-24 overflow-hidden rounded-full border-4 border-blue-500/30 shadow-lg shadow-blue-500/20">
            <img
              src={member.image}
              alt={member.name}
              className="size-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/img/staff/default.webp";
              }}
            />
            {/* Animated ring */}
            <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-sm" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-blue-400">{member.role}</p>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            {member.description}
          </p>
        </div>

        {/* Social links */}
        {member.socials && (
          <div className="mt-4 flex justify-center gap-3">
            {member.socials.discord && (
              <div className="rounded-full bg-gray-800/50 p-2 text-gray-400 transition-colors hover:bg-blue-500/20 hover:text-blue-400">
                <span className="text-xs font-medium">Discord</span>
              </div>
            )}
            {member.socials.twitter && (
              <div className="rounded-full bg-gray-800/50 p-2 text-gray-400 transition-colors hover:bg-blue-500/20 hover:text-blue-400">
                <span className="text-xs font-medium">Twitter</span>
              </div>
            )}
            {member.socials.youtube && (
              <div className="rounded-full bg-gray-800/50 p-2 text-gray-400 transition-colors hover:bg-blue-500/20 hover:text-blue-400">
                <span className="text-xs font-medium">YouTube</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Staff = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });

    tl.fromTo(
      ".staff-bg-element",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
      }
    );
  });

  return (
    <section id="staff" ref={sectionRef} className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-black to-black">
      {/* Background elements */}
      <div className="staff-bg-element absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-circular-web text-sm uppercase tracking-widest text-blue-50/60">
            Meet Our Team
          </p>
          <AnimatedTitle containerClass="mt-5 !text-blue-50 text-center">
            {"Th<b>e</b> Pe<b>o</b>ple Behind <br /> Atl<b>a</b>nta High"}
          </AnimatedTitle>
          <p className="mt-6 max-w-2xl text-center font-circular-web text-lg text-blue-50/80 leading-relaxed">
            Our dedicated team of developers, designers, and community managers work tirelessly 
            to create the most realistic fire alarm simulation experience on Roblox.
          </p>
        </div>

        {/* Staff grid */}
        <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF_MEMBERS.map((member, index) => (
            <StaffCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4 font-circular-web text-blue-50/80">
            Want to join our team? We're always looking for talented contributors!
          </p>
          <Button
            containerClass="bg-blue-600 px-8 py-3 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={() => window.open(LINKS.discord, "_blank", "noopener,noreferrer")}
          >
            Join Our Discord
          </Button>
        </div>
      </div>
    </section>
  );
};
