# 🌍 BrandOrb

**Discover brands. Unlock rewards. Explore your world.**

BrandOrb is a gamified real-world marketing adventure app inspired by Pokémon GO. Users explore a real 3D map, discover floating "BrandOrbs", solve clue chains, interact through AR, and unlock brand rewards.

![BrandOrb](https://img.shields.io/badge/Status-MVP-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🗺️ Core Features
- **Real-Time 3D Map** - Live GPS movement with player avatar
- **AR Interaction** - Camera-based AR object collection
- **BrandOrb Collection** - Floating interactive 3D objects with animations
- **Clue & Mission System** - Multi-step challenges with XP rewards
- **Reward System** - Discount codes, coupons, and brand points
- **User Profiles** - XP, levels, streaks, and inventory
- **Anti-Cheat System** - GPS spoof detection and movement validation

### 🎨 3D Objects
- BrandOrb (main collectible)
- Reward Box
- Discount Coin
- Mystery Clue
- Brand Node

### 📊 Dashboards
- **Brand Dashboard** - Campaign creation, analytics, and management
- **Admin Dashboard** - Platform oversight and anti-cheat monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SOULGPT/brandorb.git
   cd brandorb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config

4. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
brandorb/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Brand dashboard
│   │   ├── admin/             # Admin dashboard
│   │   └── page.tsx           # Main map view
│   ├── components/            # React components
│   │   ├── ARView.tsx         # AR camera interface
│   │   ├── BrandOrb.tsx       # 3D BrandOrb component
│   │   ├── GameMap.tsx        # Interactive map
│   │   └── MockMap.tsx        # Development map
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   └── lib/                   # Utilities and services
│       ├── firebase.ts        # Firebase initialization
│       └── firebaseService.ts # Complete Firebase API
├── public/                    # Static assets
│   └── manifest.json          # PWA manifest
└── package.json
```

## 🔥 Firebase Collections

### Users
```typescript
{
  uid: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  role: 'user' | 'brand' | 'admin';
  inventory: string[];
  visitedLocations: GeoPoint[];
}
```

### BrandOrbs
```typescript
{
  type: 'brandorb' | 'reward_box' | 'discount_coin' | 'mystery_clue';
  position: GeoPoint;
  brandId: string;
  campaignId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  active: boolean;
}
```

### Campaigns
```typescript
{
  brandId: string;
  name: string;
  description: string;
  clueChain: Clue[];
  rewards: Reward[];
  targetLocations: GeoPoint[];
  analytics: CampaignAnalytics;
}
```

## 🎮 Game Mechanics

- **XP System** - Earn XP for collecting orbs and completing clues
- **Levels** - 100 XP per level
- **Streaks** - Daily login rewards
- **Rarity System** - Common → Rare → Epic → Legendary
- **Anti-Cheat** - Server-side movement validation

## 🛡️ Anti-Cheat Features

- GPS spoof detection
- Teleport detection
- Speed limit checks (max 120 km/h)
- Root/jailbreak prevention
- Server-side validation

## 🎨 UI/UX Design

- **Futuristic aesthetic** with neon blue/cyan/purple accents
- **Glassmorphism** cards and panels
- **Smooth animations** and transitions
- **3D BrandOrb** with orbiting rings
- **Responsive design** for mobile and desktop

## 📱 PWA Support

BrandOrb is a Progressive Web App that can be installed on mobile devices:
- Add to home screen
- Offline support (coming soon)
- Push notifications (coming soon)

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Styling**: CSS Modules
- **Maps**: Custom 3D implementation
- **AR**: Camera API integration

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## 📊 Analytics

Track campaign performance:
- Impressions
- Clue completions
- Reward redemptions
- Cost per engagement
- Heatmaps

## 🗺️ Roadmap

### MVP (Current)
- [x] 3D map with GPS
- [x] BrandOrb spawning
- [x] AR camera interface
- [x] Clue system
- [x] Reward system
- [x] User profiles
- [x] Brand dashboard
- [x] Admin dashboard
- [x] Anti-cheat v1

### Post-Launch
- [ ] Leaderboards
- [ ] Social features (friends, teams)
- [ ] Avatar customization
- [ ] AR mini-games
- [ ] In-app store
- [ ] Mega brand events
- [ ] Real GPS integration
- [ ] Native mobile apps (iOS/Android)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Pokémon GO
- Built with Next.js and Firebase
- Designed for the future of marketing

---

**Made with ❤️ by the BrandOrb Team**

For questions or support, please open an issue on GitHub.
