import { Menu, Bell, User } from 'lucide-react';

const Header = ({ onToggleSidebar, userInfo, userRole, onRoleChange, showRoleSwitch, setShowRoleSwitch, sidebarOpen }) => {
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
                            onClick={() => setShowRoleSwitch(!showRoleSwitch)}
                            className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-gray-200 hover:bg-blue-50 rounded-r-lg transition-all p-2"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-xs lg:text-sm font-medium text-gray-900">{userInfo.name}</p>
                                <p className="text-xs text-gray-600">{userInfo.email}</p>
                            </div>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                        </button>

                        {showRoleSwitch && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowRoleSwitch(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                    <button
                                        onClick={() => {
                                            onRoleChange('admin');
                                            setShowRoleSwitch(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-all ${userRole === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                    >
                                        <p className="font-medium text-sm">Admin Biro Organisasi</p>
                                        <p className="text-xs text-gray-500">Kelola semua surat</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onRoleChange('pemohon');
                                            setShowRoleSwitch(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-all ${userRole === 'pemohon' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                    >
                                        <p className="font-medium text-sm">Kab. Padang Pariaman</p>
                                        <p className="text-xs text-gray-500">Lihat pengajuan saya</p>
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

export default Header;
