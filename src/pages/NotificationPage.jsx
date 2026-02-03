import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Clock, FileText, AlertCircle } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import { notifikasiAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notifikasiAPI.getByUser(user.id);
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notifikasiAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id_notifikasi === id ? { ...notif, is_read: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notifikasiAPI.markAllAsRead(user.id);
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, is_read: true }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus notifikasi ini?')) return;

        try {
            await notifikasiAPI.delete(id);
            setNotifications(prev => prev.filter(notif => notif.id_notifikasi !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (tipe) => {
        switch (tipe) {
            case 'pengajuan_baru':
                return <FileText className="w-5 h-5 text-blue-600" />;
            case 'perubahan_status':
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / 1000 / 60 / 60);

        if (hours < 1) {
            const minutes = Math.floor(diff / 1000 / 60);
            return `${minutes} menit yang lalu`;
        } else if (hours < 24) {
            return `${hours} jam yang lalu`;
        } else {
            const days = Math.floor(hours / 24);
            if (days === 1) return 'Kemarin';
            if (days < 7) return `${days} hari yang lalu`;
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.is_read;
        if (filter === 'read') return notif.is_read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Pagination calculations
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    // Handle filter change - reset to page 1
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat notifikasi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
                        <p className="text-sm text-gray-600">
                            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'all'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Semua ({notifications.length})
                    </button>
                    <button
                        onClick={() => handleFilterChange('unread')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'unread'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Belum Dibaca ({unreadCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange('read')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'read'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Sudah Dibaca ({notifications.length - unreadCount})
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {paginatedNotifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Notifikasi</h3>
                        <p className="text-gray-600">
                            {filter === 'unread' ? 'Semua notifikasi sudah dibaca' : 'Belum ada notifikasi untuk ditampilkan'}
                        </p>
                    </div>
                ) : (
                    paginatedNotifications.map((notif) => (
                        <div
                            key={notif.id_notifikasi}
                            className={`bg-white rounded-lg shadow border transition-all hover:shadow-md ${notif.is_read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.is_read ? 'bg-gray-100' : 'bg-blue-100'
                                        }`}>
                                        {getNotificationIcon(notif.tipe)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-semibold ${notif.is_read ? 'text-gray-900' : 'text-gray-900'}`}>
                                                {notif.judul}
                                            </h3>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-2 text-sm">{notif.pesan}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(notif.created_at)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notif.id_notifikasi)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Tandai sudah dibaca"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notif.id_notifikasi)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {paginatedNotifications.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredNotifications.length}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
