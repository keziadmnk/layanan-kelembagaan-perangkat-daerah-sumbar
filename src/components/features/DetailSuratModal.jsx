import { useState, useEffect } from 'react';
import { X, Eye, Download, FileText, AlertCircle, Check, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import RevisionModal from './RevisionModal';
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

    useEffect(() => {
        if (surat?.id_pengajuan) {
            fetchDokumen();
            fetchCatatanRevisi();
            setSelectedTahapan(surat.tahapan_proses || '');
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
                status_pengajuan: 'Dalam Proses',
                tahapan_proses: 'Penjadwalan Rapat',
                progress_persen: 15
            });

            if (result.success) {
                alert(`Dokumen dari ${surat.pemohon} diterima dan akan diproses lebih lanjut`);
                onClose();
                window.location.reload();
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
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
                alert(`Dokumen dikembalikan kepada ${surat.pemohon} untuk perbaikan`);
                setShowRevisionModal(false);
                onClose();
                window.location.reload();
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleUpdateTahapan = async () => {
        if (!selectedTahapan) {
            alert('Pilih tahapan terlebih dahulu');
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
                tahapan_proses: selectedTahapan,
                progress_persen: progressMap[selectedTahapan] || surat.progress
            });

            if (result.success) {
                alert('Tahapan proses berhasil diperbarui');
                onClose();
                window.location.reload();
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsUpdatingTahapan(false);
        }
    };

    const handleSelesaikanPengajuan = async () => {
        if (!fileRekomendasi) {
            alert('Harap upload surat rekomendasi terlebih dahulu');
            return;
        }

        if (!window.confirm('Apakah Anda yakin akan menyelesaikan pengajuan ini? Setelah diselesaikan, status tidak dapat diubah kembali.')) {
            return;
        }

        try {
            setIsSelesaikan(true);

            const result = await pengajuanAPI.selesaikanPengajuan(surat.id_pengajuan, fileRekomendasi);

            if (result.success) {
                alert('✅ Pengajuan berhasil diselesaikan!\n\nSurat rekomendasi telah diunggah dan status pengajuan diubah menjadi "Selesai".');
                onClose();
                window.location.reload();
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
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
                                                surat.status === 'Selesai' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {surat.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {userRole === 'admin' && isVerificationMode && surat.status === 'Menunggu Verifikasi' && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
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
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400"
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

                        {/* Update Tahapan Proses - Untuk admin di halaman Dalam Proses */}
                        {userRole === 'admin' && !isVerificationMode && surat.status === 'Dalam Proses' && (
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-blue-100 rounded-full p-2">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-blue-900 mb-1">Kelola Tahapan Proses</h3>
                                        <p className="text-sm text-blue-800 mb-4">
                                            Update tahapan proses pengajuan surat sesuai dengan progress yang sedang dikerjakan.
                                        </p>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-blue-900 mb-2">
                                                    Tahapan Saat Ini: <span className="font-bold">{surat.tahapan_proses || '-'}</span>
                                                </label>
                                                <select
                                                    value={selectedTahapan}
                                                    onChange={(e) => setSelectedTahapan(e.target.value)}
                                                    disabled={isUpdatingTahapan}
                                                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
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
                                                disabled={isUpdatingTahapan || !selectedTahapan || selectedTahapan === surat.tahapan_proses}
                                                className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-900 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
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
                        {userRole === 'admin' && !isVerificationMode && surat.status === 'Dalam Proses' && surat.tahapan_proses === 'Proses Penandatanganan' && (
                            <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-900 mb-1">Selesaikan Pengajuan</h3>
                                        <p className="text-sm text-green-800 mb-4">
                                            Upload surat rekomendasi untuk menyelesaikan pengajuan ini. Status akan berubah menjadi "Selesai" dan pengajuan tidak dapat diubah lagi.
                                        </p>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-green-900 mb-2">
                                                    Upload Surat Rekomendasi <span className="text-red-500">*</span>
                                                </label>
                                                <p className="text-xs text-green-700 mb-2">Format: PDF atau Word (.doc, .docx) | Max: 10MB</p>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={(e) => setFileRekomendasi(e.target.files[0])}
                                                    disabled={isSelesaikan}
                                                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                                                />
                                                {fileRekomendasi && (
                                                    <p className="text-sm text-green-700 mt-2">
                                                        ✅ File terpilih: <span className="font-semibold">{fileRekomendasi.name}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                                                <p className="text-xs text-yellow-800">
                                                    ⚠️ <strong>Perhatian:</strong> Setelah diselesaikan, status tidak dapat diubah kembali ke "Dalam Proses". Pastikan semua proses sudah lengkap sebelum menyelesaikan.
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleSelesaikanPengajuan}
                                                disabled={isSelesaikan || !fileRekomendasi}
                                                className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
                                                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
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
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
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

                        {/* Dokumen Rekomendasi - Hanya muncul untuk admin jika status Selesai */}
                        {userRole === 'admin' && surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                            <div className="bg-linear-to-r from-emerald-50 to-green-50 border-2 border-green-200 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-900">Dokumen Rekomendasi</h3>
                                        <p className="text-sm text-green-700">Surat rekomendasi hasil proses pengajuan</p>
                                    </div>
                                </div>

                                <div className="border border-green-200 rounded-lg overflow-hidden bg-white">
                                    <div className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="bg-green-100 rounded-lg p-2">
                                                <FileText className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Surat Rekomendasi - {surat.pemohon}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    📅 Diselesaikan: {surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                                        ✅ Selesai
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                                        📄 Dokumen Final
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    const baseURL = 'http://localhost:3001';
                                                    window.open(`${baseURL}${surat.file_surat_rekomendasi}`, '_blank');
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm">Lihat</span>
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
                                                        link.download = `Rekomendasi_${surat.pemohon.replace(/\s+/g, '_')}.pdf`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(blobUrl);
                                                    } catch (error) {
                                                        console.error('Error downloading file:', error);
                                                        alert('Gagal mengunduh file. Silakan coba lagi.');
                                                    }
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg font-medium"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="text-sm">Download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-3">
                                    <p className="text-xs text-green-800">
                                        ℹ️ <strong>Info:</strong> Dokumen ini merupakan surat rekomendasi final yang telah diupload oleh admin sebagai hasil dari proses pengajuan yang telah diselesaikan.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Dokumen Rekomendasi - Untuk Pemohon (Kab/Kota) jika status Selesai */}
                        {userRole === 'kab/kota' && surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                            <div className="bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-full p-3 shadow-md">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-green-900 flex items-center gap-2">
                                            🎉 Pengajuan Anda Telah Selesai!
                                        </h3>
                                        <p className="text-sm text-green-700 mt-1">Surat rekomendasi hasil pengajuan sudah tersedia untuk Anda</p>
                                    </div>
                                </div>

                                <div className="border-2 border-green-300 rounded-xl overflow-hidden bg-white shadow-md">
                                    <div className="flex items-center justify-between p-5 hover:bg-green-50 transition-all duration-200">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-xl p-3 shadow-sm">
                                                <FileText className="w-8 h-8 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-base font-bold text-gray-900 mb-1">
                                                    📄 Surat Rekomendasi
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    📅 Diselesaikan pada: {surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                        ✅ Selesai
                                                    </span>
                                                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                        📄 Dokumen Final
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 ml-4">
                                            <button
                                                onClick={() => {
                                                    const baseURL = 'http://localhost:3001';
                                                    window.open(`${baseURL}${surat.file_surat_rekomendasi}`, '_blank');
                                                }}
                                                className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl font-semibold transform hover:scale-105"
                                            >
                                                <Eye className="w-5 h-5" />
                                                <span>Lihat Dokumen</span>
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
                                                className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl font-semibold transform hover:scale-105"
                                            >
                                                <Download className="w-5 h-5" />
                                                <span>Download PDF</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 bg-linear-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="text-green-600 text-xl mt-0.5">💡</div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-900 mb-1">Informasi Penting:</p>
                                            <p className="text-xs text-green-800 leading-relaxed">
                                                Surat rekomendasi ini merupakan dokumen final hasil dari proses pengajuan yang telah Anda ajukan.
                                                Silakan download dan simpan dokumen ini untuk keperluan administrasi Anda.
                                                Jika memerlukan salinan tambahan, Anda dapat mengunduhnya kembali kapan saja.
                                            </p>
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
        </>
    );
};

export default DetailSuratModal;
