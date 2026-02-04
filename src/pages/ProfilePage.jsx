import { useState, useEffect } from 'react';
import { User, Lock, Camera, Save, X, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';

const ProfilePage = () => {
    const { user, updateUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    
    const [profileData, setProfileData] = useState({
        username: '',
        kabupaten_kota: '',
        foto_profile: null
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || '',
                kabupaten_kota: user.kabupaten_kota || '',
                foto_profile: user.foto_profile || null
            });
            if (user.foto_profile) {
                setPreviewImage(`http://localhost:3001/uploads/profiles/${user.foto_profile}`);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar');
                return;
            }
            setProfileData(prev => ({
                ...prev,
                foto_profile: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('username', profileData.username);
            if (user.role === 'pemohon') {
                formData.append('kabupaten_kota', profileData.kabupaten_kota);
            }
            if (profileData.foto_profile instanceof File) {
                formData.append('foto_profile', profileData.foto_profile);
            }

            const response = await profileAPI.updateProfile(formData);
            
            if (response.success) {
                setSuccess('Profile berhasil diperbarui');
                updateUser(response.data);
                
                // Update preview image jika ada foto baru
                if (response.data.foto_profile) {
                    setPreviewImage(`http://localhost:3001/uploads/profiles/${response.data.foto_profile}`);
                }
                
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Password baru dan konfirmasi tidak cocok');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password minimal 6 karakter');
            setLoading(false);
            return;
        }

        try {
            const response = await profileAPI.updatePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            if (response.success) {
                setSuccess('Password berhasil diperbarui');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui password');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className=" bg-navy-600  rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Profile Saya</h1>
                <p className="text-blue-100 mt-1">Kelola informasi profile dan keamanan akun Anda</p>
            </div>

            {/* Alert Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Save className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 text-sm">{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto Profile</h2>
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                            <User className="w-16 h-16 text-navy-600" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-navy-600 text-white p-2 rounded-full cursor-pointer hover:bg-navy-700 transition-all shadow-lg group-hover:scale-110">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Format: JPG, PNG<br />
                                Maksimal: 2MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Informasi Profile</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                                {user?.role}
                            </span>
                        </div>
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {user?.role === 'pemohon' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kabupaten/Kota
                                    </label>
                                    <input
                                        type="text"
                                        name="kabupaten_kota"
                                        value={profileData.kabupaten_kota}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-navy-600 text-white py-2.5 px-4 rounded-lg hover:bg-navy-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    <Save className="w-5 h-5" />
                                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Keamanan Akun</h2>
                        <p className="text-sm text-gray-600 mt-1">Ubah password untuk keamanan akun Anda</p>
                    </div>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                        >
                            <Lock className="w-4 h-4" />
                            Ubah Password
                        </button>
                    )}
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 border-t border-gray-200 pt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Lama
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('old')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.old ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Baru
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.confirm ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-navy-600 text-white py-2.5 px-4 rounded-lg hover:bg-navy-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Menyimpan...' : 'Simpan Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({
                                        oldPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
