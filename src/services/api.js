import axios from 'axios';

// ✅ FIXED: Port disesuaikan dengan backend yang berjalan di 3001 (bukan 5001)
const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Users API
export const userAPI = {
    // Get all users
    getAll: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data pengguna' };
        }
    },

    // Create new user
    create: async (userData) => {
        try {
            const response = await api.post('/users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat akun' };
        }
    },

    // Update user
    update: async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui data' };
        }
    },

    // Delete user
    delete: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menghapus akun' };
        }
    }
};

export default api;
