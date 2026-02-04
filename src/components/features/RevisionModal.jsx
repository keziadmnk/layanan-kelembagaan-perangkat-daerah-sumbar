import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const RevisionModal = ({ isOpen, onClose, onSubmit, suratId, pemohon }) => {
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!catatan.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(catatan);
            setCatatan('');
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Kembalikan Dokumen untuk Perbaikan</h2>
                            <p className="text-sm text-gray-600">ID: {suratId} - {pemohon}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Perhatian:</strong> Catatan perbaikan ini akan dikirimkan kepada pemohon.
                            Pastikan Anda menjelaskan dengan jelas dokumen mana yang perlu diperbaiki dan bagaimana cara memperbaikinya.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Perbaikan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            rows="8"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent resize-none"
                            placeholder="Contoh:&#10;&#10;Mohon lengkapi/perbaiki dokumen berikut:&#10;1. Surat Pengantar dari Bupati/Wali Kota - belum dilampirkan&#10;2. ABK yang sudah disahkan - file tidak terbaca dengan jelas, mohon upload ulang dengan kualitas lebih baik&#10;3. Matriks pengelompokan urusan - belum sesuai format yang ditentukan"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Tuliskan dengan detail dokumen mana yang bermasalah dan bagaimana cara memperbaikinya
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={!catatan.trim() || isSubmitting}
                            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {isSubmitting ? 'Mengirim...' : 'Kembalikan untuk Perbaikan'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RevisionModal;
