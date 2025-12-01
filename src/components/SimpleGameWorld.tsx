"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import BrandOrb from './BrandOrb';
import { BrandOrb as BrandOrbType } from '@/lib/firebaseService';

interface SimpleGameWorldProps {
    orbs: BrandOrbType[];
    onOrbClick?: (orb: BrandOrbType) => void;
}

export default function SimpleGameWorld({ orbs, onOrbClick }: SimpleGameWorldProps) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-green-400">

            {/* Sun */}
            <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-yellow-300 shadow-[0_0_60px_20px_rgba(255,220,100,0.8)]" />

            {/* Clouds */}
            <motion.div
                className="absolute top-16 left-10"
                animate={{ x: [0, 1000] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
                <div className="flex gap-2">
                    <div className="w-12 h-8 bg-white/90 rounded-full" />
                    <div className="w-16 h-10 bg-white/90 rounded-full -ml-4" />
                    <div className="w-10 h-7 bg-white/90 rounded-full -ml-4" />
                </div>
            </motion.div>

            <motion.div
                className="absolute top-32 left-40"
                animate={{ x: [0, 1000] }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear', delay: 5 }}
            >
                <div className="flex gap-2">
                    <div className="w-14 h-9 bg-white/80 rounded-full" />
                    <div className="w-18 h-11 bg-white/80 rounded-full -ml-4" />
                </div>
            </motion.div>

            {/* Ground with grass pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-green-300 to-green-500">
                {/* Simple grass texture */}
                <div className="w-full h-full opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                }} />
            </div>

            {/* Trees */}
            <div className="absolute bottom-24 left-1/4 text-7xl">🌳</div>
            <div className="absolute bottom-32 right-1/3 text-6xl">🌲</div>
            <div className="absolute bottom-20 right-1/4 text-8xl">🌳</div>

            {/* Flowers */}
            <div className="absolute bottom-28 left-1/3 text-4xl">🌸</div>
            <div className="absolute bottom-24 left-1/2 text-3xl">🌺</div>
            <div className="absolute bottom-30 right-1/3 text-4xl">🌻</div>

            {/* Path */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-amber-700/60 to-amber-800/80"
                style={{ clipPath: 'polygon(35% 0%, 65% 0%, 75% 100%, 25% 100%)' }}>
                <div className="w-full h-full opacity-30" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 50px)'
                }} />
            </div>

            {/* Player Avatar */}
            <motion.div
                className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-30"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-cyan-400/40 blur-lg" />
                    <div className="w-20 h-20">
                        <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
                            <ambientLight intensity={0.8} />
                            <pointLight position={[10, 10, 10]} />
                            <BrandOrb scale={1} />
                        </Canvas>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-bold">YOU</span>
                    </div>
                </div>
            </motion.div>

            {/* BrandOrbs */}
            {orbs.length > 0 ? orbs.map((orb, i) => (
                <motion.div
                    key={orb.id}
                    className="absolute cursor-pointer z-20"
                    style={{
                        bottom: `${45 + (i % 3) * 12}%`,
                        left: `${25 + i * 18}%`
                    }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOrbClick && onOrbClick(orb)}
                >
                    <div className={`absolute -inset-4 rounded-full blur-xl ${orb.rarity === 'legendary' ? 'bg-yellow-400/70' :
                            orb.rarity === 'epic' ? 'bg-purple-400/70' :
                                orb.rarity === 'rare' ? 'bg-blue-400/70' : 'bg-green-400/70'
                        }`} />

                    <div className="relative w-16 h-16">
                        <div className="w-full h-full bg-white rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1/2 border-b-4 border-gray-900 ${orb.rarity === 'legendary' ? 'bg-gradient-to-b from-yellow-400 to-yellow-500' :
                                    orb.rarity === 'epic' ? 'bg-gradient-to-b from-purple-400 to-purple-500' :
                                        orb.rarity === 'rare' ? 'bg-gradient-to-b from-blue-400 to-blue-500' :
                                            'bg-gradient-to-b from-red-400 to-red-500'
                                }`} />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-gray-900 rounded-full z-10" />
                        </div>
                    </div>

                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded-full shadow-lg">
                        <span className="text-[10px] font-bold text-gray-900 uppercase">{orb.rarity}</span>
                    </div>
                </motion.div>
            )) : (
                // Demo orb
                <motion.div
                    className="absolute bottom-1/2 left-1/3 cursor-pointer z-20"
                    animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onOrbClick && onOrbClick({
                        id: 'demo',
                        type: 'brandorb',
                        position: { latitude: 0, longitude: 0 } as any,
                        brandId: 'demo',
                        campaignId: 'demo',
                        rarity: 'legendary',
                        xpReward: 500,
                        active: true,
                        spawnTime: new Date(),
                        collectedBy: []
                    })}
                >
                    <div className="absolute -inset-6 rounded-full bg-yellow-400/70 blur-2xl" />

                    <div className="relative w-20 h-20">
                        <div className="w-full h-full bg-white rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-400 to-yellow-500 border-b-4 border-gray-900" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-900 rounded-full z-10" />
                        </div>
                    </div>

                    <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-black text-white uppercase">Tap Me!</span>
                    </div>
                </motion.div>
            )}

            {/* Foreground grass */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex justify-around items-end">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full"
                        style={{ height: `${20 + Math.random() * 20}px` }}
                    />
                ))}
            </div>
        </div>
    );
}
