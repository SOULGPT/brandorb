'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                if (!username) {
                    setError('Username is required');
                    setLoading(false);
                    return;
                }
                await signUp(email, password, username);
            }
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.orbBackground}>
                <div className={styles.floatingOrb}></div>
                <div className={styles.floatingOrb}></div>
                <div className={styles.floatingOrb}></div>
            </div>

            <div className={styles.authCard}>
                <div className={styles.logo}>
                    <div className={styles.brandOrb}>
                        <div className={styles.orbCore}></div>
                        <div className={styles.orbRing}></div>
                        <div className={styles.orbRing}></div>
                    </div>
                    <h1>BrandOrb</h1>
                    <p className={styles.tagline}>Discover brands. Unlock rewards. Explore your world.</p>
                </div>

                <div className={styles.authTabs}>
                    <button
                        className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            isLogin ? 'Login' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className={styles.googleBtn}
                    disabled={loading}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" />
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                    </svg>
                    Continue with Google
                </button>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.icon}>🗺️</span>
                        <span>Explore Real World</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.icon}>🎁</span>
                        <span>Unlock Rewards</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.icon}>📱</span>
                        <span>AR Experience</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
