# BrandOrb

BrandOrb is a gamified real-world marketing experience.
Users explore a real 3D map, discover floating “BrandOrbs”, solve clue chains, interact through AR, and unlock brand rewards.

## Project Structure

- `src/app/page.tsx`: Main Mobile Game Interface (Map + AR).
- `src/app/dashboard`: Brand Dashboard for creating campaigns.
- `src/app/admin`: Admin Dashboard (To be implemented).
- `src/components`: Reusable UI and 3D components.
  - `GameMap.tsx`: Mapbox GL JS integration with 3D Avatar.
  - `ARView.tsx`: Simulated AR Camera view with Three.js overlay.
  - `BrandOrb.tsx`: The core 3D asset component.
- `src/lib`: Logic and configuration.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root directory with the following keys:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1... (Your Mapbox Public Token)
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   - Mobile App: `http://localhost:3000` (Use Mobile View in DevTools)
   - Brand Dashboard: `http://localhost:3000/dashboard`

## Features Implemented (MVP)

- **3D Map**: Real-time map with dark mode style and custom 3D avatar.
- **AR Interaction**: Camera feed with floating 3D BrandOrb.
- **BrandOrb 3D**: Custom animated Three.js component with neon rings.
- **Brand Dashboard**: Glassmorphism UI for campaign management.
- **Design System**: Futuristic Neon/Dark theme.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / Global CSS (Vanilla-ish) + Tailwind (for layout utility, though custom CSS is used for effects).
- **3D**: React Three Fiber (Three.js)
- **Map**: React Map GL (Mapbox)
- **State**: React Hooks

## Notes

- **Mapbox Token**: The map will show a warning if the token is missing.
- **Camera Access**: The AR view requires camera permissions. Ensure you are on `localhost` or `https`.
