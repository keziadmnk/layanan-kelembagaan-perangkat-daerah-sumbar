import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedRole = localStorage.getItem('sessionRole');

            if (savedUser && savedToken) {
                try {
                    const parsedUser = JSON.parse(savedUser);

                    // CRITICAL: Validate role hasn't been tampered
                    if (savedRole && parsedUser.role !== savedRole) {
                        console.error('⚠️ SECURITY: Role mismatch detected! Clearing session...');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        localStorage.removeItem('sessionRole');
                        setLoading(false);
                        return;
                    }

                    const { authAPI } = await import('../services/api');
                    const response = await authAPI.verifyToken();

                    if (response.success) {
                        console.log('✅ Auth restored:', { username: parsedUser.username, role: parsedUser.role });
                        setUser(parsedUser);
                        setToken(savedToken);
                    } else {
                        console.log('❌ Token invalid, clearing...');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        localStorage.removeItem('sessionRole');
                    }
                } catch (error) {
                    console.log('❌ Token verification failed, clearing auth...', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('sessionRole');
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData, authToken) => {
        console.log('🔐 LOGIN:', { username: userData.username, role: userData.role });
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        // Lock the session role
        localStorage.setItem('sessionRole', userData.role);
    };

    const logout = () => {
        console.log('🚪 LOGOUT:', user?.username);
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionRole');
    };

    const updateUser = (updatedUserData) => {
        // CRITICAL: Never allow role to be changed during update
        const currentRole = user?.role;
        const newUserData = { ...user, ...updatedUserData };

        // Force keep original role
        if (currentRole) {
            newUserData.role = currentRole;
        }

        console.log('👤 UPDATE USER:', { username: newUserData.username, role: newUserData.role });
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const isAdmin = user?.role === 'admin';
    const isPemohon = user?.role === 'kab/kota';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user,
            isAdmin,
            isPemohon,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};
