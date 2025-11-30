'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    getUserProfile,
    updateStreak
} from '@/lib/firebaseService';
import type { UserProfile } from '@/lib/firebaseService';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string, username: string) => Promise<User>;
    signInWithGoogle: () => Promise<User>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                // Load user profile
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);

                // Update streak
                await updateStreak(user.uid);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
