import { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUpload from '../components/common/FileUpload';
import SuccessModal from '../components/common/SuccessModal';
import { useAuthContext } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:3001/api';

const FormPengajuanBaru = ({ onSuccess }) => {
    const { user } = useAuthContext();  
    const navigate = useNavigate();
    const location = useLocation();
    const initialModuleId = location.state?.selectedModuleId || '';
    const [modulLayanan, setModulLayanan] = useState([]);
    const [selectedLayanan, setSelectedLayanan] = useState(initialModuleId);
    const [persyaratanDokumen, setPersyaratanDokumen] = useState([]);
    const [selectedModulInfo, setSelectedModulInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [namaKabupaten, setNamaKabupaten] = useState('');
    const [catatanPemohon, setCatatanPemohon] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState({});

    useEffect(() => {
        fetchModulLayanan();
    }, []);
    useEffect(() => {
        if (selectedLayanan) {
            fetchPersyaratanDokumen(selectedLayanan);
        } else {
            setPersyaratanDokumen([]);
            setSelectedModulInfo(null);
            setUploadedFiles({});
        }
    }, [selectedLayanan]);

    const fetchModulLayanan = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/pengajuan/modul-layanan`);
            const data = await response.json();

            if (data.success) {
                setModulLayanan(data.data);
                console.log('✅ Modul layanan loaded from database:', data.data);
            }
        } catch (error) {
            console.error('Error fetching modul layanan:', error);
            alert('Gagal mengambil data modul layanan');
        } finally {
            setLoading(false);
        }
    };

    const fetchPersyaratanDokumen = async (id_modul) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/pengajuan/persyaratan/${id_modul}`);
            const data = await response.json();

            if (data.success) {
                setPersyaratanDokumen(data.data.persyaratan);
                setSelectedModulInfo(data.data.modul);
                console.log('✅ Persyaratan loaded from database:', data.data.persyaratan);
            }
        } catch (error) {
            console.error('Error fetching persyaratan:', error);
            alert('Gagal mengambil persyaratan dokumen');
        } finally {
            setLoading(false);
        }
    };

    const handleLayananChange = (e) => {
        setSelectedLayanan(e.target.value);
        setNamaKabupaten('');
        setCatatanPemohon('');
        setUploadedFiles({});
    };

    const handleFileUploaded = (id_persyaratan, fileData) => {
        setUploadedFiles(prev => {
            const updated = { ...prev };
            if (fileData) {
                updated[id_persyaratan] = fileData;
            } else {
                delete updated[id_persyaratan];
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!namaKabupaten.trim()) {
            alert('Harap isi Nama Kabupaten/Kota');
            return;
        }
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
        const dokumen_upload = Object.values(uploadedFiles);
        const pengajuanData = {
            id_user: user?.id, 
            id_modul: Number(selectedLayanan),
            nama_kabupaten: namaKabupaten,
            catatan_pemohon: catatanPemohon || null,
            dokumen_upload: dokumen_upload,
        };

        console.log('📤 Submitting pengajuan:', pengajuanData);

        try {
            setSubmitting(true);

            const response = await fetch(`${API_BASE_URL}/pengajuan/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pengajuanData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal membuat pengajuan');
            }

            console.log('✅ Pengajuan berhasil dibuat:', result.data);

            setSubmissionResult(result.data);
            setShowSuccessModal(true);
            setNamaKabupaten('');
            setCatatanPemohon('');
            setSelectedLayanan('');
            setUploadedFiles({});

            if (onSuccess) {
                onSuccess(result.data);
            }
        } catch (error) {
            console.error('Error submitting pengajuan:', error);
            alert(`Gagal mengajukan surat:\n\n${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const getModuleIcon = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return '🏛️';
        if (namaModul.toLowerCase().includes('ranperda')) return '📋';
        if (namaModul.toLowerCase().includes('uptd')) return '🏢';
        return '📄';
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/riwayat');
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

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
                            {selectedModulInfo ? `Ajukan ${selectedModulInfo.nama_modul}` : 'Ajukan Layanan Baru'}
                        </h2>
                        {selectedModulInfo && <p className="text-sm text-gray-600 mt-1">{selectedModulInfo.deskripsi}</p>}
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-800">
                        <strong>Info:</strong> Pastikan semua dokumen telah lengkap dan sesuai dengan persyaratan sebelum mengajukan.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kabupaten/Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={namaKabupaten}
                        onChange={(e) => setNamaKabupaten(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contoh: Kabupaten Padang Pariaman"
                        required
                        disabled={submitting}
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
                        disabled={loading || submitting}
                        required
                    >
                        <option value="">-- Pilih Jenis Layanan --</option>
                        {modulLayanan.map(modul => (
                            <option key={modul.id_modul} value={modul.id_modul}>
                                {modul.nama_modul}
                            </option>
                        ))}
                    </select>
                    {loading && (
                        <p className="text-sm text-gray-500 mt-1">Loading...</p>
                    )}
                </div>

                {selectedLayanan && persyaratanDokumen.length > 0 && (
                    <>
                        <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900">Dokumen Wajib</h3>

                            {persyaratanDokumen.map((dok, index) => (
                                <FileUpload
                                    key={dok.id_persyaratan}
                                    id_persyaratan={dok.id_persyaratan}
                                    label={`${index + 1}. ${dok.nama_dokumen}`}
                                    required={dok.wajib}
                                    format={`${dok.format_file} (max. 10MB)`}
                                    onFileUploaded={handleFileUploaded}
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
                                placeholder="Tambahkan catatan atau keterangan tambahan jika diperlukan..."
                                disabled={submitting}
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
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!selectedLayanan || loading || submitting}
                    >
                        <Send className="w-5 h-5" />
                        {submitting ? 'Memproses...' : 'Ajukan Surat'}
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
                nomorRegistrasi={submissionResult?.nomor_registrasi}
                status={submissionResult?.status_pengajuan}
            />
        </div>
    );
};

export default FormPengajuanBaru;
