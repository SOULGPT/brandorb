"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import BrandOrb from './BrandOrb';
import MockMap from './MockMap';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function GameMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-0.09);
    const [lat, setLat] = useState(51.505);
    const [zoom, setZoom] = useState(17);

    useEffect(() => {
        if (!TOKEN) return;
        if (map.current) return; // initialize map only once

        mapboxgl.accessToken = TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
            pitch: 60,
            bearing: -20,
        });

        // Add Avatar Marker
        const el = document.createElement('div');
        el.className = 'avatar-marker';
        el.style.width = '64px';
        el.style.height = '64px';

        // We can render React component into this DOM element
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

        // Add Brand Node Marker
        const brandEl = document.createElement('div');
        brandEl.innerHTML = `
      <div class="flex flex-col items-center cursor-pointer group">
         <div class="bg-purple-600 p-2 rounded-lg text-white text-xs font-bold mb-1 opacity-100">
           Mystery Brand
         </div>
         <div style="font-size: 30px; color: #bc13fe; filter: drop-shadow(0 0 5px #bc13fe);">
           📍
         </div>
      </div>
    `;
        new mapboxgl.Marker(brandEl)
            .setLngLat([-0.091, 51.506])
            .addTo(map.current);

    }, [lng, lat, zoom]);

    // If no token, use the Mock Map for a guaranteed visual
    if (!TOKEN) {
        return (
            <div className="relative w-full h-full">
                <MockMap />

                {/* Simulated Markers for Demo */}
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

                    {/* Brand Orb Marker */}
                    <div className="absolute top-1/3 left-1/3 flex flex-col items-center animate-bounce">
                        <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
                            <div className="w-4 h-4 bg-white border-4 border-gray-800 rounded-full z-10"></div>
                        </div>
                        <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold mt-1 shadow-md text-black">BRAND ORB</div>
                    </div>

                    {/* Reward Marker */}
                    <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                        <div className="text-4xl drop-shadow-lg filter">🎁</div>
                        <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold mt-1 shadow-md text-black">REWARD</div>
                    </div>

                    {/* Clue Marker */}
                    <div className="absolute top-1/2 right-1/6 flex flex-col items-center">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white font-bold text-xl">?</div>
                        <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold mt-1 shadow-md text-black">CLUE</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={mapContainer} className="w-full h-full" />
    );
}
