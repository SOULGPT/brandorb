'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getAntiCheatLogs, AntiCheatLog, banUser } from '@/lib/firebaseService';
import { FaUserShield, FaExclamationTriangle, FaBan, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboard() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState<AntiCheatLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<AntiCheatLog | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }

        // In a real app, check if user has 'admin' role
        // if (userProfile?.role !== 'admin') {
        //   router.push('/');
        // }

        loadLogs();
    }, [user, router]);

    const loadLogs = async () => {
        const antiCheatLogs = await getAntiCheatLogs();
        setLogs(antiCheatLogs);
    };

    const handleBanUser = async (userId: string, reason: string) => {
        if (confirm('Are you sure you want to ban this user? This action cannot be undone.')) {
            await banUser(userId, reason);
            alert('User has been banned.');
            loadLogs();
            setSelectedLog(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            Admin Control Center
                        </h1>
                        <p className="text-gray-400">System monitoring and anti-cheat enforcement</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm font-bold">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Logs List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FaUserShield className="text-cyan-400" />
                                    Security Logs
                                </h2>
                                <span className="text-sm text-gray-500">{logs.length} events detected</span>
                            </div>

                            <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
                                {logs.map(log => (
                                    <div
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className={`p-4 hover:bg-gray-700/50 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-gray-700/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${log.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                        log.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    <FaExclamationTriangle />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm uppercase tracking-wider text-gray-300">{log.type.replace('_', ' ')}</div>
                                                    <div className="text-xs text-gray-500">{log.timestamp?.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${log.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                                                    log.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {log.severity}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 pl-11">
                                            User ID: <span className="font-mono text-gray-300">{log.userId}</span>
                                        </div>
                                    </div>
                                ))}

                                {logs.length === 0 && (
                                    <div className="p-12 text-center text-gray-500">
                                        <FaCheckCircle className="text-4xl mx-auto mb-4 text-green-500/20" />
                                        <p>No security incidents detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-1">
                        {selectedLog ? (
                            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sticky top-8">
                                <h3 className="text-xl font-bold mb-6">Incident Details</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">Violation Type</label>
                                        <div className="text-lg font-bold text-white capitalize">{selectedLog.type.replace('_', ' ')}</div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">Severity</label>
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-1 ${selectedLog.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                selectedLog.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {selectedLog.severity.toUpperCase()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">User ID</label>
                                        <div className="font-mono text-sm bg-black/30 p-2 rounded border border-gray-700 mt-1">
                                            {selectedLog.userId}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">Technical Details</label>
                                        <pre className="text-xs bg-black/30 p-3 rounded border border-gray-700 mt-1 overflow-x-auto text-green-400 font-mono">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>

                                    <div className="pt-6 border-t border-gray-700">
                                        <button
                                            onClick={() => handleBanUser(selectedLog.userId, selectedLog.type)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <FaBan /> Ban User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-2xl p-12 text-center text-gray-500">
                                <p>Select a log entry to view details and take action.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
