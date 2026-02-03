import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, MapPin } from 'lucide-react';

const UserFormModal = ({ mode, user, onClose, onSave }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        kabupaten_kota: '',
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    // Password default: KabKota2025
    const DEFAULT_PASSWORD = 'KabKota2025';

    // Daftar Kabupaten/Kota di Sumatera Barat
    const kabupatenKotaList = [
        'Kab. Agam',
        'Kab. Dharmasraya',
        'Kab. Kepulauan Mentawai',
        'Kab. Lima Puluh Kota',
        'Kab. Padang Pariaman',
        'Kab. Pasaman',
        'Kab. Pasaman Barat',
        'Kab. Pesisir Selatan',
        'Kab. Sijunjung',
        'Kab. Solok',
        'Kab. Solok Selatan',
        'Kab. Tanah Datar',
        'Kota Bukittinggi',
        'Kota Padang',
        'Kota Padang Panjang',
        'Kota Pariaman',
        'Kota Payakumbuh',
        'Kota Sawahlunto',
        'Kota Solok'
    ];

    useEffect(() => {
        if (mode === 'edit' && user) {
            setFormData({
                kabupaten_kota: user.kabupaten_kota || '',
                username: user.username || '',
                password: '' // Don't show existing password
            });
        } else {
            // Set default password for new user
            setFormData(prev => ({
                ...prev,
                password: DEFAULT_PASSWORD
            }));
        }
    }, [mode, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error saat user mulai ketik
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.kabupaten_kota.trim()) {
            newErrors.kabupaten_kota = 'Kabupaten/Kota wajib dipilih';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username wajib diisi';
        } else if (formData.username.length < 4) {
            newErrors.username = 'Username minimal 4 karakter';
        }

        if (mode === 'create' && !formData.password) {
            newErrors.password = 'Password wajib diisi';
        }

        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {mode === 'create' ? 'Tambah Akun Baru' : 'Edit Akun'}
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {mode === 'create'
                                ? 'Buat akun baru untuk kabupaten/kota'
                                : 'Ubah informasi akun'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-800 p-2 rounded-lg transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Password Default Info */}
                    {mode === 'create' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Password Default:</strong> <code className="bg-blue-100 px-2 py-1 rounded font-mono">{DEFAULT_PASSWORD}</code>
                                <br />
                                <span className="text-xs mt-1 block">
                                    Akun dapat login menggunakan username dan password default di atas. Disarankan untuk mengubah password setelah login pertama kali.
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Kabupaten/Kota */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kabupaten/Kota <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <select
                                    name="kabupaten_kota"
                                    value={formData.kabupaten_kota}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.kabupaten_kota ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Pilih Kabupaten/Kota</option>
                                    {kabupatenKotaList.map((kab) => (
                                        <option key={kab} value={kab}>
                                            {kab}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.kabupaten_kota && (
                                <p className="text-red-500 text-xs mt-1">{errors.kabupaten_kota}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="contoh: biro.padangpariaman"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password {mode === 'create' && <span className="text-red-500">*</span>}
                                {mode === 'edit' && <span className="text-gray-500 text-xs ml-2">(kosongkan jika tidak ingin mengubah)</span>}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={mode === 'edit' ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
                                    className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition shadow-lg"
                        >
                            {mode === 'create' ? 'Buat Akun' : 'Simpan Perubahan'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
