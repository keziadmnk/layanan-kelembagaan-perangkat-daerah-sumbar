import { useState } from 'react';
import { X, CheckCircle, Download, FileText, Upload, AlertCircle, Check, XCircle, Clock, History } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { tahapanProses } from '../../constants/mockData';
import { getModuleSpecificStageName } from '../../constants/modules';
import RevisionModal from './RevisionModal';
import UploadPerbaikanModal from './UploadPerbaikanModal';

const DetailSuratModal = ({ surat, onClose, userRole }) => {
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!surat) return null;

    const handleAccept = () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Dokumen ${surat.id} diterima dan akan diproses lebih lanjut`);
            setIsProcessing(false);
            onClose();
        }, 500);
    };

    const handleRevision = (catatan) => {
        console.log('Catatan revisi:', catatan);
        alert(`Dokumen ${surat.id} dikembalikan kepada ${surat.pemohon} untuk perbaikan`);
    };

    const handleUploadPerbaikan = () => {
        alert(`Dokumen perbaikan untuk ${surat.id} berhasil diupload dan akan diverifikasi ulang oleh admin`);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-2xl font-bold text-gray-900">Detail Surat {surat.id}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Pemohon</p>
                                <p className="font-semibold text-gray-900">{surat.pemohon}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                                <p className="font-semibold text-gray-900">{surat.tanggal}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status Saat Ini</p>
                                <StatusBadge status={surat.status} dokumenLengkap={surat.dokumenLengkap} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status Verifikasi</p>
                                <p className={`font-semibold ${surat.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {surat.isVerified ? '✓ Terverifikasi' : '⏳ Menunggu Verifikasi'}
                                </p>
                            </div>
                        </div>

                        {userRole === 'admin' && !surat.isVerified && surat.status === 'Menunggu Verifikasi' && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
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

                        {userRole === 'pemohon' && surat.revisionNotes && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-900 mb-2">Dokumen Perlu Diperbaiki</h3>
                                        <p className="text-sm text-red-800 whitespace-pre-line">{surat.revisionNotes}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 mt-3"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload Dokumen Perbaikan
                                </button>
                            </div>
                        )}

                        {surat.revisionHistory && surat.revisionHistory.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Riwayat Perbaikan
                                </h3>
                                <div className="space-y-3">
                                    {surat.revisionHistory.map((revision, index) => (
                                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="text-sm font-medium text-gray-900">{revision.oleh}</p>
                                                <p className="text-xs text-gray-500">{revision.tanggal}</p>
                                            </div>
                                            <p className="text-sm text-gray-700 whitespace-pre-line">{revision.catatan}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {surat.catatan && !surat.revisionNotes && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-900 mb-1">Catatan:</p>
                                <p className="text-sm text-blue-800">{surat.catatan}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Tahapan Proses</h3>
                            <div className="space-y-3">
                                {tahapanProses.map((tahap, index) => {
                                    const displayName = getModuleSpecificStageName(surat.moduleId, tahap);
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${index < surat.tahapan
                                                    ? 'bg-green-500 text-white'
                                                    : index === surat.tahapan
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                    }`}
                                            >
                                                {index < surat.tahapan ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <span className="text-sm">{index + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-medium ${index <= surat.tahapan ? 'text-gray-900' : 'text-gray-400'
                                                        }`}
                                                >
                                                    {displayName}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Dokumen</h3>
                            <div className="space-y-2">
                                {['Surat Pengantar Bupati', 'Matriks Pengelompokan Urusan', 'ABK Disahkan'].map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm text-gray-700">{doc}</span>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                            <Download className="w-4 h-4" />
                                            <span className="text-sm">Download</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {userRole === 'admin' && surat.isVerified && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Update Status</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ubah Status
                                        </label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Pilih Status Baru</option>
                                            {tahapanProses.map((tahap, index) => {
                                                const displayName = getModuleSpecificStageName(surat.moduleId, tahap);
                                                return (
                                                    <option key={index}>{displayName}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Catatan
                                        </label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Tambahkan catatan (opsional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Dokumen Pendukung
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Klik atau drag & drop file</p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, Word, Excel (max. 10MB)</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium">
                                        Simpan Perubahan
                                    </button>
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
                suratId={surat.id}
                pemohon={surat.pemohon}
            />
            <UploadPerbaikanModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                surat={surat}
                onSubmit={handleUploadPerbaikan}
            />
        </>
    );
};

export default DetailSuratModal;
