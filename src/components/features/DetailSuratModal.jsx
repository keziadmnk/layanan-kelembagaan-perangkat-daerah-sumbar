import { useState, useEffect, useRef } from 'react';
import { X, Eye, Download, FileText, AlertCircle, Check, XCircle, Upload, ChevronDown, Clock, ArrowRight } from 'lucide-react';
import RevisionModal from './RevisionModal';
import AdminSuccessModal from '../common/AdminSuccessModal';
import ConfirmModal from '../common/ConfirmModal';
import { pengajuanAPI, prosesAPI } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';
import { getStatusColor } from '../../utils/statusUtils';

const BASE_URL = 'http://localhost:3001';

const TAHAPAN_PROSES = [
    { id: 1, label: 'Penjadwalan Rapat' },
    { id: 2, label: 'Pelaksanaan Rapat Fasilitasi' },
    { id: 3, label: 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi' },
    { id: 4, label: 'Proses Penandatanganan' },
];

const PROGRESS_MAP = { 1: 20, 2: 45, 3: 70, 4: 90 };

const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

const formatDateTime = (d) => d
    ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

const StatusBadge = ({ status }) => {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

const DetailSuratModal = ({ surat, onClose, userRole, isVerificationMode = false }) => {
    const { user } = useAuthContext();
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dokumenList, setDokumenList] = useState([]);
    const [catatanRevisiList, setCatatanRevisiList] = useState([]);
    const [logProsesList, setLogProsesList] = useState([]);
    const [masterProses, setMasterProses] = useState([]);
    const [loadingDokumen, setLoadingDokumen] = useState(false);
    const [loadingLog, setLoadingLog] = useState(false);
    const [fileRekomendasi, setFileRekomendasi] = useState(null);
    const [isSelesaikan, setIsSelesaikan] = useState(false);
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
    const [showConfirmSelesai, setShowConfirmSelesai] = useState(false);
    const [buktiMaju, setBuktiMaju] = useState([]);
    const [keteranganMaju, setKeteranganMaju] = useState('');
    const [isSubmittingMaju, setIsSubmittingMaju] = useState(false);
    const [showConfirmMaju, setShowConfirmMaju] = useState(false);

    const [showMundurPanel, setShowMundurPanel] = useState(false);
    const [targetMundur, setTargetMundur] = useState('');
    const [alasanMundur, setAlasanMundur] = useState('');
    const [buktiMundur, setBuktiMundur] = useState([]);
    const [isSubmittingMundur, setIsSubmittingMundur] = useState(false);
    const [showConfirmMundur, setShowConfirmMundur] = useState(false);
    const buktiMundurRef = useRef(null);

    const statusVerifikasi = surat?.status_verifikasi || surat?.status;
    const isDisetujui = statusVerifikasi === 'Disetujui';
    const canManageProses = userRole === 'admin' && !isVerificationMode && isDisetujui && surat?.status !== 'Selesai';

    const tahapAktif = logProsesList[0] || null;
    const namaTahapAktif = tahapAktif?.proses?.nama_proses || 'Penjadwalan Rapat';

    const URUTAN_TAHAPAN = [
        'Penjadwalan Rapat',
        'Pelaksanaan Rapat Fasilitasi',
        'Penyusunan Draft Rekomendasi/Hasil Fasilitasi',
        'Proses Penandatanganan'
    ];
    const idxAktif = URUTAN_TAHAPAN.indexOf(namaTahapAktif);
    const namaTahapBerikutnya = idxAktif >= 0 && idxAktif < URUTAN_TAHAPAN.length - 1
        ? URUTAN_TAHAPAN[idxAktif + 1]
        : null;
    const prosesBerikutnya = masterProses.find(p => p.nama_proses === namaTahapBerikutnya);
    const isLastStage = idxAktif === URUTAN_TAHAPAN.length - 1;
    const tahapanMundurOption = masterProses.filter(p => URUTAN_TAHAPAN.indexOf(p.nama_proses) < idxAktif);

    useEffect(() => {
        if (!surat?.id_pengajuan) return;
        fetchDokumen();
        fetchCatatanRevisi();
        fetchLogProses();
        if (userRole === 'admin') fetchMasterProses();
    }, [surat]);

    const fetchDokumen = async () => {
        try {
            setLoadingDokumen(true);
            const r = await pengajuanAPI.getDokumen(surat.id_pengajuan);
            if (r.success) setDokumenList(r.data);
        } catch { setDokumenList([]); } finally { setLoadingDokumen(false); }
    };

    const fetchCatatanRevisi = async () => {
        try {
            const r = await pengajuanAPI.getCatatanRevisi(surat.id_pengajuan);
            if (r.success) setCatatanRevisiList(r.data);
        } catch { setCatatanRevisiList([]); }
    };

    const fetchLogProses = async () => {
        try {
            setLoadingLog(true);
            const r = await prosesAPI.getLogByPengajuan(surat.id_pengajuan);
            if (r.success) setLogProsesList(r.data);
        } catch { setLogProsesList([]); } finally { setLoadingLog(false); }
    };

    const fetchMasterProses = async () => {
        try {
            const r = await prosesAPI.getAllProses();
            if (r.success) setMasterProses(r.data);
        } catch { setMasterProses(TAHAPAN_PROSES.map(t => ({ id_proses: t.id, nama_proses: t.label }))); }
    };

    if (!surat) return null;

    const showSuccess = (title, message, type = 'success') =>
        setSuccessModal({ isOpen: true, title, message, type });

    const handleAccept = async () => {
        try {
            setIsProcessing(true);
            const result = await pengajuanAPI.acceptPengajuan(surat.id_pengajuan);
            if (result.success) {
                showSuccess('Dokumen Diterima', `Pengajuan dari ${surat.pemohon} disetujui. Proses Penjadwalan Rapat dimulai.`);
            }
        } catch (err) {
            showSuccess('Terjadi Kesalahan', err.message, 'error');
        } finally { setIsProcessing(false); }
    };

    const handleRevision = async (catatan) => {
        try {
            const result = await pengajuanAPI.updateStatus(surat.id_pengajuan, {
                status_verifikasi: 'Perlu Perbaikan',
                catatan_revisi: catatan,
                created_by: user?.username || user?.kabupaten_kota || 'admin'
            });
            if (result.success) {
                showSuccess('Dokumen Dikembalikan', `Dokumen dikembalikan ke ${surat.pemohon} untuk perbaikan.`);
                setShowRevisionModal(false);
            }
        } catch (err) { showSuccess('Terjadi Kesalahan', err.message, 'error'); }
    };

    const handleAddLogProses = async ({ idProses, keterangan, files, isMundur = false, onSuccess }) => {
        try {
            const result = await prosesAPI.addLogProses(surat.id_pengajuan, idProses, keterangan, files, isMundur);
            if (result.success) onSuccess();
        } catch (err) {
            showSuccess('Terjadi Kesalahan', err.message || 'Gagal menyimpan proses.', 'error');
        }
    };

    const handleMaju = async () => {
        if (!prosesBerikutnya) return;
        setIsSubmittingMaju(true);
        setShowConfirmMaju(false);
        await handleAddLogProses({
            idProses: prosesBerikutnya.id_proses,
            keterangan: keteranganMaju || `Selesai: ${namaTahapAktif}. Masuk: ${namaTahapBerikutnya}`,
            files: buktiMaju,
            onSuccess: () => {
                showSuccess(
                    'Proses Dilanjutkan!',
                    `"${namaTahapAktif}" selesai. Proses kini masuk ke "${namaTahapBerikutnya}".`
                );
                setBuktiMaju([]);
                setKeteranganMaju('');
            }
        });
        setIsSubmittingMaju(false);
    };

    const handleConfirmMaju = () => {
        if (!prosesBerikutnya) return;
        setShowConfirmMaju(true);
    };

    const handleTambahBuktiMaju = (e) => {
        const newFiles = Array.from(e.target.files);
        setBuktiMaju(prev => {
            const existing = prev.map(f => f.name);
            const filtered = newFiles.filter(f => !existing.includes(f.name));
            return [...prev, ...filtered];
        });
        e.target.value = '';
    };

    const handleHapusBuktiMaju = (index) => {
        setBuktiMaju(prev => prev.filter((_, i) => i !== index));
    };

    const handleConfirmMundur = () => {
        if (!alasanMundur.trim()) {
            showSuccess('Alasan Wajib', 'Wajib isi alasan pemunduran proses.', 'error');
            return;
        }
        const resolvedTarget = tahapanMundurOption.length === 1
            ? String(tahapanMundurOption[0].id_proses)
            : targetMundur;
        if (!resolvedTarget) {
            showSuccess('Pilih Tahap', 'Pilih tahap tujuan mundur terlebih dahulu.', 'error');
            return;
        }
        setShowConfirmMundur(true);
    };

    const handleMundur = async () => {
        const resolvedTarget = tahapanMundurOption.length === 1
            ? String(tahapanMundurOption[0].id_proses)
            : targetMundur;
        setIsSubmittingMundur(true);
        setShowConfirmMundur(false);
        const targetObj = masterProses.find(p => p.id_proses === parseInt(resolvedTarget));
        await handleAddLogProses({
            idProses: resolvedTarget,
            keterangan: `[MUNDUR] ${alasanMundur}`,
            files: buktiMundur,
            isMundur: true,
            onSuccess: () => {
                showSuccess(
                    'Proses Dikembalikan',
                    `Proses dikembalikan ke "${targetObj?.nama_proses}". Alasan tercatat.`
                );
                setShowMundurPanel(false);
                setTargetMundur('');
                setAlasanMundur('');
                setBuktiMundur([]);
                if (buktiMundurRef.current) buktiMundurRef.current.value = '';
            }
        });
        setIsSubmittingMundur(false);
    };

    const handleSelesaikanPengajuan = async () => {
        if (!fileRekomendasi) {
            showSuccess('File Belum Dipilih', 'Harap upload surat rekomendasi terlebih dahulu.', 'error');
            return;
        }
        setShowConfirmSelesai(true);
    };

    const executeSelesaikan = async () => {
        try {
            setIsSelesaikan(true);
            const result = await pengajuanAPI.selesaikanPengajuan(surat.id_pengajuan, fileRekomendasi);
            if (result.success) {
                showSuccess('Pengajuan Diselesaikan', 'Surat rekomendasi diunggah dan status diubah menjadi "Selesai".');
            }
        } catch (err) {
            showSuccess('Terjadi Kesalahan', err.message, 'error');
        } finally { setIsSelesaikan(false); }
    };

    const toRelativePath = (filePath) => {
        if (!filePath) return '';
        const normalized = filePath.replace(/\\/g, '/');
        if (normalized.startsWith('/uploads/')) return normalized;
        const match = normalized.match(/(\/uploads\/.+)$/);
        return match ? match[1] : '';
    };

    const openFile = (filePath) => {
        const rel = toRelativePath(filePath);
        if (!rel) return;
        window.open(`${BASE_URL}${rel}`, '_blank');
    };

    const downloadFile = (filePath, nama) => {
        const rel = toRelativePath(filePath);
        if (!rel) { showSuccess('Error', 'Path file tidak valid', 'error'); return; }
        const a = document.createElement('a');
        a.href = `${BASE_URL}/api/proses/download?path=${encodeURIComponent(rel)}`;
        a.download = nama || rel.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                                <p className="font-semibold text-gray-900">{formatDate(surat.tanggal)}</p>
                            </div>
                            {userRole === 'kab/kota' && (
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Jenis Layanan</p>
                                    <p className="font-semibold text-gray-900">{surat.nama_layanan || '-'}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Status Saat Ini</p>
                                <div className="mt-1"><StatusBadge status={surat.status} /></div>
                            </div>
                        </div>

                        {/* VERIFIKASI (Menunggu Verifikasi) */}
                        {userRole === 'admin' && isVerificationMode && statusVerifikasi === 'Menunggu Verifikasi' && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <AlertCircle className="w-6 h-6 text-navy-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-1">Verifikasi Kelengkapan Dokumen</h3>
                                        <p className="text-sm text-blue-800">
                                            Periksa kelengkapan dokumen. Jika lengkap, klik "Terima" — pengajuan otomatis masuk ke tahap Penjadwalan Rapat.
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
                                        Terima &amp; Lanjutkan Proses
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

                        {/*  KELOLA PROSES */}
                        {canManageProses && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">

                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#1e3a5f] animate-pulse" />
                                        <h3 className="text-sm font-semibold text-gray-800">Kelola Proses Pengajuan</h3>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-0.5">
                                        {namaTahapAktif}
                                    </span>
                                </div>

                                {/* Stepper */}
                                <div className="px-4 py-4 bg-white border-b border-gray-100">
                                    <div className="flex items-center">
                                        {URUTAN_TAHAPAN.map((label, i) => {
                                            const done = i < idxAktif;
                                            const active = i === idxAktif;
                                            const shortLabel = ['Penjadwalan', 'Pelaksanaan', 'Penyusunan', 'Penandatanganan'][i];
                                            return (
                                                <div key={label} className="flex items-center flex-1 last:flex-none">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${active ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-md'
                                                            : done ? 'bg-[#e8f0f9] border-[#1e3a5f] text-[#1e3a5f]'
                                                                : 'bg-white border-gray-300 text-gray-400'
                                                            }`}>
                                                            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                                        </div>
                                                        <span className={`text-[10px] leading-tight text-center font-medium ${active ? 'text-[#1e3a5f]' : done ? 'text-[#1e3a5f]' : 'text-gray-400'
                                                            }`}>{shortLabel}</span>
                                                    </div>
                                                    {i < URUTAN_TAHAPAN.length - 1 && (
                                                        <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-4 py-4 space-y-4 bg-white">

                                    {/*Tahap Terakhir*/}
                                    {isLastStage ? (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                                                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                <p className="text-sm text-green-800">
                                                    <strong>Langkah terakhir.</strong> Upload surat rekomendasi yang sudah ditandatangani untuk menyelesaikan pengajuan ini.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Surat Rekomendasi <span className="text-red-500">*</span>
                                                    <span className="text-xs font-normal text-gray-400 ml-1">(PDF / Word)</span>
                                                </label>
                                                <label className={`flex items-center gap-3 border border-dashed rounded-lg px-4 py-3 cursor-pointer transition-colors ${fileRekomendasi ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'}`}>
                                                    <Upload className={`w-5 h-5 shrink-0 ${fileRekomendasi ? 'text-green-500' : 'text-gray-400'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        {fileRekomendasi
                                                            ? <><p className="text-sm font-medium text-green-700 truncate">{fileRekomendasi.name}</p><p className="text-xs text-green-500">Klik untuk ganti</p></>
                                                            : <><p className="text-sm text-gray-500">Klik untuk pilih file</p><p className="text-xs text-gray-400">PDF, DOC, DOCX</p></>}
                                                    </div>
                                                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFileRekomendasi(e.target.files[0])} disabled={isSelesaikan} className="hidden" />
                                                </label>
                                            </div>

                                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                                ⚠️ Setelah diselesaikan, status pengajuan tidak dapat diubah kembali.
                                            </p>

                                            <button
                                                onClick={handleSelesaikanPengajuan}
                                                disabled={isSelesaikan || !fileRekomendasi}
                                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {isSelesaikan
                                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Menyimpan...</>
                                                    : <><Check className="w-4 h-4" />Selesaikan Pengajuan &amp; Upload Surat Rekomendasi</>}
                                            </button>
                                        </div>

                                    ) : (
                                        /* ─ Tahap Biasa ─ */
                                        <div className="space-y-3">
                                            <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                                Selesaikan tahap <strong className="text-gray-700">"{namaTahapAktif}"</strong> lalu lanjut ke tahap berikutnya.
                                                {namaTahapAktif === 'Penjadwalan Rapat' && <span> Bukti opsional, contoh: surat undangan.</span>}
                                                {namaTahapAktif === 'Pelaksanaan Rapat Fasilitasi' && <span> Bukti opsional, contoh: notulen, daftar hadir.</span>}
                                                {namaTahapAktif === 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi' && <span> Bukti opsional, contoh: draft rekomendasi.</span>}
                                            </p>

                                            {/* Upload bukti dukung opsional dengan daftar file */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Bukti Dukung <span className="text-xs font-normal text-gray-400 ml-1">(opsional, bisa banyak file)</span>
                                                </label>

                                                {/* Daftar file yang sudah dipilih */}
                                                {buktiMaju.length > 0 && (
                                                    <div className="mb-2 space-y-1">
                                                        {buktiMaju.map((f, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-[#e8f0f9] border border-[#1e3a5f]/20 rounded-lg px-3 py-1.5">
                                                                <FileText className="w-3.5 h-3.5 text-[#1e3a5f] shrink-0" />
                                                                <span className="text-xs text-[#1e3a5f] flex-1 truncate">{f.name}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleHapusBuktiMaju(i)}
                                                                    disabled={isSubmittingMaju}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Tombol tambah file */}
                                                <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-[#1e3a5f]/50 hover:bg-[#e8f0f9]/30 transition-colors">
                                                    <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <span className="text-sm text-gray-500">
                                                        {buktiMaju.length === 0 ? 'Tambah file bukti (opsional)' : 'Tambah file lagi'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        disabled={isSubmittingMaju}
                                                        onChange={handleTambahBuktiMaju}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Keterangan <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                                                </label>
                                                <textarea
                                                    value={keteranganMaju}
                                                    onChange={e => setKeteranganMaju(e.target.value)}
                                                    disabled={isSubmittingMaju}
                                                    rows={2}
                                                    placeholder={`Catatan singkat tentang ${namaTahapAktif.toLowerCase()}...`}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#1e3a5f]/40 focus:ring-1 focus:ring-[#1e3a5f]/20"
                                                />
                                            </div>

                                            <button
                                                onClick={handleConfirmMaju}
                                                disabled={isSubmittingMaju}
                                                className="w-full bg-[#1e3a5f] hover:bg-[#16304f] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {isSubmittingMaju
                                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Menyimpan...</>
                                                    : <><Check className="w-4 h-4" />Selesaikan Tahap Ini &amp; Lanjut ke "{namaTahapBerikutnya}"</>}
                                            </button>
                                        </div>
                                    )}

                                    {/* ─ Kembalikan (collapsible) ─ */}
                                    {idxAktif > 0 && (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setShowMundurPanel(v => !v)}
                                                className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-gray-400" />
                                                    Kembalikan ke Tahap Sebelumnya
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showMundurPanel ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showMundurPanel && (
                                                <div className="px-4 pb-4 pt-3 space-y-3 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500">Gunakan jika ada kendala. Wajib isi alasan, bukti opsional.</p>

                                                    {tahapanMundurOption.length > 1 && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Mundur ke Tahap *</label>
                                                            <select
                                                                value={targetMundur}
                                                                onChange={e => setTargetMundur(e.target.value)}
                                                                disabled={isSubmittingMundur}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                                                            >
                                                                <option value="">-- Pilih --</option>
                                                                {tahapanMundurOption.map(p => (
                                                                    <option key={p.id_proses} value={p.id_proses}>{p.nama_proses}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Alasan *</label>
                                                        <textarea
                                                            value={alasanMundur}
                                                            onChange={e => setAlasanMundur(e.target.value)}
                                                            disabled={isSubmittingMundur}
                                                            rows={2}
                                                            placeholder="Misal: Rapat dibatalkan karena quorum tidak terpenuhi..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Bukti <span className="text-gray-400 font-normal">(opsional)</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                                                            <Upload className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                            <span className="text-xs text-gray-500 flex-1">
                                                                {buktiMundur.length > 0 ? `${buktiMundur.length} file dipilih` : 'Pilih file (opsional)'}
                                                            </span>
                                                            <input ref={buktiMundurRef} type="file" multiple disabled={isSubmittingMundur} onChange={e => setBuktiMundur(Array.from(e.target.files))} className="hidden" />
                                                        </label>
                                                    </div>

                                                    <button
                                                        onClick={handleConfirmMundur}
                                                        disabled={isSubmittingMundur || !alasanMundur.trim() || (tahapanMundurOption.length > 1 && !targetMundur)}
                                                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                                                    >
                                                        {isSubmittingMundur
                                                            ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Menyimpan...</>
                                                            : <>
                                                                <AlertCircle className="w-3.5 h-3.5" />
                                                                Kembalikan ke "{tahapanMundurOption.length === 1
                                                                    ? tahapanMundurOption[0]?.nama_proses
                                                                    : (masterProses.find(p => p.id_proses === parseInt(targetMundur))?.nama_proses || '...')}"
                                                            </>}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                        {/* LOG PROSES (timeline) */}
                        {(isDisetujui || surat.status === 'Selesai') && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-navy-600" />
                                    Riwayat Tahapan Proses
                                    {logProsesList.length > 0 && <span className="text-sm font-normal text-gray-500">({logProsesList.length} aktivitas)</span>}
                                </h3>
                                {loadingLog ? (
                                    <p className="text-gray-500 text-sm">Memuat log proses...</p>
                                ) : logProsesList.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Belum ada log proses.</p>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                                        <div className="space-y-4">
                                            {logProsesList.map((log, idx) => (
                                                <div key={log.id_log} className="flex gap-4 relative">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${idx === 0 ? 'bg-navy-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                        <span className="text-xs font-bold">{logProsesList.length - idx}</span>
                                                    </div>
                                                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className={`text-sm font-semibold ${idx === 0 ? 'text-navy-700' : 'text-gray-700'}`}>
                                                                {log.proses?.nama_proses || '-'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{formatDateTime(log.created_at)}</span>
                                                        </div>
                                                        {log.keterangan && (
                                                            <p className="text-sm text-gray-600 mb-3">{log.keterangan}</p>
                                                        )}
                                                        {/* Bukti dukung */}
                                                        {log.bukti_dukung && log.bukti_dukung.length > 0 && (
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 mb-1.5">Bukti Dukung ({log.bukti_dukung.length} file):</p>
                                                                <div className="space-y-1">
                                                                    {log.bukti_dukung.map(b => (
                                                                        <div key={b.id_bukti} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded px-2.5 py-1.5">
                                                                            <FileText className="w-3.5 h-3.5 text-navy-500 shrink-0" />
                                                                            <span className="flex-1 truncate">{b.nama_file}</span>
                                                                            <button onClick={() => openFile(b.file_path)} className="text-navy-600 hover:text-navy-800 font-medium">Lihat</button>
                                                                            <button onClick={() => downloadFile(b.file_path, b.nama_file)} className="text-green-600 hover:text-green-800 font-medium">Unduh</button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── CATATAN REVISI untuk pemohon ── */}
                        {userRole === 'kab/kota' && catatanRevisiList.length > 0 && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-red-900 mb-1">Catatan Perbaikan dari Admin</h3>
                                        {catatanRevisiList.map((c, i) => (
                                            <div key={c.id_catatan_revisi} className={i > 0 ? 'mt-3 pt-3 border-t border-red-200' : ''}>
                                                <p className="text-sm text-red-800 whitespace-pre-line">{c.catatan}</p>
                                                <p className="text-xs text-red-500 mt-1">{formatDateTime(c.created_at)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── HISTORY CATATAN REVISI untuk admin ── */}
                        {userRole === 'admin' && catatanRevisiList.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">History Catatan Revisi ({catatanRevisiList.length})</h3>
                                <div className="space-y-3">
                                    {catatanRevisiList.map((catatan, index) => (
                                        <div key={catatan.id_catatan_revisi} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">#{catatanRevisiList.length - index}</span>
                                                    <span className="text-sm font-medium text-amber-900">oleh: {catatan.created_by}</span>
                                                </div>
                                                <span className="text-xs text-gray-600">{formatDateTime(catatan.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-gray-800 whitespace-pre-line">{catatan.catatan}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── CATATAN PEMOHON ── */}
                        {surat.catatan_pemohon && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-900 mb-1">Catatan Pemohon:</p>
                                <p className="text-sm text-blue-800">{surat.catatan_pemohon}</p>
                            </div>
                        )}

                        {/* ── DOKUMEN DIUPLOAD ── */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Dokumen yang Diupload</h3>
                            {loadingDokumen ? (
                                <p className="text-gray-500 text-center py-8">Memuat dokumen...</p>
                            ) : dokumenList.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Tidak ada dokumen</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dokumenList.map((dok, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {dok.persyaratan?.nama_dokumen || dok.jenis_dokumen || 'Dokumen'}
                                                </p>
                                                {dok.persyaratan?.format_file && (
                                                    <p className="text-xs text-gray-500 mt-0.5">Format: {dok.persyaratan.format_file}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <FileText className="w-5 h-5 text-navy-600 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{dok.nama_file}</p>
                                                        <p className="text-xs text-gray-500">{formatDateTime(dok.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button onClick={() => openFile(dok.path_file)} className="text-navy-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-navy-50 border border-blue-200 text-sm font-medium">
                                                        <Eye className="w-4 h-4" />Lihat
                                                    </button>
                                                    <button onClick={() => downloadFile(dok.path_file, dok.nama_file)} className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 border border-green-200 text-sm font-medium">
                                                        <Download className="w-4 h-4" />Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── DOKUMEN REKOMENDASI (Selesai) ── */}
                        {surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Surat Rekomendasi Final</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-green-50 px-4 py-2 border-b border-green-100">
                                        <p className="text-sm font-semibold text-green-900">Surat Rekomendasi (Dokumen Final)</p>
                                        <p className="text-xs text-green-700 mt-0.5">Diselesaikan: {formatDate(surat.tanggal_selesai)}</p>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                                        <div className="flex items-center gap-3 flex-1">
                                            <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                            <p className="text-sm font-medium text-gray-900">
                                                {userRole === 'admin'
                                                    ? `Rekomendasi_${surat.pemohon?.replace(/\s+/g, '_')}.pdf`
                                                    : 'Surat Rekomendasi'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button onClick={() => openFile(surat.file_surat_rekomendasi)} className="text-navy-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-navy-50 border border-blue-200 text-sm font-medium">
                                                <Eye className="w-4 h-4" />Lihat
                                            </button>
                                            <button onClick={() => downloadFile(surat.file_surat_rekomendasi, `Rekomendasi_${surat.id_pengajuan}.pdf`)} className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 border border-green-200 text-sm font-medium">
                                                <Download className="w-4 h-4" />Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
            </div >

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
                message="Yakin akan menyelesaikan pengajuan ini? Status tidak dapat diubah kembali setelah diselesaikan."
                confirmText="Ya, Selesaikan"
                cancelText="Batal"
                confirmColor="green"
                onClose={() => setShowConfirmSelesai(false)}
                onConfirm={() => { setShowConfirmSelesai(false); executeSelesaikan(); }}
            />

            {/* Confirm Modal Lanjut Proses */}
            {showConfirmMaju && (
                <div className="fixed inset-0 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#e8f0f9] rounded-full p-3">
                                    <ArrowRight className="w-10 h-10 text-[#1e3a5f]" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Konfirmasi Lanjut Proses</h3>
                            <p className="text-sm text-gray-500 text-center mb-5">Yakin ingin menyelesaikan tahap ini?</p>

                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Dari Tahap</span>
                                    <span className="text-sm font-medium text-gray-800">{namaTahapAktif}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Ke Tahap</span>
                                    <span className="text-sm font-medium text-[#1e3a5f]">{namaTahapBerikutnya}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Bukti Dukung</span>
                                    <span className={`text-sm ${buktiMaju.length > 0 ? 'text-gray-800' : 'text-amber-600'}`}>
                                        {buktiMaju.length > 0
                                            ? `${buktiMaju.length} file (${buktiMaju.map(f => f.name).join(', ')})`
                                            : '⚠ Tidak ada (opsional)'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Keterangan</span>
                                    <span className="text-sm text-gray-600 italic">
                                        {keteranganMaju.trim() || <span className="text-gray-400">Tidak ada</span>}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmMaju(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleMaju}
                                    className="flex-1 bg-[#1e3a5f] hover:bg-[#16304f] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition shadow-md"
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal Kembalikan Proses */}
            {showConfirmMundur && (() => {
                const resolvedTarget = tahapanMundurOption.length === 1
                    ? String(tahapanMundurOption[0].id_proses)
                    : targetMundur;
                const targetObj = masterProses.find(p => p.id_proses === parseInt(resolvedTarget));
                return (
                    <div className="fixed inset-0 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-red-50 rounded-full p-3">
                                        <AlertCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Konfirmasi Kembalikan Proses</h3>
                                <p className="text-sm text-gray-500 text-center mb-5">Proses akan dikembalikan ke tahap sebelumnya.</p>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Dari Tahap</span>
                                        <span className="text-sm font-medium text-gray-800">{namaTahapAktif}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Ke Tahap</span>
                                        <span className="text-sm font-medium text-red-600">{targetObj?.nama_proses || '-'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Alasan</span>
                                        <span className="text-sm text-gray-700 italic">{alasanMundur}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 pt-0.5">Bukti Dukung</span>
                                        <span className="text-sm text-gray-600">
                                            {buktiMundur.length > 0
                                                ? `${buktiMundur.length} file (${buktiMundur.map(f => f.name).join(', ')})`
                                                : <span className="text-gray-400">Tidak ada (opsional)</span>}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirmMundur(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleMundur}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition shadow-md"
                                    >
                                        Ya, Kembalikan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default DetailSuratModal;
