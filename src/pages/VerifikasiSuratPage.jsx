import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, Calendar, User } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import { pengajuanAPI } from '../services/api';

const VerifikasiSuratPage = ({ onDetailClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [menungguRes, perbaikanRes] = await Promise.all([
                pengajuanAPI.getByStatus('Menunggu Verifikasi'),
                pengajuanAPI.getByStatus('Perlu Perbaikan')
            ]);

            const allData = [];
            if (menungguRes.success) {
                allData.push(...menungguRes.data);
            }
            if (perbaikanRes.success) {
                allData.push(...perbaikanRes.data);
            }

            setData(allData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(surat =>
        surat.pemohon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

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
                    value={data.filter(s => s.status === 'Menunggu Verifikasi').length}
                    icon={AlertCircle}
                    color="yellow"
                    trend={{ value: 0, isPositive: true }}
                />
                <StatCard
                    title="Perlu Perbaikan"
                    value={data.filter(s => s.status === 'Perlu Perbaikan').length}
                    icon={XCircle}
                    color="red"
                    trend={{ value: 0, isPositive: false }}
                />
                <StatCard
                    title="Total Belum Verifikasi"
                    value={data.length}
                    icon={FileText}
                    color="blue"
                    trend={{ value: 0, isPositive: false }}
                />
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Cari berdasarkan pemohon..."
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    No
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
                                filteredData.map((surat, index) => (
                                    <tr
                                        key={surat.id_pengajuan}
                                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => onDetailClick(surat)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">{index + 1}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-gray-900 font-medium">{surat.pemohon}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{surat.nama_layanan}</span>
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
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDetailClick(surat);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VerifikasiSuratPage;
