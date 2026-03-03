/**
 * Debug Utility
 */

window.debugApp = {
    checkAuth: () => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log('=== AUTH STATUS ===');
        console.log('User:', user ? JSON.parse(user) : null);
        console.log('Token:', token ? token.substring(0, 20) + '...' : null);
        console.log('Has Auth Data:', !!(user && token));

        return {
            hasAuth: !!(user && token),
            user: user ? JSON.parse(user) : null,
            token: token
        };
    },

    clearAuth: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('✅ Auth data cleared! Reloading...');
        setTimeout(() => window.location.reload(), 500);
    },

    checkAPI: async () => {
        try {
            console.log('Checking API connection...');
            const response = await fetch('http://localhost:3001/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            console.log('=== API STATUS ===');
            console.log('Status:', response.status);
            console.log('Response:', data);

            return data;
        } catch (error) {
            console.error('API Error:', error.message);
            console.log('Make sure backend is running on http://localhost:3001');
            return { error: error.message };
        }
    },

    testLogin: async (username = 'admin', password = 'admin123') => {
        try {
            console.log(`Attempting login with ${username}...`);
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log('=== LOGIN TEST ===');
            console.log('Status:', response.status);
            console.log('Response:', data);

            if (data.success) {
                console.log('Login successful!');
                console.log('User:', data.data.user);
            } else {
                console.log('Login failed:', data.message);
            }

            return data;
        } catch (error) {
            console.error('Login Error:', error.message);
            return { error: error.message };
        }
    },
};
console.log('%cDebug Utility Loaded!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
console.log('Type debugApp.help() for available commands');

export default window.debugApp;
