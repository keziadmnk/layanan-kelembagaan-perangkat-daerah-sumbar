import { Home, FileText, Clock, CheckCircle, Send, LogOut, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, userRole }) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const adminMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'verifikasi-surat', label: 'Verifikasi Surat', icon: ClipboardCheck },
        { id: 'surat-masuk', label: 'Semua Surat', icon: FileText },
        { id: 'dalam-proses', label: 'Dalam Proses', icon: Clock },
        { id: 'selesai', label: 'Selesai', icon: CheckCircle }
    ];

    const pemohonMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'pengajuan-baru', label: 'Ajukan Surat Baru', icon: Send },
        { id: 'riwayat', label: 'Riwayat Pengajuan', icon: Clock }
    ];

    const menuItems = userRole === 'admin' ? adminMenuItems : pemohonMenuItems;

    const handleMenuClick = (tabId) => {
        onTabChange(tabId);
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={`${isOpen ? 'w-64' : 'w-20'
                    } fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 overflow-hidden shadow-lg`}
            >
                <div className={`p-4 border-b border-gray-200 h-20 flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
                    <div className="flex items-center gap-3">
                        <img
                            src="/biro-organisasi-logo.png"
                            alt="Logo"
                            className="h-10 w-10 object-contain"
                        />
                        {isOpen && (
                            <div>
                                <h2 className="font-bold text-sm text-gray-900">Biro Organisasi</h2>
                                <p className="text-xs text-gray-600">Setda Prov. Sumbar</p>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="p-3 space-y-1.5 mt-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isHovered = hoveredItem === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`w-full flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'
                                    } py-3 rounded-xl text-left transition-all duration-200 relative ${isActive
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                            >
                                <Icon className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                                {isOpen && (
                                    <span className="whitespace-nowrap font-medium">
                                        {item.label}
                                    </span>
                                )}
                                {!isOpen && isHovered && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl">
                                        {item.label}
                                        <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 transform -translate-y-1/2 rotate-45"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <button
                            onMouseEnter={() => setHoveredItem('logout')}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`w-full flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'
                                } py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-200 relative`}
                        >
                            <LogOut className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                            {isOpen && (
                                <span className="whitespace-nowrap font-medium">
                                    Keluar
                                </span>
                            )}
                            {!isOpen && hoveredItem === 'logout' && (
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl">
                                    Keluar
                                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 transform -translate-y-1/2 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
