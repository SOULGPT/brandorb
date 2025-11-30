"use client";
import React from 'react';
import { FaChartLine, FaPlus, FaMapMarkedAlt, FaGem } from 'react-icons/fa';

export default function BrandDashboard() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8">
                <div className="text-2xl font-bold neon-text-blue tracking-tighter">
                    BrandOrb <span className="text-xs text-white opacity-50 font-normal">BUSINESS</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <NavItem icon={<FaChartLine />} label="Overview" active />
                    <NavItem icon={<FaMapMarkedAlt />} label="Campaign Map" />
                    <NavItem icon={<FaGem />} label="My Rewards" />
                    <NavItem icon={<FaPlus />} label="Create Campaign" />
                </nav>

                <div className="mt-auto p-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-300 mb-2">Current Balance</div>
                    <div className="text-xl font-bold text-white">$4,250.00</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Campaign Overview</h1>
                        <p className="text-gray-400">Welcome back, Nike Inc.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <FaPlus /> New Drop
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Total Impressions" value="1.2M" change="+12%" color="cyan" />
                    <StatCard label="Orbs Collected" value="45.3K" change="+8%" color="purple" />
                    <StatCard label="Redemption Rate" value="24%" change="-2%" color="pink" />
                </div>

                {/* Active Campaigns Table */}
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-6">Active Campaigns</h3>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="py-4">Campaign Name</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Location</th>
                                <th className="py-4">Engagement</th>
                                <th className="py-4">Ends In</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <TableRow name="Summer Air Max Drop" status="Active" location="New York, NY" engagement="High" ends="2 Days" />
                            <TableRow name="Downtown Scavenger Hunt" status="Active" location="London, UK" engagement="Medium" ends="5 Days" />
                            <TableRow name="Flash Sale Friday" status="Scheduled" location="Global" engagement="-" ends="Starts in 24h" />
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </div>
    );
}

function StatCard({ label, value, change, color }: { label: string, value: string, change: string, color: string }) {
    const colorClass = color === 'cyan' ? 'text-cyan-400' : color === 'purple' ? 'text-purple-400' : 'text-pink-400';
    return (
        <div className="glass-panel p-6 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500 blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity`}></div>
            <div className="text-gray-400 text-sm mb-2">{label}</div>
            <div className="text-4xl font-bold text-white mb-2">{value}</div>
            <div className={`text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change} from last week</div>
        </div>
    );
}

function TableRow({ name, status, location, engagement, ends }: any) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="py-4 font-medium">{name}</td>
            <td className="py-4"><span className={`px-2 py-1 rounded text-xs ${status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{status}</span></td>
            <td className="py-4 text-gray-400">{location}</td>
            <td className="py-4 text-gray-400">{engagement}</td>
            <td className="py-4 text-gray-400">{ends}</td>
        </tr>
    );
}
