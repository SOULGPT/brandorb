'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function ProfilePage() {
    const { user, userProfile, refreshProfile } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'missions'>('stats');

    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
    }, [user, router]);

    if (!userProfile) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    const progressToNextLevel = (userProfile.xp % 100);
    const nextLevelXP = 100;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.push('/')}>
                    ← Back to Map
                </button>
                <button className={styles.logoutBtn} onClick={() => router.push('/auth')}>
                    Logout
                </button>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt={userProfile.username} />
                        ) : (
                            <div className={styles.defaultAvatar}>
                                {userProfile.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={styles.levelBadge}>
                            Lv {userProfile.level}
                        </div>
                    </div>
                    <h1>{userProfile.username}</h1>
                    <p className={styles.email}>{userProfile.email}</p>
                </div>

                <div className={styles.xpBar}>
                    <div className={styles.xpInfo}>
                        <span>XP: {userProfile.xp}</span>
                        <span>Next Level: {nextLevelXP - progressToNextLevel} XP</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progress}
                            style={{ width: `${progressToNextLevel}%` }}
                        ></div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🔥</div>
                        <div className={styles.statValue}>{userProfile.streak}</div>
                        <div className={styles.statLabel}>Day Streak</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>⭐</div>
                        <div className={styles.statValue}>{userProfile.xp}</div>
                        <div className={styles.statLabel}>Total XP</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🎁</div>
                        <div className={styles.statValue}>{userProfile.inventory.length}</div>
                        <div className={styles.statLabel}>Rewards</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>✅</div>
                        <div className={styles.statValue}>{userProfile.completedMissions.length}</div>
                        <div className={styles.statLabel}>Missions</div>
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Statistics
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'inventory' ? styles.active : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'missions' ? styles.active : ''}`}
                    onClick={() => setActiveTab('missions')}
                >
                    Missions
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'stats' && (
                    <div className={styles.statsContent}>
                        <h2>Your Journey</h2>
                        <div className={styles.achievementsList}>
                            <div className={styles.achievement}>
                                <span className={styles.achievementIcon}>🗺️</span>
                                <div>
                                    <h3>Explorer</h3>
                                    <p>Visited {userProfile.visitedLocations.length} locations</p>
                                </div>
                            </div>
                            <div className={styles.achievement}>
                                <span className={styles.achievementIcon}>🎯</span>
                                <div>
                                    <h3>Mission Master</h3>
                                    <p>Completed {userProfile.completedMissions.length} missions</p>
                                </div>
                            </div>
                            <div className={styles.achievement}>
                                <span className={styles.achievementIcon}>💎</span>
                                <div>
                                    <h3>Collector</h3>
                                    <p>Collected {userProfile.inventory.length} rewards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className={styles.inventoryContent}>
                        <h2>Your Rewards</h2>
                        {userProfile.inventory.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📦</div>
                                <p>No rewards yet!</p>
                                <p className={styles.emptyHint}>Explore the map and collect BrandOrbs to earn rewards</p>
                            </div>
                        ) : (
                            <div className={styles.rewardGrid}>
                                {userProfile.inventory.map((rewardId, index) => (
                                    <div key={index} className={styles.rewardCard}>
                                        <div className={styles.rewardIcon}>🎁</div>
                                        <h3>Reward #{index + 1}</h3>
                                        <p className={styles.rewardId}>{rewardId.substring(0, 8)}...</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'missions' && (
                    <div className={styles.missionsContent}>
                        <h2>Completed Missions</h2>
                        {userProfile.completedMissions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🎯</div>
                                <p>No missions completed yet!</p>
                                <p className={styles.emptyHint}>Check the map for available missions</p>
                            </div>
                        ) : (
                            <div className={styles.missionsList}>
                                {userProfile.completedMissions.map((missionId, index) => (
                                    <div key={index} className={styles.missionCard}>
                                        <div className={styles.missionIcon}>✅</div>
                                        <div>
                                            <h3>Mission Completed</h3>
                                            <p className={styles.missionId}>{missionId}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
