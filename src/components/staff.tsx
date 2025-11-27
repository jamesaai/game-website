import { useRef, useState, useEffect } from "react";
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
  robloxUsername: string;
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
    role: "Founder",
    description: "Creator of Atlanta High and the fire alarm simulation system. Passionate about realistic emergency training.",
    robloxUsername: "blakegamez0",
    badge: "Owner",
    socials: {
      discord: "blakeflyz",
      twitter: "blakeflyz",
      youtube: "@blake-flyz",
    },
  },
  {
    name: "Strongg",
    role: "Owner & Head Developer",
    description: "Systems architect and gameplay engineer. Specializes in fire alarm mechanics and emergency protocols.",
    robloxUsername: "iii_Strongg", // Replace with actual Roblox username
    badge: "Admin",
    socials: {
      discord: "iii_Strongg",
    },
  },
];

const StaffCard = ({ member, index }: { member: StaffMember; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `https://users.roblox.com/v1/users/get-by-username?username=${member.robloxUsername}`
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        if (data.id) {
          const avatarResponse = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data.id}&size=420x420&format=Png&isCircular=false`
          );
          if (avatarResponse.ok) {
            const avatarData = await avatarResponse.json();
            const imageUrl = avatarData.data?.[0]?.imageUrl;
            if (imageUrl) {
              setAvatarUrl(imageUrl);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to load avatar for ${member.robloxUsername}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAvatar();
  }, [member.robloxUsername]);

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

  useGSAP(() => {
    if (isHovered) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 border border-gray-800/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Corner decoration */}
      <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden">
        <div className="absolute right-0 top-0 h-12 w-12 transform translate-x-6 -translate-y-6 rotate-45 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
      </div>

      {/* Badge */}
      {member.badge && (
        <div className="absolute right-4 top-4 z-10">
          <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-blue-500/30">
            {member.badge}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Avatar container */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="relative size-32 overflow-hidden rounded-2xl border-4 border-gray-800/50 shadow-2xl shadow-black/50 transition-all duration-300 group-hover:border-blue-500/30 group-hover:shadow-blue-500/20">
              {isLoading ? (
                <div className="flex size-full items-center justify-center bg-gray-800/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${member.name}'s avatar`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gray-800/50">
                  <span className="text-3xl text-gray-600">?</span>
                </div>
              )}
            </div>
            
            {/* Animated ring */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
            
            {/* Online status indicator */}
            <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50">
              <div className="h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-blue-400">{member.role}</p>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            {member.description}
          </p>
        </div>

        {/* Roblox profile link */}
        <div className="mt-4 flex justify-center">
          <a
            href={`https://www.roblox.com/users/profile?username=${member.robloxUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-400"
          >
            <span className="font-bold">R</span>
            @{member.robloxUsername}
          </a>
        </div>

        {/* Social links */}
        {member.socials && (
          <div className="mt-4 flex justify-center gap-2">
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
    <section id="staff" ref={sectionRef} className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-black to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="staff-bg-element absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 size-96 rounded-full bg-pink-500/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 flex flex-col items-center px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center max-w-4xl">
          <p className="font-circular-web text-sm uppercase tracking-widest text-blue-50/60 mb-4">
            Meet Our Team
          </p>
          <AnimatedTitle containerClass="!text-blue-50 text-center">
            {"Th<b>e</b> Pe<b>o</b>ple Behind <br /> Atl<b>a</b>nta High"}
          </AnimatedTitle>
          <p className="mt-6 font-circular-web text-lg text-blue-50/80 leading-relaxed">
            Our dedicated team of developers, designers, and community managers work tirelessly 
            to create the most realistic fire alarm simulation experience on Roblox.
          </p>
        </div>

        {/* Staff grid */}
        <div className="grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF_MEMBERS.map((member, index) => (
            <StaffCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-sm border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Want to Join Our Team?</h3>
            <p className="text-blue-50/80 mb-6">
              We're always looking for talented contributors who share our passion for 
              realistic fire safety training and simulation.
            </p>
            <Button
              containerClass="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
              onClick={() => window.open(LINKS.discord, "_blank", "noopener,noreferrer")}
            >
              Join Our Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
