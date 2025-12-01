'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createCampaign, getActiveCampaigns, Campaign } from '@/lib/firebaseService';
import { FaPlus, FaChartLine, FaMapMarkerAlt, FaGift } from 'react-icons/fa';

export default function BrandDashboard() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        description: '',
        budget: 1000,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }

        // In a real app, check if user has 'brand' role
        // if (userProfile?.role !== 'brand') {
        //   router.push('/');
        // }

        loadCampaigns();
    }, [user, router]);

    const loadCampaigns = async () => {
        const activeCampaigns = await getActiveCampaigns();
        // Filter for this brand's campaigns in a real app
        setCampaigns(activeCampaigns);
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await createCampaign(user.uid, {
                name: newCampaign.name,
                description: newCampaign.description,
                budget: Number(newCampaign.budget),
                startDate: new Date(newCampaign.startDate),
                endDate: new Date(newCampaign.endDate),
                clueChain: [],
                rewards: [],
                targetLocations: []
            });
            setShowCreateModal(false);
            loadCampaigns();
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Brand Dashboard
                        </h1>
                        <p className="text-gray-400">Manage your AR marketing campaigns</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                        <FaPlus /> New Campaign
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <FaChartLine size={24} />
                            </div>
                            <span className="text-gray-400">Total Impressions</span>
                        </div>
                        <div className="text-3xl font-bold">12,450</div>
                        <div className="text-green-400 text-sm mt-1">↑ 12% this week</div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <span className="text-gray-400">Active Locations</span>
                        </div>
                        <div className="text-3xl font-bold">48</div>
                        <div className="text-gray-500 text-sm mt-1">Across 3 cities</div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                                <FaGift size={24} />
                            </div>
                            <span className="text-gray-400">Rewards Claimed</span>
                        </div>
                        <div className="text-3xl font-bold">856</div>
                        <div className="text-green-400 text-sm mt-1">94% redemption rate</div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                                <span className="text-xl font-bold">$</span>
                            </div>
                            <span className="text-gray-400">Budget Spent</span>
                        </div>
                        <div className="text-3xl font-bold">$4,200</div>
                        <div className="text-gray-500 text-sm mt-1">of $10,000 limit</div>
                    </div>
                </div>

                {/* Active Campaigns */}
                <h2 className="text-xl font-bold mb-4">Active Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{campaign.name}</h3>
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">ACTIVE</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{campaign.description}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Impressions</span>
                                    <span className="font-bold">{campaign.analytics.impressions}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                                    <span className="text-gray-500">Ends</span>
                                    <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                            <FaPlus className="text-gray-600 group-hover:text-cyan-400 text-2xl" />
                        </div>
                        <span className="font-bold text-gray-500 group-hover:text-gray-300">Create New Campaign</span>
                    </button>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
                        <form onSubmit={handleCreateCampaign} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:border-cyan-500 outline-none"
                                    value={newCampaign.name}
                                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:border-cyan-500 outline-none h-24"
                                    value={newCampaign.description}
                                    onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:border-cyan-500 outline-none"
                                        value={newCampaign.startDate}
                                        onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:border-cyan-500 outline-none"
                                        value={newCampaign.endDate}
                                        onChange={e => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Budget ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="100"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:border-cyan-500 outline-none"
                                    value={newCampaign.budget}
                                    onChange={e => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Create Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
