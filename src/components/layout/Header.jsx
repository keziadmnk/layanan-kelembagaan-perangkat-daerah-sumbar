import { Menu, Bell, User, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';

const Header = ({ onToggleSidebar, userInfo, onLogout, showUserMenu, setShowUserMenu, sidebarOpen }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                            }`}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3">
                        <img
                            src="/biro-organisasi-logo.png"
                            alt="Logo Biro Organisasi"
                            className="h-10 w-10 object-contain"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                                Sistem Tracking Evaluasi Kelembagaan
                            </h1>
                            <p className="text-xs lg:text-sm text-gray-600">
                                Biro Organisasi Setda Provinsi Sumatera Barat
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-gray-200 hover:bg-blue-50 rounded-r-lg transition-all p-2"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-xs lg:text-sm font-medium text-gray-900">
                                    {userInfo.kabupaten_kota || userInfo.username}
                                </p>
                                <p className="text-xs text-gray-600 capitalize">
                                    {userInfo.role}
                                </p>
                            </div>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
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
                                        onClick={() => {
                                            onLogout();
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-medium text-sm">Logout</span>
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

