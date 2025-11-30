"use client";
import React from 'react';
import { FaUserShield, FaBan, FaGlobe, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <FaUserShield className="text-4xl text-red-500" />
                    <div>
                        <h1 className="text-3xl font-bold">Admin Command Center</h1>
                        <p className="text-gray-500">System Status: <span className="text-green-500">ONLINE</span></p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="bg-red-900/50 text-red-400 px-4 py-2 rounded border border-red-500/30 hover:bg-red-900/80">Emergency Stop</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <AdminCard title="Pending Brands" value="12" icon={<FaCheckCircle />} color="yellow" />
                <AdminCard title="Active Users" value="14,203" icon={<FaGlobe />} color="blue" />
                <AdminCard title="Flagged Accounts" value="5" icon={<FaBan />} color="red" />
                <AdminCard title="Total Revenue" value="$1.4M" icon={<FaUserShield />} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-4 text-red-400">Anti-Cheat Logs</h3>
                    <div className="space-y-2">
                        <LogEntry user="Spoofer_99" action="Teleport Detected" time="2m ago" severity="High" />
                        <LogEntry user="SpeedyG" action="Speed Limit Exceeded" time="5m ago" severity="Medium" />
                        <LogEntry user="BotFarm1" action="Multiple Logins" time="12m ago" severity="High" />
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-4 text-yellow-400">Brand Approvals</h3>
                    <div className="space-y-2">
                        <ApprovalEntry brand="Coca-Cola Summer" type="Campaign" time="1h ago" />
                        <ApprovalEntry brand="Local Coffee Shop" type="New Account" time="3h ago" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminCard({ title, value, icon, color }: any) {
    return (
        <div className={`bg-gray-900 border border-${color}-500/30 p-6 rounded-xl flex items-center justify-between`}>
            <div>
                <div className="text-gray-400 text-sm">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
            <div className={`text-${color}-500 text-2xl opacity-80`}>{icon}</div>
        </div>
    );
}

function LogEntry({ user, action, time, severity }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-3 rounded border-l-2 border-red-500">
            <div>
                <div className="font-bold text-sm">{user}</div>
                <div className="text-xs text-gray-400">{action}</div>
            </div>
            <div className="text-xs text-red-400 font-mono">{time}</div>
        </div>
    );
}

function ApprovalEntry({ brand, type, time }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-3 rounded border-l-2 border-yellow-500">
            <div>
                <div className="font-bold text-sm">{brand}</div>
                <div className="text-xs text-gray-400">{type}</div>
            </div>
            <div className="flex gap-2">
                <button className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded">Approve</button>
                <button className="text-xs bg-red-900 text-red-400 px-2 py-1 rounded">Deny</button>
            </div>
        </div>
    );
}
