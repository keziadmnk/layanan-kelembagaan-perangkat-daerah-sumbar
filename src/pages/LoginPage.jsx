import { useState } from 'react';
import { Eye, EyeOff, Lock, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import kantorImage from '../assets/Masjid-Raya-Sumbar.jpg';

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
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Image with Navy Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative animate-fade-in">
        <img
          src={kantorImage}
          alt="Kantor Gubernur Sumbar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Navy Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/95 via-[#004080]/70 to-[#0066cc]/40"></div>
        
        {/* Animated Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/3 rounded-full blur-2xl animate-pulse-slow"></div>
        </div>
      </div>

      {/* Right Side - Login Form with Gradient Background */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        
        {/* Animated Decorative Gradient Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#003366]/5 to-blue-200/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/20 to-[#003366]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
        
        <div className="relative z-10 w-full max-w-md px-8">
          {/* Title Section - Above Login Card with slide-in animation */}
          <div className="text-center mb-8 animate-slide-down">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Sistem Pengajuan dan Tracking Layanan
            </h1>
            <p className="text-lg text-gray-600">
              Kelembagaan Provinsi Sumatera Barat
            </p>
          </div>

          {/* Login Card with fade-in animation */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100 animate-fade-in-up">

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-all duration-200 hover:border-gray-400"
                    placeholder="Masukkan username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-all duration-200 hover:border-gray-400"
                    placeholder="Masukkan password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-transform hover:scale-110 duration-200"
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

              {/* Submit Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#003366] to-[#0059b3] text-white py-3 rounded-lg font-semibold hover:from-[#002244] hover:to-[#004080] focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Masuk 
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer with fade-in animation */}
          <div className="mt-6 text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="font-medium">Biro Organisasi Setda Provinsi Sumbar</p>
            <p className="mt-1">© 2026 All Rights Reserved</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;