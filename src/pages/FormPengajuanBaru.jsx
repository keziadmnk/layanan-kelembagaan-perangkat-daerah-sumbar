import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import FileUpload from '../components/common/FileUpload';
import { dokumentWajib } from '../constants/mockData';
import { getModuleById, modules } from '../constants/modules';

const FormPengajuanBaru = ({ onCancel, selectedModuleId }) => {
    const [selectedLayanan, setSelectedLayanan] = useState(selectedModuleId || '');
    const module = getModuleById(selectedLayanan);

    const handleLayananChange = (e) => {
        setSelectedLayanan(e.target.value);
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={onCancel}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    {module && <div className="text-3xl">{module.icon}</div>}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {module ? `Ajukan ${module.shortName}` : 'Ajukan Layanan Baru'}
                        </h2>
                        {module && <p className="text-sm text-gray-600 mt-1">{module.description}</p>}
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-800">
                        <strong>Info:</strong> Pastikan semua dokumen telah lengkap dan sesuai dengan persyaratan sebelum mengajukan.
                    </p>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kabupaten/Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contoh: Kabupaten Padang Pariaman"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Layanan <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedLayanan}
                        onChange={handleLayananChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">-- Pilih Jenis Layanan --</option>
                        {modules.map(mod => (
                            <option key={mod.id} value={mod.id}>
                                {mod.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedLayanan && dokumentWajib[selectedLayanan] && (
                    <>
                        <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900">Dokumen Wajib</h3>

                            {dokumentWajib[selectedLayanan].map((dok) => (
                                <FileUpload
                                    key={dok.id}
                                    label={`${dok.id}. ${dok.nama}`}
                                    required={dok.required}
                                    format={dok.format}
                                />
                            ))}
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Catatan Tambahan (Opsional)</h3>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tambahkan catatan atau keterangan tambahan jika diperlukan..."
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Catatan:</strong> Semua dokumen wajib harus dilengkapi sebelum pengajuan dapat diproses.
                                Pastikan dokumen telah disahkan oleh pihak yang berwenang.
                            </p>
                        </div>
                    </>
                )}

                <div className="flex gap-3">
                    <button
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!selectedLayanan}
                    >
                        <Send className="w-5 h-5" />
                        Ajukan Surat
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormPengajuanBaru;
