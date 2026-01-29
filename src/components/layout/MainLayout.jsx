import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    const handleTabChange = (tab) => {
        navigate(`/${tab}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                userInfo={user}
                onLogout={handleLogout}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
                sidebarOpen={sidebarOpen}
            />

            <div className="relative">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onTabChange={handleTabChange}
                    userRole={user?.role}
                />

                <main
                    className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                        } p-4 lg:p-8 min-h-screen`}
                >
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
