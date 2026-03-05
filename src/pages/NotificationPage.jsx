import { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, Clock, FileText, AlertCircle } from 'lucide-react';
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

    // Use ref to keep track of notifications for cleanup
    const notificationsRef = useRef([]);

    // Update ref whenever notifications change
    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    // Fetch notifications on mount
    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user?.id]);

    // Cleanup: Mark all as read when leaving the page
    useEffect(() => {
        return () => {
            if (user?.id && notificationsRef.current.length > 0) {
                const hasUnread = notificationsRef.current.some(notif => !notif.is_read);
                if (hasUnread) {
                    // Mark all as read when user leaves the page
                    notifikasiAPI.markAllAsRead(user.id).catch(error => {
                        console.error('Error marking notifications as read on unmount:', error);
                    });
                }
            }
        };
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

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Jangan trigger klik card
        if (!confirm('Hapus notifikasi ini?')) return;

        try {
            await notifikasiAPI.delete(id);
            setNotifications(prev => prev.filter(notif => notif.id_notifikasi !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleNotificationClick = (notif) => {
        const role = user?.role;
        let path = null;

        if (notif.tipe === 'pengajuan_baru') {
            // Admin: belum dibaca → verifikasi surat, sudah dibaca → semua surat
            // Pemohon (jarang terjadi) → ke dashboard
            if (role === 'admin') {
                path = !notif.is_read ? '/verifikasi-surat' : '/surat-masuk';
            } else {
                path = '/dashboard';
            }
        } else if (notif.tipe === 'perubahan_status') {
            // Pemohon mendapat notifikasi perubahan status → ke riwayat pengajuan
            // Admin (jarang terjadi) → ke verifikasi surat
            path = role === 'admin' ? '/verifikasi-surat' : '/riwayat';
        } else {
            // Tipe 'info' → ke dashboard masing-masing
            path = '/dashboard';
        }

        navigate(path);
    };

    const getNotificationIcon = (tipe) => {
        switch (tipe) {
            case 'pengajuan_baru':
                return <FileText className="w-5 h-5 text-navy-600" />;
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
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
                            {notifications.length > 0
                                ? `${notifications.length} notifikasi`
                                : 'Belum ada notifikasi'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'all'
                            ? 'text-navy-600 border-b-2 border-navy-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Semua ({notifications.length})
                    </button>
                    <button
                        onClick={() => handleFilterChange('unread')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'unread'
                            ? 'text-navy-600 border-b-2 border-navy-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Belum Dibaca ({unreadCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange('read')}
                        className={`px-4 py-2 font-medium transition-colors relative ${filter === 'read'
                            ? 'text-navy-600 border-b-2 border-navy-600'
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
                            onClick={() => handleNotificationClick(notif)}
                            className={`bg-white rounded-lg shadow border transition-all hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${!notif.is_read
                                ? 'border-green-200 bg-green-50/30'
                                : 'border-gray-200'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Icon with green dot indicator for unread */}
                                    <div className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                                        {getNotificationIcon(notif.tipe)}
                                        {!notif.is_read && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-semibold ${!notif.is_read ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {notif.judul}
                                                {!notif.is_read && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        Baru
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                        <p className={`mb-2 text-sm ${!notif.is_read ? 'text-gray-800' : 'text-gray-600'
                                            }`}>{notif.pesan}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(notif.created_at)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => handleDelete(notif.id_notifikasi, e)}
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
