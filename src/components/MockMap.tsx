"use client";
import React from 'react';
import { FaGift, FaQuestion, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';

export default function MockMap() {
    return (
        <div className="w-full h-full bg-[#aaddaa] relative overflow-hidden">
            {/* CSS Pattern to simulate map roads */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.8) 2px, transparent 2px)
          `,
                    backgroundSize: '100px 100px',
                    transform: 'perspective(500px) rotateX(20deg) scale(1.5)'
                }}
            />

            {/* River */}
            <div className="absolute top-0 right-0 w-32 h-full bg-blue-300/50 blur-xl transform skew-x-12"></div>

            {/* Random Map Elements */}
            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-green-600/20 rounded-full blur-md"></div>
            <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-green-600/20 rounded-full blur-md"></div>

        </div>
    );
}
