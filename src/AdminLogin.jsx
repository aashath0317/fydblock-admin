// src/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Loader2, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import API_BASE_URL from './config';

const AdminLogin = () => {
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- 1. HANDLE MANUAL LOGIN ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Ideally, you should verify if the user has 'admin' role here or via a separate API call
                // For now, we assume if they can login, we let them in, and the API middleware will block non-admins
                localStorage.setItem('token', data.token);
                setSuccess('Welcome back, Admin.');
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server connection error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. HANDLE GOOGLE LOGIN ---
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    setSuccess('Google Auth Successful');
                    setTimeout(() => navigate('/dashboard'), 1000);
                } else {
                    setError(data.message || 'Google Auth Failed');
                }
            } catch (err) {
                setError('Connection failed during Google Auth');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <div className="min-h-screen bg-[#020506] text-white font-sans flex items-center justify-center relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vh] bg-[#00FF9D]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] bg-[#00FF9D]/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-md bg-[#080D0F] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#00FF9D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#00FF9D] border border-[#00FF9D]/20">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-2">Secure access for FydBlock Administrators</p>
                </div>

                {/* Error / Success Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                        <CheckCircle className="text-[#00FF9D] shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-green-200">{success}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FF9D] transition-all"
                            placeholder="admin@fydblock.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FF9D] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Access Dashboard'}
                    </button>
                </form>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <span className="relative bg-[#080D0F] px-4 text-xs text-gray-500 font-bold uppercase">Or continue with</span>
                </div>

                <button
                    onClick={() => handleGoogleLogin()}
                    disabled={isLoading}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-all"
                >
                    <GoogleIcon />
                    <span>Google Admin Access</span>
                </button>
            </div>
        </div>
    );
};

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default AdminLogin;
