import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    GeoPoint,
    addDoc,
    increment
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    User
} from 'firebase/auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface UserProfile {
    uid: string;
    username: string;
    email: string;
    avatar?: string;
    xp: number;
    level: number;
    streak: number;
    lastLoginDate: Date;
    createdAt: Date;
    role: 'user' | 'brand' | 'admin';
    inventory: string[]; // reward IDs
    visitedLocations: GeoPoint[];
    completedMissions: string[];
}

export interface BrandOrb {
    id: string;
    type: 'brandorb' | 'reward_box' | 'discount_coin' | 'mystery_clue' | 'brand_node';
    position: GeoPoint;
    brandId: string;
    campaignId: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    active: boolean;
    spawnTime: Date;
    expiryTime?: Date;
    collectedBy: string[]; // user IDs
}

export interface Campaign {
    id: string;
    brandId: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    clueChain: Clue[];
    rewards: Reward[];
    targetLocations: GeoPoint[];
    active: boolean;
    analytics: CampaignAnalytics;
}

export interface Clue {
    id: string;
    type: 'riddle' | 'location' | 'qr' | 'ar_scan' | 'photo';
    question: string;
    answer?: string;
    location?: GeoPoint;
    imageUrl?: string;
    arObjectUrl?: string;
    xpReward: number;
    order: number;
}

export interface Reward {
    id: string;
    type: 'discount_code' | 'qr_coupon' | 'gift_box' | 'brand_points';
    title: string;
    description: string;
    value: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    imageUrl?: string;
    expiryDate?: Date;
    redemptionLimit: number;
    redeemedCount: number;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    type: 'daily' | 'weekly' | 'timed' | 'special';
    xpReward: number;
    requirements: {
        type: string;
        target: number;
        current: number;
    }[];
    expiryDate?: Date;
    active: boolean;
}

export interface CampaignAnalytics {
    impressions: number;
    clueCompletions: number;
    rewardRedemptions: number;
    uniqueUsers: number;
    costPerEngagement: number;
    heatmapData: { location: GeoPoint; count: number }[];
}

export interface AntiCheatLog {
    id: string;
    userId: string;
    type: 'gps_spoof' | 'teleport' | 'speed_violation' | 'root_detected' | 'fraud';
    timestamp: Date;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionTaken?: string;
}

export interface UserProgress {
    userId: string;
    campaignId: string;
    cluesCompleted: string[];
    rewardsEarned: string[];
    currentStep: number;
    startedAt: Date;
    completedAt?: Date;
}

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        email,
        xp: 0,
        level: 1,
        streak: 0,
        lastLoginDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        role: 'user',
        inventory: [],
        visitedLocations: [],
        completedMissions: []
    });

    return user;
};

export const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update last login
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginDate: Timestamp.now()
    });

    return userCredential.user;
};

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));

    if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            username: result.user.displayName || 'User',
            email: result.user.email,
            avatar: result.user.photoURL,
            xp: 0,
            level: 1,
            streak: 0,
            lastLoginDate: Timestamp.now(),
            createdAt: Timestamp.now(),
            role: 'user',
            inventory: [],
            visitedLocations: [],
            completedMissions: []
        });
    } else {
        // Update last login
        await updateDoc(doc(db, 'users', result.user.uid), {
            lastLoginDate: Timestamp.now()
        });
    }

    return result.user;
};

export const signOut = async () => {
    await firebaseSignOut(auth);
};

// ============================================
// USER SERVICES
// ============================================

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const updateUserXP = async (uid: string, xpGain: number) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const currentXP = userDoc.data().xp || 0;
        const currentLevel = userDoc.data().level || 1;
        const newXP = currentXP + xpGain;

        // Calculate new level (100 XP per level)
        const newLevel = Math.floor(newXP / 100) + 1;

        await updateDoc(userRef, {
            xp: newXP,
            level: newLevel
        });

        return { newXP, newLevel, leveledUp: newLevel > currentLevel };
    }
};

export const addToInventory = async (uid: string, rewardId: string) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const inventory = userDoc.data().inventory || [];
        await updateDoc(userRef, {
            inventory: [...inventory, rewardId]
        });
    }
};

export const updateStreak = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const lastLogin = userDoc.data().lastLoginDate?.toDate();
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = userDoc.data().streak || 0;

        if (daysDiff === 1) {
            // Consecutive day
            newStreak += 1;
        } else if (daysDiff > 1) {
            // Streak broken
            newStreak = 1;
        }

        await updateDoc(userRef, {
            streak: newStreak,
            lastLoginDate: Timestamp.now()
        });

        return newStreak;
    }
};

// ============================================
// BRANDORB SERVICES
// ============================================

export const getNearbyBrandOrbs = async (
    userLocation: { lat: number; lng: number },
    radiusKm: number = 1
): Promise<BrandOrb[]> => {
    // In a real app, you'd use geohashing or GeoFirestore
    // For now, we'll get all active orbs and filter client-side
    const orbsRef = collection(db, 'brandOrbs');
    const q = query(orbsRef, where('active', '==', true));
    const snapshot = await getDocs(q);

    const orbs: BrandOrb[] = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        orbs.push({
            id: doc.id,
            ...data,
            spawnTime: data.spawnTime?.toDate(),
            expiryTime: data.expiryTime?.toDate()
        } as BrandOrb);
    });

    // Filter by distance (simplified)
    return orbs.filter(orb => {
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            orb.position.latitude,
            orb.position.longitude
        );
        return distance <= radiusKm;
    });
};

export const collectBrandOrb = async (orbId: string, userId: string) => {
    const orbRef = doc(db, 'brandOrbs', orbId);
    const orbDoc = await getDoc(orbRef);

    if (orbDoc.exists()) {
        const orb = orbDoc.data() as BrandOrb;

        // Check if already collected
        if (orb.collectedBy?.includes(userId)) {
            throw new Error('Already collected this BrandOrb');
        }

        // Add user to collected list
        await updateDoc(orbRef, {
            collectedBy: [...(orb.collectedBy || []), userId]
        });

        // Award XP
        await updateUserXP(userId, orb.xpReward);

        // Update analytics
        await updateCampaignAnalytics(orb.campaignId, 'impression');

        return orb;
    }

    throw new Error('BrandOrb not found');
};

export const spawnBrandOrb = async (orbData: Partial<BrandOrb>) => {
    const orbRef = collection(db, 'brandOrbs');
    const newOrb = await addDoc(orbRef, {
        ...orbData,
        active: true,
        spawnTime: Timestamp.now(),
        collectedBy: []
    });

    return newOrb.id;
};

// ============================================
// CAMPAIGN SERVICES
// ============================================

export const createCampaign = async (brandId: string, campaignData: Partial<Campaign>) => {
    const campaignRef = collection(db, 'campaigns');
    const newCampaign = await addDoc(campaignRef, {
        ...campaignData,
        brandId,
        active: true,
        analytics: {
            impressions: 0,
            clueCompletions: 0,
            rewardRedemptions: 0,
            uniqueUsers: 0,
            costPerEngagement: 0,
            heatmapData: []
        },
        createdAt: Timestamp.now()
    });

    return newCampaign.id;
};

export const getCampaign = async (campaignId: string): Promise<Campaign | null> => {
    const docRef = doc(db, 'campaigns', campaignId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate()
        } as Campaign;
    }
    return null;
};

export const getActiveCampaigns = async (): Promise<Campaign[]> => {
    const campaignsRef = collection(db, 'campaigns');
    const q = query(campaignsRef, where('active', '==', true));
    const snapshot = await getDocs(q);

    const campaigns: Campaign[] = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        campaigns.push({
            id: doc.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate()
        } as Campaign);
    });

    return campaigns;
};

export const updateCampaignAnalytics = async (
    campaignId: string,
    metric: 'impression' | 'clue_completion' | 'reward_redemption'
) => {
    const campaignRef = doc(db, 'campaigns', campaignId);

    const updateField =
        metric === 'impression' ? 'analytics.impressions' :
            metric === 'clue_completion' ? 'analytics.clueCompletions' :
                'analytics.rewardRedemptions';

    await updateDoc(campaignRef, {
        [updateField]: increment(1)
    });
};

// ============================================
// CLUE & MISSION SERVICES
// ============================================

export const validateClueAnswer = async (
    clueId: string,
    userAnswer: string,
    userId: string,
    campaignId: string
): Promise<boolean> => {
    const campaignDoc = await getDoc(doc(db, 'campaigns', campaignId));

    if (campaignDoc.exists()) {
        const campaign = campaignDoc.data() as Campaign;
        const clue = campaign.clueChain.find(c => c.id === clueId);

        if (clue && clue.answer) {
            const isCorrect = userAnswer.toLowerCase().trim() === clue.answer.toLowerCase().trim();

            if (isCorrect) {
                // Award XP
                await updateUserXP(userId, clue.xpReward);

                // Update progress
                await updateUserProgress(userId, campaignId, clueId);

                // Update analytics
                await updateCampaignAnalytics(campaignId, 'clue_completion');
            }

            return isCorrect;
        }
    }

    return false;
};

export const updateUserProgress = async (
    userId: string,
    campaignId: string,
    clueId: string
) => {
    const progressRef = doc(db, 'userProgress', `${userId}_${campaignId}`);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
        const progress = progressDoc.data();
        await updateDoc(progressRef, {
            cluesCompleted: [...(progress.cluesCompleted || []), clueId],
            currentStep: (progress.currentStep || 0) + 1
        });
    } else {
        await setDoc(progressRef, {
            userId,
            campaignId,
            cluesCompleted: [clueId],
            rewardsEarned: [],
            currentStep: 1,
            startedAt: Timestamp.now()
        });
    }
};

export const getUserProgress = async (
    userId: string,
    campaignId: string
): Promise<UserProgress | null> => {
    const progressRef = doc(db, 'userProgress', `${userId}_${campaignId}`);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
        const data = progressDoc.data();
        return {
            ...data,
            startedAt: data.startedAt?.toDate(),
            completedAt: data.completedAt?.toDate()
        } as UserProgress;
    }

    return null;
};

export const getDailyMissions = async (): Promise<Mission[]> => {
    const missionsRef = collection(db, 'missions');
    const q = query(
        missionsRef,
        where('type', '==', 'daily'),
        where('active', '==', true)
    );
    const snapshot = await getDocs(q);

    const missions: Mission[] = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        missions.push({
            id: doc.id,
            ...data,
            expiryDate: data.expiryDate?.toDate()
        } as Mission);
    });

    return missions;
};

// ============================================
// REWARD SERVICES
// ============================================

export const redeemReward = async (rewardId: string, userId: string, campaignId: string) => {
    const campaignRef = doc(db, 'campaigns', campaignId);
    const campaignDoc = await getDoc(campaignRef);

    if (campaignDoc.exists()) {
        const campaign = campaignDoc.data() as Campaign;
        const reward = campaign.rewards.find(r => r.id === rewardId);

        if (reward && reward.redeemedCount < reward.redemptionLimit) {
            // Add to user inventory
            await addToInventory(userId, rewardId);

            // Update redemption count
            const updatedRewards = campaign.rewards.map(r =>
                r.id === rewardId
                    ? { ...r, redeemedCount: r.redeemedCount + 1 }
                    : r
            );

            await updateDoc(campaignRef, {
                rewards: updatedRewards
            });

            // Update analytics
            await updateCampaignAnalytics(campaignId, 'reward_redemption');

            return reward;
        }
    }

    throw new Error('Reward not available');
};

// ============================================
// ANTI-CHEAT SERVICES
// ============================================

export const logAntiCheatEvent = async (
    userId: string,
    type: AntiCheatLog['type'],
    details: any,
    severity: AntiCheatLog['severity']
) => {
    const logRef = collection(db, 'antiCheatLogs');
    await addDoc(logRef, {
        userId,
        type,
        details,
        severity,
        timestamp: Timestamp.now()
    });

    // Auto-ban for critical violations
    if (severity === 'critical') {
        await updateDoc(doc(db, 'users', userId), {
            banned: true,
            banReason: type
        });
    }
};

export const validateMovement = async (
    userId: string,
    oldLocation: { lat: number; lng: number },
    newLocation: { lat: number; lng: number },
    timeDeltaSeconds: number
): Promise<boolean> => {
    const distance = calculateDistance(
        oldLocation.lat,
        oldLocation.lng,
        newLocation.lat,
        newLocation.lng
    );

    // Calculate speed in km/h
    const speed = (distance / timeDeltaSeconds) * 3600;

    // Max realistic speed: 120 km/h (car on highway)
    const MAX_SPEED = 120;

    if (speed > MAX_SPEED) {
        await logAntiCheatEvent(
            userId,
            'speed_violation',
            { distance, speed, timeDelta: timeDeltaSeconds },
            speed > MAX_SPEED * 2 ? 'critical' : 'high'
        );
        return false;
    }

    // Check for teleportation (instant movement > 1km)
    if (distance > 1 && timeDeltaSeconds < 5) {
        await logAntiCheatEvent(
            userId,
            'teleport',
            { distance, timeDelta: timeDeltaSeconds },
            'critical'
        );
        return false;
    }

    return true;
};

// ============================================
// ADMIN SERVICES
// ============================================

export const getAntiCheatLogs = async (maxLimit: number = 100): Promise<AntiCheatLog[]> => {
    const logsRef = collection(db, 'antiCheatLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(maxLimit));
    const snapshot = await getDocs(q);

    const logs: AntiCheatLog[] = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate()
        } as AntiCheatLog);
    });

    return logs;
};

export const banUser = async (userId: string, reason: string) => {
    await updateDoc(doc(db, 'users', userId), {
        banned: true,
        banReason: reason,
        bannedAt: Timestamp.now()
    });
};

export const approveCampaign = async (campaignId: string) => {
    await updateDoc(doc(db, 'campaigns', campaignId), {
        approved: true,
        active: true,
        approvedAt: Timestamp.now()
    });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
