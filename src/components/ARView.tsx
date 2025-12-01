"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import BrandOrb from './BrandOrb';
import { IoMdClose } from 'react-icons/io';
import { BrandOrb as BrandOrbType } from '@/lib/firebaseService';

interface ARViewProps {
    onClose: () => void;
    onCapture: () => void;
    orb?: BrandOrbType;
}

export default function ARView({ onClose, onCapture, orb }: ARViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [captured, setCaptured] = useState(false);

    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setPermissionGranted(true);
                }
            } catch (err) {
                console.error("Camera permission denied or not available", err);
                setCameraError(true);
            }
        }
        startCamera();

        return () => {
            // Cleanup tracks
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        setCaptured(true);
        setTimeout(() => {
            onCapture();
        }, 1500);
    };

    // Fallback for no camera (Simulation Mode)
    const showFallback = cameraError || !permissionGranted;

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Camera Feed or Fallback */}
            {!showFallback ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                    <div className="text-white/20 text-4xl font-bold uppercase tracking-widest">AR Simulation</div>
                </div>
            )}

            {/* AR Overlay */}
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} />

                    {/* Floating BrandOrb to Capture */}
                    {!captured && (
                        <BrandOrb position={[0, 0, 0]} scale={1.5} />
                    )}
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                <div className="flex justify-end pointer-events-auto">
                    <button onClick={onClose} className="bg-black/50 p-3 rounded-full text-white backdrop-blur-md border border-white/20">
                        <IoMdClose size={24} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 pointer-events-auto">
                    <div className="text-white text-center drop-shadow-md">
                        <h2 className="text-xl font-bold neon-text-blue">
                            {orb ? `${orb.rarity.toUpperCase()} ORB` : 'BrandOrb Detected!'}
                        </h2>
                        <p className="text-sm opacity-80">
                            {captured ? 'Capturing...' : 'Tap the button to capture'}
                        </p>
                    </div>

                    <button
                        onClick={handleCapture}
                        disabled={captured}
                        className={`w-20 h-20 rounded-full border-4 border-white/50 bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform ${captured ? 'scale-0 opacity-0' : ''}`}
                    >
                        <div className="w-14 h-14 bg-white rounded-full"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
