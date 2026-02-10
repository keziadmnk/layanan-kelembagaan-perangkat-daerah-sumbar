import { Menu, Bell, User, LogOut, UserCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { notifikasiAPI } from '../../services/api';
import provSumbarLogo from '../../assets/prov-sumbar.png';

const Header = ({ onToggleSidebar, userInfo, onLogout, showUserMenu, setShowUserMenu, sidebarOpen }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!userInfo?.id) return;

        try {
            const response = await notifikasiAPI.getUnreadCount(userInfo.id);
            if (response.success) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            // Silent fail - don't break the app if notification API is not available
            console.error('Error fetching unread count:', error);
            setUnreadCount(0);
        }
    }, [userInfo?.id]);

    useEffect(() => {
        if (userInfo?.id) {
            fetchUnreadCount();
            // Poll every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [userInfo?.id, fetchUnreadCount]);

    const handleProfileClick = () => {
        setShowUserMenu(false);
        navigate('/profile');
    };

    const handleNotificationClick = () => {
        // Set badge to 0 immediately for instant visual feedback
        // The actual mark-as-read happens in NotificationPage
        setUnreadCount(0);
        navigate('/notifikasi');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 text-gray-600 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all duration-300 flex-shrink-0"
                    >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <img
                            src={provSumbarLogo}
                            alt="Logo Pemprov Sumbar"
                            className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
                        />
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden sm:block w-[3px] h-10 sm:h-12 bg-gradient-to-b from-navy-600 to-yellow-600 rounded-full"></div>
                            <div>
                                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-navy-600 leading-tight tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    LENTERA
                                </h1>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-tight tracking-wider">
                                    Layanan Terpadu Kelembagaan Kabupaten/Kota
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={handleNotificationClick}
                        className="relative p-2 text-gray-600 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all flex-shrink-0"
                    >
                        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 sm:min-w-[18px] sm:h-[18px] bg-red-500 rounded-full text-white text-[10px] sm:text-xs flex items-center justify-center px-1 font-medium">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 lg:pl-4 border-l border-gray-200 hover:bg-navy-50 rounded-r-lg transition-all p-2"
                        >
                            <div className="text-right hidden lg:block">
                                <p className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-[150px] xl:max-w-[200px]">
                                    {userInfo.kabupaten_kota || userInfo.username}
                                </p>
                                <p className="text-xs text-gray-600 capitalize">
                                    {userInfo.role}
                                </p>
                            </div>
                            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-navy-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                                            {userInfo.kabupaten_kota || userInfo.username}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {userInfo.role}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full px-4 py-3 text-left hover:bg-navy-50 transition-all text-gray-700 flex items-center gap-2"
                                    >
                                        <UserCircle className="w-4 h-4" />
                                        <span className="font-medium text-sm">Lihat Profile</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            setShowUserMenu(false);
                                        }}
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

Header.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    showUserMenu: PropTypes.bool.isRequired,
    setShowUserMenu: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired
};

export default Header;

