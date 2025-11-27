# Atlanta High - Fire Alarm Simulation Website

Official website for Atlanta High, the most realistic fire alarm simulation game on Roblox.

![Atlanta High](/.github/images/img_main.png)

## 🚨 About Atlanta High

Atlanta High is a realistic high school fire safety simulation on Roblox. Experience authentic fire alarm systems, from pull stations to control panels. Learn, test, and master emergency procedures in our immersive environment.

## 📋 Setup Instructions

### Prerequisite

- Node.js (v20.19.0 or higher)
- npm, yarn, or bun package manager

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/atlanta-high-website.git
cd atlanta-high-website
```

1. Install dependencies:

```bash
npm install --legacy-peer-deps
# or
yarn install --legacy-peer-deps
# or
bun install --legacy-peer-deps
```

1. **IMPORTANT: Update Configuration**
   
   Open `src/constants/index.ts` and replace placeholder values:
   
   ```typescript
   export const LINKS = {
     robloxGame: "YOUR_ACTUAL_ROBLOX_GAME_URL",
     discord: "YOUR_ACTUAL_DISCORD_INVITE",
     documentation: "https://atlantahigh.mintlify.app/",
   };
   
   export const SOCIAL_LINKS = [
     { href: "YOUR_ACTUAL_DISCORD", icon: FaDiscord },
     { href: "YOUR_ACTUAL_TWITTER", icon: FaXTwitter },
     { href: "YOUR_ACTUAL_YOUTUBE", icon: FaYoutube },
     { href: "YOUR_ACTUAL_ROBLOX_GROUP", icon: SiRoblox },
   ];
   ```
1. **Replace Media Assets**
   
   You need to replace placeholder images and videos:
   
   **Images to Replace:**
- `/public/img/logo.png` - Your Atlanta High logo
- `/public/img/about.webp` - Fire alarm system or school building
- `/public/img/entrance.webp` - School entrance
- `/public/img/contact-1.webp` - Fire alarm panel
- `/public/img/contact-2.webp` - Pull station
- `/public/img/swordman.webp` - Replace with fire safety equipment
- `/public/img/swordman-partial.webp` - Replace with fire safety equipment partial
- `/public/favicon.ico`, `/public/icon1.png`, `/public/icon2.png`, `/public/apple-icon.png` - Your branding
   
   **Videos to Add:**
   
   Update video URLs in `src/constants/index.ts`:
   
   ```typescript
   export const VIDEO_LINKS = {
     feature1: "URL_TO_FIRE_ALARM_PANEL_VIDEO",
     feature2: "URL_TO_PULL_STATION_VIDEO",
     feature3: "URL_TO_NOTIFICATION_DEVICES_VIDEO",
     feature4: "URL_TO_FIRE_DRILL_VIDEO",
     feature5: "URL_TO_SCHOOL_TOUR_VIDEO",
     hero1: "URL_TO_GAMEPLAY_VIDEO_1",
     hero2: "URL_TO_GAMEPLAY_VIDEO_2",
     hero3: "URL_TO_GAMEPLAY_VIDEO_3",
     hero4: "URL_TO_GAMEPLAY_VIDEO_4",
   };
   ```
1. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

1. Open <http://localhost:5173> in your browser

## 🎮 Features

- **Fire Alarm Panels** - Interact with realistic control panels
- **Pull Stations** - Authentic pull station mechanics
- **Notification Devices** - Experience horns, strobes, and speakers
- **Fire Drills** - Participate in emergency evacuations
- **Virtual Campus** - Explore detailed school recreation

## 🛠️ Tech Stack

- React 19 with TypeScript
- Vite 7 for blazing fast development
- GSAP for smooth animations
- Tailwind CSS for styling
- React Icons for iconography

## 📦 Build for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The built files will be in the `dist` directory, ready for deployment.

## 🚀 Deployment

This site can be deployed to:

- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Netlify Deployment

1. Connect your GitHub repository to Netlify
1. Set build command: `npm run build`
1. Set publish directory: `dist`
1. Deploy!

## 📝 Customization Checklist

- [ ] Update all URLs in `src/constants/index.ts`
- [ ] Replace logo and favicon
- [ ] Add gameplay videos
- [ ] Replace all images in `/public/img/`
- [ ] Update `package.json` author info
- [ ] Update `index.html` meta tags
- [ ] Test all social media links
- [ ] Test “Play Now” button (links to Roblox)
- [ ] Test “Join Discord” button
- [ ] Verify documentation link works

## 📄 License

MIT License - feel free to use this for your own Roblox game website!

## 🔗 Links

- [Play Atlanta High on Roblox](https://www.roblox.com/games/YOUR-GAME-ID)
- [Documentation](https://atlantahigh.mintlify.app/)
- [Join Our Discord](https://discord.gg/YOUR-SERVER)

## 🤝 Contributing

If you find any bugs or have suggestions, please open an issue or submit a pull request!

-----

Built with ❤️ for the fire safety enthusiast community