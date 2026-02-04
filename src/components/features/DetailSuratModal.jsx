import { useState, useEffect } from 'react';
import { X, Eye, Download, FileText, AlertCircle, Check, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import RevisionModal from './RevisionModal';
import AdminSuccessModal from '../common/AdminSuccessModal';
import ConfirmModal from '../common/ConfirmModal';
import { pengajuanAPI } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';

const DetailSuratModal = ({ surat, onClose, userRole, isVerificationMode = false }) => {
    const { user } = useAuthContext();
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dokumenList, setDokumenList] = useState([]);
    const [catatanRevisiList, setCatatanRevisiList] = useState([]);
    const [loadingDokumen, setLoadingDokumen] = useState(false);
    const [loadingCatatan, setLoadingCatatan] = useState(false);
    const [selectedTahapan, setSelectedTahapan] = useState('');
    const [isUpdatingTahapan, setIsUpdatingTahapan] = useState(false);
    const [fileRekomendasi, setFileRekomendasi] = useState(null);
    const [isSelesaikan, setIsSelesaikan] = useState(false);
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
    const [showConfirmSelesai, setShowConfirmSelesai] = useState(false);

    useEffect(() => {
        if (surat?.id_pengajuan) {
            fetchDokumen();
            fetchCatatanRevisi();
            const tahapanStatuses = ['Penjadwalan Rapat', 'Pelaksanaan Rapat Fasilitasi', 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', 'Proses Penandatanganan'];
            setSelectedTahapan(tahapanStatuses.includes(surat.status) ? surat.status : '');
        }
    }, [surat]);

    const fetchDokumen = async () => {
        try {
            setLoadingDokumen(true);
            const result = await pengajuanAPI.getDokumen(surat.id_pengajuan);

            if (result.success) {
                setDokumenList(result.data);
            }
        } catch (err) {
            console.error('Error fetching dokumen:', err);
            setDokumenList([]);
        } finally {
            setLoadingDokumen(false);
        }
    };

    const fetchCatatanRevisi = async () => {
        try {
            setLoadingCatatan(true);
            const result = await pengajuanAPI.getCatatanRevisi(surat.id_pengajuan);

            if (result.success) {
                setCatatanRevisiList(result.data);
            }
        } catch (err) {
            console.error('Error fetching catatan revisi:', err);
            setCatatanRevisiList([]);
        } finally {
            setLoadingCatatan(false);
        }
    };

    if (!surat) return null;
    console.log('=== DEBUG DOKUMEN REKOMENDASI ===');
    console.log('userRole:', userRole);
    console.log('surat.status:', surat.status);
    console.log('surat.file_surat_rekomendasi:', surat.file_surat_rekomendasi);
    console.log('Conditional check result:', userRole === 'admin' && surat.status === 'Selesai' && surat.file_surat_rekomendasi);
    console.log('Full surat object:', surat);


    const handleAccept = async () => {
        try {
            setIsProcessing(true);
            const result = await pengajuanAPI.updateStatus(surat.id_pengajuan, {
                status_pengajuan: 'Penjadwalan Rapat',
                progress_persen: 15
            });

            if (result.success) {
                setSuccessModal({
                    isOpen: true,
                    title: 'Dokumen Diterima',
                    message: `Dokumen dari ${surat.pemohon} telah diterima dan akan diproses lebih lanjut.`,
                    type: 'success'
                });
            }
        } catch (err) {
            setSuccessModal({
                isOpen: true,
                title: 'Terjadi Kesalahan',
                message: err.message,
                type: 'error'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRevision = async (catatan) => {
        try {
            const result = await pengajuanAPI.updateStatus(surat.id_pengajuan, {
                status_pengajuan: 'Perlu Perbaikan',
                catatan_revisi: catatan,
                progress_persen: 5,
                created_by: user?.username || user?.kabupaten_kota || 'admin'
            });

            if (result.success) {
                setSuccessModal({
                    isOpen: true,
                    title: 'Dokumen Dikembalikan',
                    message: `Dokumen telah dikembalikan kepada ${surat.pemohon} untuk perbaikan.`,
                    type: 'success'
                });
                setShowRevisionModal(false);
            }
        } catch (err) {
            setSuccessModal({
                isOpen: true,
                title: 'Terjadi Kesalahan',
                message: err.message,
                type: 'error'
            });
        }
    };

    const handleUpdateTahapan = async () => {
        if (!selectedTahapan) {
            setSuccessModal({
                isOpen: true,
                title: 'Perhatian',
                message: 'Pilih tahapan terlebih dahulu.',
                type: 'error'
            });
            return;
        }

        try {
            setIsUpdatingTahapan(true);
            const progressMap = {
                'Penjadwalan Rapat': 20,
                'Pelaksanaan Rapat Fasilitasi': 40,
                'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 60,
                'Proses Penandatanganan': 85
            };

            const result = await pengajuanAPI.updateStatus(surat.id_pengajuan, {
                status_pengajuan: selectedTahapan,
                progress_persen: progressMap[selectedTahapan] || surat.progress
            });

            if (result.success) {
                setSuccessModal({
                    isOpen: true,
                    title: 'Tahapan Diperbarui',
                    message: 'Tahapan proses berhasil diperbarui.',
                    type: 'success'
                });
            }
        } catch (err) {
            setSuccessModal({
                isOpen: true,
                title: 'Terjadi Kesalahan',
                message: err.message,
                type: 'error'
            });
        } finally {
            setIsUpdatingTahapan(false);
        }
    };

    const handleSelesaikanPengajuan = async () => {
        if (!fileRekomendasi) {
            setSuccessModal({
                isOpen: true,
                title: 'File Belum Dipilih',
                message: 'Harap upload surat rekomendasi terlebih dahulu.',
                type: 'error'
            });
            return;
        }
        setShowConfirmSelesai(true);
    };

    const executeSelesaikanPengajuan = async () => {

        try {
            setIsSelesaikan(true);

            const result = await pengajuanAPI.selesaikanPengajuan(surat.id_pengajuan, fileRekomendasi);

            if (result.success) {
                setSuccessModal({
                    isOpen: true,
                    title: 'Pengajuan Diselesaikan',
                    message: 'Surat rekomendasi telah diunggah dan status pengajuan diubah menjadi "Selesai".',
                    type: 'success'
                });
            }
        } catch (err) {
            setSuccessModal({
                isOpen: true,
                title: 'Terjadi Kesalahan',
                message: err.message,
                type: 'error'
            });
        } finally {
            setIsSelesaikan(false);
        }
    };

    const handlePreview = (dokumen) => {
        const baseURL = 'http://localhost:3001';
        window.open(`${baseURL}${dokumen.path_file}`, '_blank');
    };

    const handleDownload = async (dokumen) => {
        try {
            const baseURL = 'http://localhost:3001';
            const fileUrl = `${baseURL}${dokumen.path_file}`;
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = dokumen.nama_file;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Gagal mengunduh file. Silakan coba lagi.');
        }
    };

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
                        <h2 className="text-2xl font-bold text-gray-900">Detail Pengajuan Surat</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            {userRole === 'admin' && (
                                <div>
                                    <p className="text-sm text-gray-600">Pemohon</p>
                                    <p className="font-semibold text-gray-900">{surat.pemohon}</p>
                                </div>
                            )}
                            <div className={userRole === 'admin' ? '' : 'col-span-2'}>
                                <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(surat.tanggal).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            {userRole === 'kab/kota' && (
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Jenis Layanan</p>
                                    <p className="font-semibold text-gray-900">{surat.nama_layanan || '-'}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Status Saat Ini</p>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${surat.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-800' :
                                        surat.status === 'Perlu Perbaikan' ? 'bg-red-100 text-red-800' :
                                            surat.status === 'Dalam Proses' ? 'bg-blue-100 text-blue-800' :
                                                surat.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {surat.status}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Update Tahapan Proses - Untuk admin dengan status tahapan */}
                        {userRole === 'admin' && !isVerificationMode && ['Penjadwalan Rapat', 'Pelaksanaan Rapat Fasilitasi', 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', 'Proses Penandatanganan'].includes(surat.status) && (
                            <div className="bg-gradient-to-r from-navy-50 to-blue-50 border-2 border-navy-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-navy-100 rounded-full p-2">
                                        <svg className="w-6 h-6 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-navy-900 mb-1">Kelola Tahapan Proses</h3>
                                        <p className="text-sm text-navy-700 mb-4">
                                            Update tahapan proses pengajuan surat sesuai dengan progress yang sedang dikerjakan.
                                        </p>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-navy-700 mb-2">
                                                    Tahapan Saat Ini: <span className="font-bold">{surat.status || '-'}</span>
                                                </label>
                                                <select
                                                    value={selectedTahapan}
                                                    onChange={(e) => setSelectedTahapan(e.target.value)}
                                                    disabled={isUpdatingTahapan}
                                                    className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-transparent bg-white text-gray-900 font-medium"
                                                >
                                                    <option value="">-- Pilih Tahapan Baru --</option>
                                                    <option value="Penjadwalan Rapat">Penjadwalan Rapat</option>
                                                    <option value="Pelaksanaan Rapat Fasilitasi">Pelaksanaan Rapat Fasilitasi</option>
                                                    <option value="Penyusunan Draft Rekomendasi/Hasil Fasilitasi">Penyusunan Draft Rekomendasi/Hasil Fasilitasi</option>
                                                    <option value="Proses Penandatanganan">Proses Penandatanganan</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={handleUpdateTahapan}
                                                disabled={isUpdatingTahapan || !selectedTahapan || selectedTahapan === surat.status}
                                                className="w-full bg-navy-600 enabled:hover:bg-navy-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm enabled:hover:shadow-md"
                                            >
                                                {isUpdatingTahapan ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Memperbarui...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-5 h-5" />
                                                        Perbarui Tahapan Proses
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selesaikan Pengajuan - Untuk admin di tahapan Proses Penandatanganan */}
                        {userRole === 'admin' && !isVerificationMode && surat.status === 'Proses Penandatanganan' && (
                            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-green-900 mb-3">Selesaikan Pengajuan</h3>

                                <div className="border border-green-200 rounded-lg overflow-hidden bg-white">
                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        {/* File Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Surat Rekomendasi <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={(e) => setFileRekomendasi(e.target.files[0])}
                                                disabled={isSelesaikan}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm text-gray-900 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                                            />
                                            {fileRekomendasi && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                                    <Check className="w-4 h-4" />
                                                    <span className="font-medium">{fileRekomendasi.name}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Warning */}
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                                            <p className="text-xs text-yellow-800">
                                                <strong>Perhatian:</strong> Status tidak dapat diubah kembali setelah diselesaikan.
                                            </p>
                                        </div>

                                        {/* Button */}
                                        <button
                                            onClick={handleSelesaikanPengajuan}
                                            disabled={isSelesaikan || !fileRekomendasi}
                                            className="w-full bg-green-600 enabled:hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                                        >
                                            {isSelesaikan ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Selesaikan Pengajuan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Catatan Revisi - Untuk pemohon */}
                        {userRole === 'kab/kota' && surat.catatan_revisi && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-900 mb-2">Dokumen Perlu Diperbaiki</h3>
                                        <p className="text-sm text-red-800 whitespace-pre-line">{surat.catatan_revisi}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Catatan Pemohon */}
                        {surat.catatan_pemohon && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-900 mb-1">Catatan Pemohon:</p>
                                <p className="text-sm text-blue-800">{surat.catatan_pemohon}</p>
                            </div>
                        )}

                        {/* History Catatan Revisi - Untuk Admin */}
                        {userRole === 'admin' && catatanRevisiList.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    History Catatan Revisi ({catatanRevisiList.length})
                                </h3>
                                {loadingCatatan ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Memuat catatan revisi...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {catatanRevisiList.map((catatan, index) => (
                                            <div key={catatan.id_catatan_revisi} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                            #{catatanRevisiList.length - index}
                                                        </span>
                                                        <span className="text-sm font-medium text-amber-900">
                                                            Dikembalikan oleh: {catatan.created_by}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(catatan.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 whitespace-pre-line">{catatan.catatan}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dokumen */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Dokumen yang Diupload</h3>
                            {loadingDokumen ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Memuat dokumen...</p>
                                </div>
                            ) : dokumenList.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Tidak ada dokumen</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dokumenList.map((dok, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Header - Keterangan Dokumen dari Persyaratan */}
                                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {dok.persyaratan?.nama_dokumen || dok.jenis_dokumen || 'Dokumen'}
                                                </p>
                                                {dok.persyaratan?.format_file && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Format: {dok.persyaratan.format_file}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Content - File yang diupload */}
                                            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <FileText className="w-5 h-5 text-navy-600 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {dok.nama_file}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(dok.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => handlePreview(dok)}
                                                        className="text-navy-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-colors border border-blue-200"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Lihat</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(dok)}
                                                        className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Download</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Verifikasi Kelengkapan Dokumen - Dipindahkan ke sini setelah Dokumen */}
                        {userRole === 'admin' && isVerificationMode && surat.status === 'Menunggu Verifikasi' && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <AlertCircle className="w-6 h-6 text-navy-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-1">Verifikasi Kelengkapan Dokumen</h3>
                                        <p className="text-sm text-blue-800">
                                            Periksa kelengkapan dan keabsahan dokumen yang diajukan. Jika dokumen lengkap dan sesuai,
                                            klik "Terima" untuk melanjutkan proses. Jika ada yang perlu diperbaiki, klik "Kembalikan"
                                            dan berikan catatan perbaikan.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        disabled={isProcessing}
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 transition-colors"
                                    >
                                        <Check className="w-5 h-5" />
                                        Terima & Lanjutkan Proses
                                    </button>
                                    <button
                                        onClick={() => setShowRevisionModal(true)}
                                        disabled={isProcessing}
                                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Kembalikan untuk Perbaikan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dokumen Rekomendasi - Hanya muncul untuk admin jika status Selesai */}
                        {userRole === 'admin' && surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Dokumen Rekomendasi</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Header - Label Dokumen */}
                                    <div className="bg-green-50 px-4 py-2 border-b border-green-100">
                                        <p className="text-sm font-semibold text-green-900">
                                            Surat Rekomendasi (Dokumen Final)
                                        </p>
                                        <p className="text-xs text-green-700 mt-0.5">
                                            Diselesaikan: {surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </p>
                                    </div>

                                    {/* Content - File */}
                                    <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    Rekomendasi_{surat.pemohon?.replace(/\s+/g, '_')}.pdf
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Dokumen rekomendasi hasil pengajuan
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    const baseURL = 'http://localhost:3001';
                                                    window.open(`${baseURL}${surat.file_surat_rekomendasi}`, '_blank');
                                                }}
                                                className="text-navy-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-colors border border-blue-200"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm font-medium">Lihat</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const baseURL = 'http://localhost:3001';
                                                        const fileUrl = `${baseURL}${surat.file_surat_rekomendasi}`;
                                                        const response = await fetch(fileUrl);
                                                        const blob = await response.blob();
                                                        const blobUrl = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = blobUrl;
                                                        link.download = `Rekomendasi_${surat.pemohon?.replace(/\s+/g, '_')}.pdf`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(blobUrl);
                                                    } catch (error) {
                                                        console.error('Error downloading file:', error);
                                                        alert('Gagal mengunduh file. Silakan coba lagi.');
                                                    }
                                                }}
                                                className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="text-sm font-medium">Download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dokumen Rekomendasi - Untuk Pemohon (Kab/Kota) jika status Selesai */}
                        {userRole === 'kab/kota' && surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Dokumen Rekomendasi</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">🎉</span>
                                            <p className="text-sm font-bold text-green-900">
                                                Pengajuan Selesai!
                                            </p>
                                        </div>
                                        <p className="text-xs text-green-700">
                                            Surat rekomendasi sudah tersedia untuk diunduh
                                        </p>
                                    </div>

                                    {/* Content - File */}
                                    <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Surat Rekomendasi
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Diselesaikan: {surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    const baseURL = 'http://localhost:3001';
                                                    window.open(`${baseURL}${surat.file_surat_rekomendasi}`, '_blank');
                                                }}
                                                className="text-navy-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-colors border border-blue-200"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm font-medium">Lihat</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const baseURL = 'http://localhost:3001';
                                                        const fileUrl = `${baseURL}${surat.file_surat_rekomendasi}`;
                                                        const response = await fetch(fileUrl);
                                                        const blob = await response.blob();
                                                        const blobUrl = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = blobUrl;
                                                        link.download = `Surat_Rekomendasi_${surat.id_pengajuan}.pdf`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(blobUrl);
                                                    } catch (error) {
                                                        console.error('Error downloading file:', error);
                                                        alert('Gagal mengunduh file. Silakan coba lagi.');
                                                    }
                                                }}
                                                className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="text-sm font-medium">Download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RevisionModal
                isOpen={showRevisionModal}
                onClose={() => setShowRevisionModal(false)}
                onSubmit={handleRevision}
                suratId={surat.id_pengajuan}
                pemohon={surat.pemohon}
            />

            <AdminSuccessModal
                isOpen={successModal.isOpen}
                onClose={() => {
                    setSuccessModal({ isOpen: false, title: '', message: '', type: 'success' });
                    onClose();
                    window.location.reload();
                }}
                title={successModal.title}
                message={successModal.message}
                type={successModal.type}
            />

            <ConfirmModal
                isOpen={showConfirmSelesai}
                title="Selesaikan Pengajuan?"
                message="Apakah Anda yakin akan menyelesaikan pengajuan ini? Setelah diselesaikan, status tidak dapat diubah kembali."
                confirmText="Ya, Selesaikan"
                cancelText="Batal"
                confirmColor="green"
                onClose={() => setShowConfirmSelesai(false)}
                onConfirm={() => {
                    setShowConfirmSelesai(false);
                    executeSelesaikanPengajuan();
                }}
            />
        </>
    );
};

export default DetailSuratModal;
