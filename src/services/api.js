import axios from 'axios';
const API_URL = 'http://localhost:3001/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal login' };
        }
    },

    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Token tidak valid' };
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal logout' };
        }
    }
};

export const userAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data pengguna' };
        }
    },

    create: async (userData) => {
        try {
            const response = await api.post('/users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat akun' };
        }
    },

    update: async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui data' };
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menghapus akun' };
        }
    }
};

export const modulLayananAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/pengajuan/modul-layanan');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data modul layanan' };
        }
    },

    getPersyaratan: async (idModul) => {
        try {
            const response = await api.get(`/pengajuan/persyaratan/${idModul}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil persyaratan dokumen' };
        }
    }
};

export const pengajuanAPI = {
    getByUser: async (idUser) => {
        try {
            const response = await api.get(`/pengajuan/user/${idUser}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil riwayat pengajuan' };
        }
    },
    getAll: async () => {
        try {
            const response = await api.get('/pengajuan/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data pengajuan' };
        }
    },

    getByStatus: async (status) => {
        try {
            const response = await api.get(`/pengajuan/status/${status}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data pengajuan' };
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/pengajuan/create', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal membuat pengajuan' };
        }
    },

    updateStatus: async (idPengajuan, data) => {
        try {
            const response = await api.put(`/pengajuan/update/${idPengajuan}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengupdate status pengajuan' };
        }
    },
    getDokumen: async (idPengajuan) => {
        try {
            const response = await api.get(`/pengajuan/dokumen/${idPengajuan}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil data dokumen' };
        }
    },

    getCatatanRevisi: async (idPengajuan) => {
        try {
            const response = await api.get(`/pengajuan/catatan-revisi/${idPengajuan}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil catatan revisi' };
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/pengajuan/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil detail pengajuan' };
        }
    },

    submitRevisi: async (id, data) => {
        try {
            const response = await api.put(`/pengajuan/revisi/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengirim revisi' };
        }
    },

    selesaikanPengajuan: async (idPengajuan, file) => {
        try {
            const formData = new FormData();
            formData.append('file_rekomendasi', file);

            const response = await api.post(`/pengajuan/selesaikan/${idPengajuan}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menyelesaikan pengajuan' };
        }
    }
};

export const uploadAPI = {
    upload: async (file, idPersyaratan) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('id_persyaratan', idPersyaratan);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengupload file' };
        }
    }
};

export const profileAPI = {
    updateProfile: async (formData) => {
        try {
            const response = await api.put('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui profile' };
        }
    },

    updatePassword: async (passwordData) => {
        try {
            const response = await api.put('/profile/password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal memperbarui password' };
        }
    }
};

export const notifikasiAPI = {
    getByUser: async (userId) => {
        try {
            const response = await api.get(`/notifikasi/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil notifikasi' };
        }
    },

    getUnreadCount: async (userId) => {
        try {
            const response = await api.get(`/notifikasi/user/${userId}/unread-count`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal mengambil jumlah notifikasi' };
        }
    },

    markAsRead: async (id) => {
        try {
            const response = await api.put(`/notifikasi/${id}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menandai notifikasi' };
        }
    },

    markAllAsRead: async (userId) => {
        try {
            const response = await api.put(`/notifikasi/user/${userId}/read-all`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menandai semua notifikasi' };
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/notifikasi/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Gagal menghapus notifikasi' };
        }
    }
};

export default api;


