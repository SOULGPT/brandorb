"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FaUserCircle, FaBoxOpen, FaCamera } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import Map to avoid SSR issues with Mapbox
const GameMap = dynamic(() => import('@/components/GameMap'), { ssr: false });
const ARView = dynamic(() => import('@/components/ARView'), { ssr: false });

export default function Home() {
  const [showAR, setShowAR] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleCapture = () => {
    alert("BrandOrb Captured! +100 XP");
    setShowAR(false);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black font-sans">

      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <GameMap />
      </div>

      {/* Start Screen Overlay */}
      <AnimatePresence>
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
          >
            <div className="bg-[#2a75bb] p-8 rounded-3xl shadow-2xl border-4 border-white/20 max-w-sm w-full text-center relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>

              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md uppercase leading-tight">
                Adventure<br />Awaits
              </h1>
              <p className="text-blue-100 mb-8 font-medium">Explore the world, find brands, earn rewards.</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
                    <div className="w-4 h-4 bg-white border-4 border-gray-800 rounded-full z-10"></div>
                  </div>
                  <span className="text-xs font-bold text-white">Brand Orb</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🎁</div>
                  <span className="text-xs font-bold text-white">Reward</span>
                </div>
              </div>

              <button
                onClick={() => setGameStarted(true)}
                className="w-full bg-[#ffcb05] hover:bg-[#f5c000] text-[#2a75bb] text-xl font-black py-4 rounded-2xl shadow-[0_4px_0_rgb(180,140,0)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wider"
              >
                Start
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Overlay (Only visible after start) */}
      {gameStarted && (
        <div className="ui-overlay pointer-events-none">

          {/* Top Bar */}
          <div className="flex justify-between items-start pointer-events-auto">
            <div
              className="glass-panel p-2 flex items-center gap-3 cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center border-2 border-white">
                <FaUserCircle className="text-white text-xl" />
              </div>
              <div className="pr-2">
                <div className="text-xs text-gray-300 font-bold">LEVEL 5</div>
                <div className="text-sm font-bold text-white">PlayerOne</div>
                {/* XP Bar */}
                <div className="w-20 h-1.5 bg-gray-700 rounded-full mt-1">
                  <div className="h-full bg-cyan-400 rounded-full w-[60%] shadow-[0_0_5px_#00f3ff]"></div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-2 flex flex-col items-center gap-1">
              <span className="text-xs text-cyan-400 font-bold">STREAK</span>
              <span className="text-lg font-bold text-white">🔥 12</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex justify-between items-end pointer-events-auto pb-6">
            <button className="glass-panel p-4 rounded-full text-white hover:bg-white/10 transition-colors">
              <FaBoxOpen size={24} />
            </button>

            <button
              onClick={() => setShowAR(true)}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)] border-4 border-white/20 transform hover:scale-105 transition-transform"
            >
              <FaCamera size={32} className="text-white" />
            </button>

            <button className="glass-panel p-4 rounded-full text-white hover:bg-white/10 transition-colors">
              <div className="relative">
                <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
                <span className="font-bold text-xs">MENU</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* AR View Overlay */}
      <AnimatePresence>
        {showAR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50"
          >
            <ARView onClose={() => setShowAR(false)} onCapture={handleCapture} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal Overlay */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute inset-x-0 bottom-0 h-[80vh] glass-panel z-40 rounded-t-3xl p-6 pointer-events-auto"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" onClick={() => setShowProfile(false)} />
            <h2 className="text-2xl font-bold mb-4 neon-text-purple">Agent Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="text-gray-400 text-xs uppercase">Total XP</div>
                <div className="text-2xl font-bold text-white">12,450</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="text-gray-400 text-xs uppercase">Orbs Found</div>
                <div className="text-2xl font-bold text-cyan-400">84</div>
              </div>
            </div>
            {/* More profile content... */}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
