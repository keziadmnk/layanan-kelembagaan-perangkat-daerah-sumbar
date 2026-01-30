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

            if (savedUser && savedToken) {
                try {
                    const { authAPI } = await import('../services/api');
                    const response = await authAPI.verifyToken();

                    if (response.success) {
                        setUser(JSON.parse(savedUser));
                        setToken(savedToken);
                    } else {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.log('Token verification failed, clearing auth...', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
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
