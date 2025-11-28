import { FaDiscord, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiRoblox } from "react-icons/si";

export const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Staff", path: "/staff" },
] as const;

export const EXTERNAL_LINKS = {
  status: "https://status.ahscampus.com/",
} as const;

export const LINKS = {
  documentation: "https://atlantahigh.mintlify.app/",
  robloxGame: "https://www.roblox.com/games/72522242437087", // Replace with your actual game ID
  discord: "https://discord.gg/firealarm", // Replace with your actual Discord
  sourceCode: "https://github.com/yourusername/atlanta-high", // Optional
} as const;

export const SOCIAL_LINKS = [
  {
    href: "https://discord.gg/firealarm", // Replace with actual Discord
    icon: FaDiscord,
  },
  {
    href: "https://twitter.com/YOUR-GAME", // Replace with actual Twitter
    icon: FaXTwitter,
  },
  {
    href: "https://youtube.com/@blake-flyz", // Replace with actual YouTube
    icon: FaYoutube,
  },
  {
    href: "https://www.roblox.com/groups/35390256", // Replace with actual Roblox group
    icon: SiRoblox,
  },
] as const;

// Local gameplay video assets served from /public/videos
export const VIDEO_LINKS = {
  // Fire alarm system demonstrations
  feature1: "/videos/feature-1.mp4", // Fire alarm control panel
  feature2: "/videos/feature-2.mp4", // Pull station demonstration
  feature3: "/videos/feature-3.mp4", // Horns and strobes
  feature4: "/videos/feature-4.mp4", // Fire drill sequence
  feature5: "/videos/feature-5.mp4", // School walkthrough

  // Hero/gameplay videos - main footage
  hero1: "/videos/hero-1.mp4", // Main gameplay loop
  hero2: "/videos/hero-2.mp4", // Classroom fire alarm
  hero3: "/videos/hero-3.mp4", // Hallway evacuation
  hero4: "/videos/hero-4.mp4", // Control room
};
