import { Home, FileText, Clock, CheckCircle, Send, LogOut, ClipboardCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, onClose, onTabChange, userRole }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const location = useLocation();

    const adminMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'surat-masuk', label: 'Semua Surat', icon: FileText },
        { id: 'verifikasi-surat', label: 'Verifikasi Surat', icon: ClipboardCheck },
        { id: 'dalam-proses', label: 'Dalam Proses', icon: Clock },
        { id: 'selesai', label: 'Selesai', icon: CheckCircle },
        { id: 'kelola-akun', label: 'Kelola Akun Kab/Kota', icon: Users }
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
                    className="fixed inset-0 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={`${isOpen ? 'w-64' : 'w-20 -translate-x-full lg:translate-x-0'
                    } fixed top-[73px] left-0 h-[calc(100vh-73px)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 overflow-y-auto overflow-x-hidden shadow-lg`}
            >
                <nav className="p-3 space-y-1.5 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const currentPath = location.pathname.replace('/', '') || 'dashboard';
                        const isActive = currentPath === item.id;
                        const isHovered = hoveredItem === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`w-full flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'
                                    } py-3 rounded-xl text-left transition-all duration-200 relative ${isActive
                                        ? 'bg-navy-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-navy-50 hover:text-blue-700'
                                    }`}
                            >
                                <Icon className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                                {isOpen && (
                                    <span className="whitespace-nowrap font-medium">
                                        {item.label}
                                    </span>
                                )}
                                {!isOpen && isHovered && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-[60] shadow-xl pointer-events-none">
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
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-[60] shadow-xl pointer-events-none">
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

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
    userRole: PropTypes.string,
};

export default Sidebar;
