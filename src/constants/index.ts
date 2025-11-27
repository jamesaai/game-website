import { FaDiscord, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiRoblox } from "react-icons/si";

export const NAV_ITEMS = [
  { label: "GAMEPLAY", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Systems", href: "#systems" },
  { label: "School", href: "#school" },
  { label: "Join", href: "#contact" },
] as const;

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

// Replace these with your actual gameplay video URLs
export const VIDEO_LINKS = {
  // Fire alarm system demonstrations
  feature1: "https://YOUR-CDN.com/fire-alarm-panel.mp4", // Fire alarm control panel
  feature2: "https://YOUR-CDN.com/pull-stations.mp4", // Pull station demonstration
  feature3: "https://YOUR-CDN.com/notification-devices.mp4", // Horns and strobes
  feature4: "https://YOUR-CDN.com/fire-drill.mp4", // Fire drill sequence
  feature5: "https://YOUR-CDN.com/school-tour.mp4", // School walkthrough
  
  // Hero/gameplay videos - main footage
  hero1: "https://YOUR-CDN.com/gameplay-1.mp4", // Main gameplay loop
  hero2: "https://YOUR-CDN.com/gameplay-2.mp4", // Classroom fire alarm
  hero3: "https://YOUR-CDN.com/gameplay-3.mp4", // Hallway evacuation
  hero4: "https://YOUR-CDN.com/gameplay-4.mp4", // Control room
};
