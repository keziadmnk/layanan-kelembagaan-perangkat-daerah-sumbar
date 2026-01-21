import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, MapPin, User } from 'lucide-react';
import UserFormModal from '../components/features/UserFormModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import { userAPI } from '../services/api';

const UserManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formMode, setFormMode] = useState('create'); // create or edit
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userAPI.getAll();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (err) {
            setError(err.message || 'Gagal memuat data');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchSearch = user.kabupaten_kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());

        return matchSearch;
    });

    const handleCreate = () => {
        setFormMode('create');
        setSelectedUser(null);
        setShowFormModal(true);
    };

    const handleEdit = (user) => {
        setFormMode('edit');
        setSelectedUser(user);
        setShowFormModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (formMode === 'create') {
                // Create new user
                const response = await userAPI.create(userData);
                if (response.success) {
                    await fetchUsers(); // Refresh the list
                    setShowFormModal(false);
                }
            } else {
                // Update existing user
                const response = await userAPI.update(selectedUser.id, userData);
                if (response.success) {
                    await fetchUsers(); // Refresh the list
                    setShowFormModal(false);
                }
            }
        } catch (err) {
            alert(err.message || 'Terjadi kesalahan');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await userAPI.delete(selectedUser.id);
            if (response.success) {
                await fetchUsers(); // Refresh the list
                setShowDeleteModal(false);
            }
        } catch (err) {
            alert(err.message || 'Gagal menghapus akun');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Akun Kab/Kota</h1>
                    <p className="text-gray-600 mt-1">
                        Manajemen akun pemohon dari kabupaten/kota di Sumatera Barat
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Akun Baru
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Akun Terdaftar</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : users.length}
                        </p>
                    </div>
                    <div className="p-4 rounded-full bg-blue-100">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari kabupaten/kota atau username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Kabupaten/Kota
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                                            <p className="text-gray-500">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-lg font-medium">Tidak ada data</p>
                                        <p className="text-sm mt-1">
                                            {searchTerm
                                                ? 'Tidak ada akun yang sesuai dengan pencarian'
                                                : 'Belum ada akun yang terdaftar'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <User className="w-4 h-4 text-blue-600" />
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {user.username}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Dibuat: {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-green-600" />
                                                {user.kabupaten_kota}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showFormModal && (
                <UserFormModal
                    mode={formMode}
                    user={selectedUser}
                    onClose={() => setShowFormModal(false)}
                    onSave={handleSaveUser}
                />
            )}

            {showDeleteModal && selectedUser && (
                <DeleteConfirmModal
                    title="Hapus Akun"
                    message={`Apakah Anda yakin ingin menghapus akun "${selectedUser.kabupaten_kota}" (${selectedUser.username})? Tindakan ini tidak dapat dibatalkan.`}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default UserManagementPage;
