import { useState } from 'react';

export const useAuth = () => {
    const [userRole, setUserRole] = useState('admin');

    const getUserInfo = () => {
        if (userRole === 'admin') {
            return {
                name: 'Admin Biro Organisasi',
                email: 'admin@setda.go.id'
            };
        }
        return {
            name: 'Kab. Padang Pariaman',
            email: 'padangpariaman@email.go.id'
        };
    };

    return {
        userRole,
        setUserRole,
        userInfo: getUserInfo()
    };
};
