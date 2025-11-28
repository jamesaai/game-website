import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { Button } from "./button";
import { LINKS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface Department {
  title: string;
  icon: string;
  description: string;
  responsibilities: string[];
  image: string;
}

const DEPARTMENTS: Department[] = [
  {
    title: "Public Relations Department",
    icon: "📊",
    description: "The Public Relations department is responsible for Bloxco's public image, marketing strategies, and building relationships with other groups and communities.",
    responsibilities: [
      "Creating and keeping our social media pages active",
      "Building positive relationships with our group affiliates",
      "Hosting events to keep our community engaged"
    ],
    image: "/public-relations.png"
  },
  {
    title: "Training Department",
    icon: "🎓",
    description: "The Training Department is responsible for developing and implementing training programs for new staff members, ensuring they have the knowledge and skills needed to excel in their roles.",
    responsibilities: [
      "Moderating bad actors in-game and on Discord",
      "Handling support enquiries that are relevant to trainings",
      "Hosting trainings for Security and Store Colleague staff"
    ],
    image: "/training-team.png"
  },
  {
    title: "Human Resources Department",
    icon: "👥",
    description: "The Human Resources Department focuses on staff management, recruitment, and ensuring a positive work environment for all team members.",
    responsibilities: [
      "Managing staff recruitment and onboarding",
      "Handling staff disputes and HR issues",
      "Maintaining staff records and performance reviews"
    ],
    image: "/human-resources.png"
  }
];

const DepartmentCard = ({ department, index }: { department: Department; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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
      className="bg-black rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 border border-gray-800/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={department.image}
        alt={department.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23000000' width='400' height='200'/%3E%3Ctext fill='%23fff' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E${department.icon}%3C/text%3E%3C/svg%3E`;
        }}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <span className="mr-2">{department.icon}</span> {department.title}
        </h2>
        <p className="text-gray-300 mb-4">
          {department.description}
        </p>
        <h3 className="text-lg font-semibold mb-2">RESPONSIBILITIES</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {department.responsibilities.map((responsibility, idx) => (
            <li key={idx}>{responsibility}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const StaffSection = () => {
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
    <section id="staff" ref={sectionRef} className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Corporate Departments</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Bloxco Stores is organized into three main corporate departments, each with specific
            responsibilities to ensure smooth operations and growth.
          </p>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {DEPARTMENTS.map((department, index) => (
            <DepartmentCard key={department.title} department={department} index={index} />
          ))}
        </div>

        {/* Join Corporate Team Section */}
        <div className="text-center bg-black rounded-lg p-8 sm:p-12 border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join Our Corporate Team</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to take your career to the next level? Join our corporate team and help shape the future of Bloxco Stores.
          </p>
          <Button
            containerClass="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg"
            onClick={() => window.open(LINKS.discord, "_blank", "noopener,noreferrer")}
          >
            Join Our Discord
          </Button>
        </div>
      </div>
    </section>
  );
};
