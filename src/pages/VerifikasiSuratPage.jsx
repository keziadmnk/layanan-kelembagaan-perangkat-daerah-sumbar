import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, Calendar, User } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import RevisionModal from '../components/features/RevisionModal';

const VerifikasiSuratPage = ({ data, onDetailClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [showRevisionModal, setShowRevisionModal] = useState(false);

    const suratBelumVerifikasi = data.filter(s => !s.isVerified);

    const filteredData = suratBelumVerifikasi.filter(surat =>
        surat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surat.pemohon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAccept = (surat) => {
        alert(`Surat ${surat.id} telah diverifikasi dan diterima untuk diproses lebih lanjut.`);
        console.log('Terima surat:', surat);
    };

    const handleReturn = (surat) => {
        setSelectedSurat(surat);
        setShowRevisionModal(true);
    };

    const handleSubmitRevision = (notes) => {
        console.log('Catatan revisi untuk', selectedSurat.id, ':', notes);
        alert(`Surat ${selectedSurat.id} dikembalikan untuk perbaikan.`);
        setShowRevisionModal(false);
        setSelectedSurat(null);
    };

    const getModuleName = (moduleId) => {
        const modules = {
            'evaluasi-kelembagaan': 'Evaluasi Kelembagaan',
            'ranperda': 'Ranperda/Ranperkada',
            'uptd': 'UPTD'
        };
        return modules[moduleId] || moduleId;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Verifikasi Surat</h1>
                    <p className="text-gray-600 mt-1">
                        Verifikasi kelengkapan dokumen surat yang baru masuk
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Menunggu Verifikasi"
                    value={suratBelumVerifikasi.filter(s => s.status === 'Menunggu Verifikasi').length}
                    icon={AlertCircle}
                    color="yellow"
                    trend={{ value: 0, isPositive: true }}
                />
                <StatCard
                    title="Perlu Perbaikan"
                    value={suratBelumVerifikasi.filter(s => s.status === 'Perlu Perbaikan').length}
                    icon={XCircle}
                    color="red"
                    trend={{ value: 0, isPositive: false }}
                />
                <StatCard
                    title="Total Belum Verifikasi"
                    value={suratBelumVerifikasi.length}
                    icon={FileText}
                    color="blue"
                    trend={{ value: 0, isPositive: false }}
                />
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Cari berdasarkan nomor registrasi atau pemohon..."
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    No. Registrasi
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pemohon
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Jenis Permohonan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Tanggal Masuk
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-lg font-medium">Tidak ada surat yang perlu diverifikasi</p>
                                        <p className="text-sm mt-1">Semua surat telah diverifikasi</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((surat) => (
                                    <tr
                                        key={surat.id}
                                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                                <span className="font-semibold text-blue-600">{surat.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-gray-900 font-medium">{surat.pemohon}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{getModuleName(surat.moduleId)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(surat.tanggal).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${surat.status === 'Menunggu Verifikasi'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {surat.status === 'Menunggu Verifikasi' && (
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {surat.status === 'Perlu Perbaikan' && (
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {surat.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDetailClick(surat);
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200"
                                                >
                                                    Detail
                                                </button>
                                                {surat.status === 'Menunggu Verifikasi' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAccept(surat);
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            Terima
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReturn(surat);
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                                        >
                                                            <XCircle className="h-3 w-3" />
                                                            Kembalikan
                                                        </button>
                                                    </>
                                                )}
                                                {surat.status === 'Perlu Perbaikan' && (
                                                    <span className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg">
                                                        Menunggu Perbaikan
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showRevisionModal && selectedSurat && (
                <RevisionModal
                    surat={selectedSurat}
                    onClose={() => {
                        setShowRevisionModal(false);
                        setSelectedSurat(null);
                    }}
                    onSubmit={handleSubmitRevision}
                />
            )}
        </div>
    );
};

export default VerifikasiSuratPage;
