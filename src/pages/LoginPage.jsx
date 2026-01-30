import { useState } from 'react';
import { Eye, EyeOff, Lock, User, LogIn, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(username, password);

            if (response.success) {
                login(response.data.user, response.data.token);
                navigate('/dashboard', { replace: true });
            } else {
                throw new Error(response.message || 'Login gagal');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login gagal. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated floating shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
                <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title Section with slide-in animation */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                        <Building2 className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        Sistem Pengajuan dan Tracking Layanan Kelembagaan
                        <br />
                        <span className="text-2xl font-bold text-gray-900">Provinsi Sumatera Barat</span>
                    </h1>
                </div>

                {/* Login Card with fade-in animation */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in backdrop-blur-sm bg-white/95">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                                    placeholder="Masukkan username"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                                    placeholder="Masukkan password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-transform hover:scale-110"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    <span>Masuk ke Sistem</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer with fade-in animation */}
                <div className="text-center mt-8 animate-fade-in-delayed">
                    <p className="text-sm text-gray-600 font-medium">Biro Organisasi Setda Provinsi Sumbar</p>
                    <p className="text-xs text-gray-500 mt-2">&copy; 2026 All Rights Reserved</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(5deg); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-30px, 30px) rotate(-5deg); }
                    66% { transform: translate(20px, -20px) rotate(5deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -30px) scale(1.05); }
                }
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fade-in-delayed {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-float {
                    animation: float 12s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 15s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 18s ease-in-out infinite;
                }
                .animate-slide-down {
                    animation: slide-down 0.6s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out 0.2s both;
                }
                .animate-fade-in-delayed {
                    animation: fade-in-delayed 0.8s ease-out 0.4s both;
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
