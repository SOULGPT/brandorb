"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import BrandOrb from './BrandOrb';
import MockMap from './MockMap';
import { getNearbyBrandOrbs, BrandOrb as BrandOrbType } from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';
import { FaMap, FaGlobe } from 'react-icons/fa';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface GameMapProps {
    onOrbClick?: (orb: BrandOrbType) => void;
}

export default function GameMap({ onOrbClick }: GameMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-0.09);
    const [lat, setLat] = useState(51.505);
    const [zoom, setZoom] = useState(17);
    const [orbs, setOrbs] = useState<BrandOrbType[]>([]);
    const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
    const { user } = useAuth();
    const [useMockMap, setUseMockMap] = useState(true); // Default to Mock Map for immediate visibility
    const [mapError, setMapError] = useState(false);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);

                // Update map center if initialized
                if (map.current) {
                    map.current.flyTo({
                        center: [position.coords.longitude, position.coords.latitude],
                        essential: true
                    });
                }
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Fetch nearby orbs
    useEffect(() => {
        const fetchOrbs = async () => {
            try {
                const nearbyOrbs = await getNearbyBrandOrbs({ lat, lng });
                setOrbs(nearbyOrbs);
            } catch (error) {
                console.error("Error fetching orbs:", error);
            }
        };

        fetchOrbs();
        const interval = setInterval(fetchOrbs, 5000); // Refresh every 5s for testing
        return () => clearInterval(interval);
    }, [lat, lng]);

    useEffect(() => {
        if (useMockMap) return;
        if (!TOKEN) {
            setUseMockMap(true);
            return;
        }
        if (map.current) return; // initialize map only once

        try {
            mapboxgl.accessToken = TOKEN;

            map.current = new mapboxgl.Map({
                container: mapContainer.current!,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [lng, lat],
                zoom: zoom,
                pitch: 60,
                bearing: -20,
            });

            map.current.on('error', (e) => {
                console.error("Mapbox error:", e);
                setMapError(true);
                setUseMockMap(true); // Fallback on error
            });

            // Add Avatar Marker
            const el = document.createElement('div');
            el.className = 'avatar-marker';
            el.style.width = '64px';
            el.style.height = '64px';

            const root = createRoot(el);
            root.render(
                <div className="relative w-16 h-16 pointer-events-none">
                    <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-30 animate-ping"></div>
                    <div className="w-16 h-16">
                        <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
                            <ambientLight intensity={0.5} />
                            <BrandOrb scale={0.8} />
                        </Canvas>
                    </div>
                </div>
            );

            new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .addTo(map.current);

        } catch (err) {
            console.error("Failed to initialize map:", err);
            setUseMockMap(true);
        }

    }, [lng, lat, zoom, useMockMap]);

    // Update Orb Markers
    useEffect(() => {
        if (!map.current || useMockMap) return;

        // Add new markers
        orbs.forEach(orb => {
            if (!markersRef.current[orb.id]) {
                const el = document.createElement('div');
                el.className = 'orb-marker cursor-pointer hover:scale-110 transition-transform';
                el.style.width = '48px';
                el.style.height = '48px';

                el.addEventListener('click', () => {
                    if (onOrbClick) onOrbClick(orb);
                });

                const root = createRoot(el);
                root.render(
                    <div className="relative w-12 h-12">
                        <div className={`absolute inset-0 rounded-full opacity-50 animate-pulse ${orb.rarity === 'legendary' ? 'bg-yellow-500' :
                            orb.rarity === 'epic' ? 'bg-purple-500' :
                                orb.rarity === 'rare' ? 'bg-blue-500' : 'bg-green-500'
                            }`}></div>
                        <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
                            <ambientLight intensity={0.8} />
                            <BrandOrb scale={0.6} />
                        </Canvas>
                    </div>
                );

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([orb.position.longitude, orb.position.latitude]);

                if (map.current) {
                    marker.addTo(map.current);
                }

                markersRef.current[orb.id] = marker;
            }
        });

        // Remove old markers
        Object.keys(markersRef.current).forEach(id => {
            if (!orbs.find(o => o.id === id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

    }, [orbs, onOrbClick, useMockMap]);

    return (
        <div className="relative w-full h-full">
            {/* Map Toggle Button */}
            <div className="absolute top-24 right-4 z-50 flex flex-col gap-2">
                <button
                    onClick={() => setUseMockMap(!useMockMap)}
                    className="bg-black/60 backdrop-blur-md border border-white/20 p-3 rounded-full text-white shadow-lg hover:bg-black/80 transition-colors"
                    title={useMockMap ? "Switch to Real Map" : "Switch to Mock Map"}
                >
                    {useMockMap ? <FaGlobe size={20} /> : <FaMap size={20} />}
                </button>
            </div>

            {useMockMap ? (
                <div className="relative w-full h-full">
                    <MockMap />

                    {/* Simulated Markers for Demo/Mock Mode */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* User Avatar (Center) */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-30 animate-ping"></div>
                                <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
                                    <ambientLight intensity={0.5} />
                                    <BrandOrb scale={1} />
                                </Canvas>
                            </div>
                        </div>

                        {/* Render fetched orbs on mock map */}
                        {orbs.length > 0 ? orbs.map((orb, i) => (
                            <div key={orb.id}
                                className="absolute flex flex-col items-center animate-bounce pointer-events-auto cursor-pointer"
                                // Simple mock positioning logic for demo
                                style={{
                                    top: `${50 + (orb.position.latitude - lat) * 10000}%`,
                                    left: `${50 + (orb.position.longitude - lng) * 10000}%`
                                }}
                                onClick={() => onOrbClick && onOrbClick(orb)}
                            >
                                <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-full h-1/2 border-b-4 border-gray-800 ${orb.rarity === 'legendary' ? 'bg-yellow-500' :
                                        orb.rarity === 'epic' ? 'bg-purple-500' :
                                            orb.rarity === 'rare' ? 'bg-blue-500' : 'bg-red-500'
                                        }`}></div>
                                    <div className="w-4 h-4 bg-white border-4 border-gray-800 rounded-full z-10"></div>
                                </div>
                                <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold mt-1 shadow-md text-black">
                                    {orb.rarity.toUpperCase()}
                                </div>
                            </div>
                        )) : (
                            // Fallback demo orbs if no real ones found
                            <>
                                <div className="absolute top-1/3 left-1/3 flex flex-col items-center animate-bounce pointer-events-auto cursor-pointer"
                                    onClick={() => onOrbClick && onOrbClick({
                                        id: 'demo_orb',
                                        type: 'brandorb',
                                        position: { latitude: 0, longitude: 0 } as any,
                                        brandId: 'demo',
                                        campaignId: 'demo',
                                        rarity: 'common',
                                        xpReward: 100,
                                        active: true,
                                        spawnTime: new Date(),
                                        collectedBy: []
                                    })}
                                >
                                    <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
                                        <div className="w-4 h-4 bg-white border-4 border-gray-800 rounded-full z-10"></div>
                                    </div>
                                    <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold mt-1 shadow-md text-black">DEMO ORB</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div ref={mapContainer} className="w-full h-full bg-gray-900" />
            )}
        </div>
    );
}
