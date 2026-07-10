import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import provSumbarLogo from '../../assets/prov-sumbar.png';

const AdminTopBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch {
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <header className="menu-layanan-header">
            <div className="menu-layanan-header-inner">
                <div className="menu-layanan-logo">
                    <img src={provSumbarLogo} alt="Logo Pemprov Sumbar" className="menu-layanan-logo-img" />
                    <div className="menu-layanan-logo-text">
                        <div className="menu-layanan-logo-divider" />
                        <div>
                            <h1 className="menu-layanan-logo-title">LENTERA</h1>
                            <p className="menu-layanan-logo-subtitle">Layanan Terpadu Kelembagaan Kabupaten/Kota</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 lg:pl-4 border-l border-gray-200 hover:bg-navy-50 rounded-r-lg transition-all p-2"
                            aria-expanded={showUserMenu}
                            aria-haspopup="true"
                        >
                            <div className="text-right hidden lg:block">
                                <p className="text-xs lg:text-sm font-bold text-gray-900 truncate max-w-[150px] xl:max-w-[200px]">
                                    {user?.kabupaten_kota || user?.username}
                                </p>
                                <p className="text-xs text-gray-600 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-navy-600 rounded-full flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-medium text-sm text-gray-900">
                                            {user?.kabupaten_kota || user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-medium text-sm">Keluar</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTopBar;
