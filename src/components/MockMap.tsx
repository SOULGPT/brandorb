"use client";
import React from 'react';

export default function MockMap() {
    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #90EE90 100%)'
        }}>
            {/* Animated Grid Pattern - Like Pokémon GO */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridMove 20s linear infinite'
                }}
            />

            {/* Roads */}
            <div className="absolute top-1/4 left-0 right-0 h-16 bg-gray-400/40 transform -rotate-3"></div>
            <div className="absolute bottom-1/3 left-0 right-0 h-12 bg-gray-400/30 transform rotate-2"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-20 bg-gray-400/30 transform skew-y-3"></div>

            {/* Buildings/Landmarks */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-red-400/60 rounded-lg shadow-lg"></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-20 bg-blue-400/60 rounded-lg shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-yellow-400/60 rounded-full shadow-lg"></div>

            {/* Parks/Green Areas */}
            <div className="absolute top-1/3 left-1/6 w-32 h-32 bg-green-500/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-green-500/25 rounded-full blur-sm"></div>

            {/* Water */}
            <div className="absolute top-0 right-0 w-48 h-full bg-blue-400/20 blur-2xl transform skew-x-12"></div>

            <style jsx>{`
                @keyframes gridMove {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(50px, 50px);
                    }
                }
            `}</style>
        </div>
    );
}
