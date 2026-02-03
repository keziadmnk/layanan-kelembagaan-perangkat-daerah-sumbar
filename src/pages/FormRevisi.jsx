import { useState, useEffect } from 'react';
import { Send, ArrowLeft, AlertCircle, Building, ClipboardList, Building2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../components/common/FileUpload';
import SuccessModal from '../components/common/SuccessModal';
import { useAuthContext } from '../contexts/AuthContext';
import { pengajuanAPI, modulLayananAPI } from '../services/api';

const FormRevisi = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [pengajuan, setPengajuan] = useState(null);
    const [selectedModulInfo, setSelectedModulInfo] = useState(null);
    const [persyaratanDokumen, setPersyaratanDokumen] = useState([]);
    const [existingDokumen, setExistingDokumen] = useState([]);
    const [catatanRevisi, setCatatanRevisi] = useState([]);

    const [catatanPemohon, setCatatanPemohon] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch pengajuan details
            const pengajuanRes = await pengajuanAPI.getById(id);
            if (pengajuanRes.success) {
                setPengajuan(pengajuanRes.data);
                setCatatanPemohon(pengajuanRes.data.catatan_pemohon || '');

                // Fetch modul info
                const modulRes = await modulLayananAPI.getAll();
                if (modulRes.success) {
                    const modul = modulRes.data.find(m => m.id_modul === pengajuanRes.data.id_modul);
                    setSelectedModulInfo(modul);
                }

                // Fetch persyaratan
                const persyaratanRes = await modulLayananAPI.getPersyaratan(pengajuanRes.data.id_modul);
                if (persyaratanRes.success) {
                    setPersyaratanDokumen(persyaratanRes.data.persyaratan);
                }

                // Fetch existing dokumen
                const dokumenRes = await pengajuanAPI.getDokumen(id);
                if (dokumenRes.success) {
                    setExistingDokumen(dokumenRes.data);

                    // Pre-populate uploaded files with existing documents
                    const existingFiles = {};
                    dokumenRes.data.forEach(dok => {
                        existingFiles[dok.id_persyaratan] = {
                            id_persyaratan: dok.id_persyaratan,
                            nama_file: dok.nama_file,
                            path_file: dok.path_file,
                            created_at: dok.created_at,
                            isExisting: true
                        };
                    });
                    setUploadedFiles(existingFiles);
                }

                // Fetch catatan revisi
                const catatanRes = await pengajuanAPI.getCatatanRevisi(id);
                if (catatanRes.success) {
                    setCatatanRevisi(catatanRes.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal memuat data pengajuan');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUploaded = (id_persyaratan, fileData) => {
        setUploadedFiles(prev => {
            const updated = { ...prev };
            if (fileData) {
                updated[id_persyaratan] = {
                    ...fileData,
                    isExisting: false
                };
            } else {
                delete updated[id_persyaratan];
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi dokumen wajib
        const dokumentWajib = persyaratanDokumen.filter(p => p.wajib);
        const uploadedIds = Object.keys(uploadedFiles).map(Number);
        const missingDocs = dokumentWajib.filter(
            dok => !uploadedIds.includes(dok.id_persyaratan)
        );

        if (missingDocs.length > 0) {
            const missingNames = missingDocs.map(d => d.nama_dokumen).join('\n- ');
            alert(`Harap upload semua dokumen wajib:\n\n- ${missingNames}`);
            return;
        }

        // Prepare data - only include new/changed documents
        const dokumen_upload = Object.values(uploadedFiles)
            .filter(file => !file.isExisting)
            .map(({ isExisting, ...rest }) => rest);

        const revisiData = {
            catatan_pemohon: catatanPemohon || null,
            dokumen_upload: dokumen_upload,
        };

        console.log('📤 Submitting revisi:', revisiData);

        try {
            setSubmitting(true);

            const result = await pengajuanAPI.submitRevisi(id, revisiData);

            if (result.success) {
                console.log('✅ Revisi berhasil disubmit:', result.data);
                setSubmissionResult(result.data);
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error submitting revisi:', error);
            alert(`Gagal mengajukan revisi:\n\n${error.message || 'Terjadi kesalahan'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const getModuleIcon = (namaModul) => {
        const iconProps = { className: "w-8 h-8" };
        if (!namaModul) return <FileText {...iconProps} />;
        if (namaModul.toLowerCase().includes('evaluasi')) return <Building {...iconProps} />;
        if (namaModul.toLowerCase().includes('ranperda')) return <ClipboardList {...iconProps} />;
        if (namaModul.toLowerCase().includes('uptd')) return <Building2 {...iconProps} />;
        return <FileText {...iconProps} />;
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/riwayat');
    };

    const handleCancel = () => {
        navigate('/riwayat');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!pengajuan) {
        return (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="text-center py-8">
                    <p className="text-red-500">Data pengajuan tidak ditemukan</p>
                    <button
                        onClick={() => navigate('/riwayat')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={submitting}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    {selectedModulInfo && <div className="text-3xl">{getModuleIcon(selectedModulInfo.nama_modul)}</div>}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Perbaikan Pengajuan - {selectedModulInfo?.nama_modul || 'Loading...'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tanggal Pengajuan: {new Date(pengajuan.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Catatan Perbaikan dari Admin */}
            {catatanRevisi && catatanRevisi.length > 0 && (
                <div className="p-6 border-b border-gray-200 bg-red-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 mb-2">Catatan Perbaikan dari Admin</h3>
                            <div className="space-y-3">
                                {[...catatanRevisi].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((catatan, index) => (
                                    <div key={catatan.id_catatan} className="bg-white border border-red-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-medium text-red-700">
                                                Catatan #{index + 1}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(catatan.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{catatan.catatan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kabupaten/Kota
                    </label>
                    <input
                        type="text"
                        value={user?.kabupaten_kota || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        disabled
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Layanan
                    </label>
                    <input
                        type="text"
                        value={selectedModulInfo?.nama_modul || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        disabled
                        readOnly
                    />
                </div>

                {persyaratanDokumen.length > 0 && (
                    <>
                        <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900">Dokumen Wajib</h3>
                            <p className="text-sm text-gray-600">
                                Silakan upload ulang dokumen yang perlu diperbaiki.
                            </p>

                            {persyaratanDokumen.map((dok, index) => (
                                <FileUpload
                                    key={dok.id_persyaratan}
                                    id_persyaratan={dok.id_persyaratan}
                                    label={`${index + 1}. ${dok.nama_dokumen}`}
                                    required={dok.wajib}
                                    format={`${dok.format_file} (max. 10MB)`}
                                    onFileUploaded={handleFileUploaded}
                                    existingFile={uploadedFiles[dok.id_persyaratan]}
                                />
                            ))}
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Catatan Tambahan (Opsional)</h3>
                            <textarea
                                value={catatanPemohon}
                                onChange={(e) => setCatatanPemohon(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tambahkan catatan atau keterangan tambahan terkait perbaikan yang dilakukan..."
                                disabled={submitting}
                            />
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                <strong>Perhatian:</strong> Setelah Anda mengirim revisi, pengajuan akan masuk kembali ke tahap verifikasi admin.
                                Pastikan semua perbaikan yang diminta sudah dilakukan dengan benar.
                            </p>
                        </div>
                    </>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || submitting}
                    >
                        <Send className="w-5 h-5" />
                        {submitting ? 'Memproses...' : 'Kirim Perbaikan'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        disabled={submitting}
                    >
                        Batal
                    </button>
                </div>
            </form>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                status={submissionResult?.status_pengajuan}
            />
        </div>
    );
};

export default FormRevisi;
