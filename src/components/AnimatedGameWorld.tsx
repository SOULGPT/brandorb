"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import BrandOrb from './BrandOrb';
import { BrandOrb as BrandOrbType } from '@/lib/firebaseService';

interface AnimatedGameWorldProps {
    orbs: BrandOrbType[];
    onOrbClick?: (orb: BrandOrbType) => void;
}

export default function AnimatedGameWorld({ orbs, onOrbClick }: AnimatedGameWorldProps) {
    const [clouds, setClouds] = useState<Array<{ id: number; x: number; y: number; speed: number }>>([]);
    const [birds, setBirds] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        // Generate animated clouds
        const cloudArray = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 30,
            speed: 0.5 + Math.random() * 0.5
        }));
        setClouds(cloudArray);

        // Generate flying birds
        const birdArray = Array.from({ length: 3 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: 10 + Math.random() * 20
        }));
        setBirds(birdArray);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Animated Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200">
                {/* Animated Sun */}
                <motion.div
                    className="absolute top-10 right-20 w-24 h-24 rounded-full bg-yellow-300 shadow-2xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                            '0 0 60px 20px rgba(255, 220, 100, 0.8)',
                            '0 0 80px 30px rgba(255, 220, 100, 1)',
                            '0 0 60px 20px rgba(255, 220, 100, 0.8)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Animated Clouds */}
                {clouds.map((cloud) => (
                    <motion.div
                        key={cloud.id}
                        className="absolute"
                        style={{ top: `${cloud.y}%`, left: `${cloud.x}%` }}
                        animate={{
                            x: ['0vw', '100vw'],
                        }}
                        transition={{
                            duration: 60 / cloud.speed,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    >
                        <div className="relative">
                            <div className="w-16 h-10 bg-white/80 rounded-full blur-sm"></div>
                            <div className="absolute top-2 left-4 w-20 h-12 bg-white/80 rounded-full blur-sm"></div>
                            <div className="absolute top-1 left-10 w-14 h-8 bg-white/80 rounded-full blur-sm"></div>
                        </div>
                    </motion.div>
                ))}

                {/* Flying Birds */}
                {birds.map((bird) => (
                    <motion.div
                        key={bird.id}
                        className="absolute text-2xl"
                        style={{ top: `${bird.y}%`, left: `${bird.x}%` }}
                        animate={{
                            x: ['0vw', '120vw'],
                            y: [0, -20, 0, 20, 0]
                        }}
                        transition={{
                            x: { duration: 25, repeat: Infinity, ease: 'linear' },
                            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                        }}
                    >
                        🦅
                    </motion.div>
                ))}
            </div>

            {/* Animated Ground Layer */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3">
                {/* Grass Pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-300 to-emerald-500">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px),
                repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)
              `
                        }}
                        animate={{
                            backgroundPosition: ['0px 0px', '40px 40px']
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* Animated Trees */}
                <motion.div
                    className="absolute bottom-20 left-1/4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <div className="text-6xl">🌳</div>
                </motion.div>
                <motion.div
                    className="absolute bottom-32 right-1/3"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                >
                    <div className="text-5xl">🌲</div>
                </motion.div>
                <motion.div
                    className="absolute bottom-16 right-1/4"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                >
                    <div className="text-7xl">🌳</div>
                </motion.div>

                {/* Animated Flowers */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-3xl"
                        style={{
                            bottom: `${20 + Math.random() * 40}%`,
                            left: `${10 + i * 10}%`
                        }}
                        animate={{
                            rotate: [-5, 5, -5],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    >
                        {['🌸', '🌺', '🌻', '🌼'][i % 4]}
                    </motion.div>
                ))}

                {/* Animated Butterflies */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-2xl"
                        style={{
                            bottom: `${30 + Math.random() * 30}%`,
                            left: `${Math.random() * 100}%`
                        }}
                        animate={{
                            x: [0, 100, -50, 0],
                            y: [0, -50, 50, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        🦋
                    </motion.div>
                ))}
            </div>

            {/* Animated Path/Road */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                    background: 'linear-gradient(to bottom, rgba(139, 69, 19, 0.6), rgba(101, 67, 33, 0.8))',
                    clipPath: 'polygon(30% 0%, 70% 0%, 80% 100%, 20% 100%)'
                }}
            >
                <motion.div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(255,255,255,0.3) 50px,
              rgba(255,255,255,0.3) 60px
            )`
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '110px 0px']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
            </motion.div>

            {/* Player Avatar - Center */}
            <motion.div
                className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-30"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                <div className="relative">
                    {/* Glowing Ring */}
                    <motion.div
                        className="absolute -inset-4 rounded-full bg-cyan-400/30 blur-xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* 3D Avatar Orb */}
                    <div className="w-24 h-24 relative">
                        <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
                            <ambientLight intensity={0.8} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <BrandOrb scale={1.2} />
                        </Canvas>
                    </div>

                    {/* Player Name Tag */}
                    <motion.div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-1 rounded-full"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-white text-sm font-bold">YOU</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* BrandOrbs on Map */}
            <AnimatePresence>
                {orbs.map((orb, index) => (
                    <motion.div
                        key={orb.id}
                        className="absolute cursor-pointer z-20"
                        style={{
                            bottom: `${40 + (index % 3) * 15}%`,
                            left: `${20 + index * 20}%`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: [0, -20, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            scale: { duration: 0.5 },
                            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onOrbClick && onOrbClick(orb)}
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className={`absolute -inset-6 rounded-full blur-2xl ${orb.rarity === 'legendary' ? 'bg-yellow-400/60' :
                                    orb.rarity === 'epic' ? 'bg-purple-400/60' :
                                        orb.rarity === 'rare' ? 'bg-blue-400/60' : 'bg-green-400/60'
                                }`}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.6, 1, 0.6]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Pokéball Style Orb */}
                        <div className="relative w-20 h-20">
                            <div className="w-full h-full bg-white rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1/2 border-b-4 border-gray-900 ${orb.rarity === 'legendary' ? 'bg-gradient-to-b from-yellow-400 to-yellow-500' :
                                        orb.rarity === 'epic' ? 'bg-gradient-to-b from-purple-400 to-purple-500' :
                                            orb.rarity === 'rare' ? 'bg-gradient-to-b from-blue-400 to-blue-500' :
                                                'bg-gradient-to-b from-red-400 to-red-500'
                                    }`}></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-900 rounded-full z-10 shadow-lg"></div>
                            </div>

                            {/* Sparkles */}
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-yellow-300 text-xl"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                >
                                    ✨
                                </motion.div>
                            ))}
                        </div>

                        {/* Orb Label */}
                        <motion.div
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-xs font-bold text-gray-900 uppercase">{orb.rarity}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Demo Orb if no real orbs */}
            {orbs.length === 0 && (
                <motion.div
                    className="absolute bottom-1/2 left-1/3 cursor-pointer z-20"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
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
                    <motion.div
                        className="absolute -inset-8 rounded-full bg-yellow-400/60 blur-2xl"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative w-24 h-24">
                        <div className="w-full h-full bg-white rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-400 to-yellow-500 border-b-4 border-gray-900"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-gray-900 rounded-full z-10 shadow-lg"></div>
                        </div>

                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-yellow-300 text-2xl"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`
                                }}
                                animate={{
                                    scale: [0, 1.5, 0],
                                    rotate: [0, 180, 360],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            >
                                ✨
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full shadow-lg"
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(251, 191, 36, 0.5)',
                                '0 0 40px rgba(251, 191, 36, 1)',
                                '0 0 20px rgba(251, 191, 36, 0.5)'
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-sm font-black text-white uppercase">Tap Me!</span>
                    </motion.div>
                </motion.div>
            )}

            {/* Animated Grass Blades in Foreground */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bottom-0 w-2 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full"
                        style={{
                            left: `${i * 5}%`,
                            height: `${30 + Math.random() * 30}px`
                        }}
                        animate={{
                            rotate: [-2, 2, -2],
                            scaleY: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
