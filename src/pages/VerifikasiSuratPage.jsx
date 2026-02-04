import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import { pengajuanAPI } from '../services/api';

const VerifikasiSuratPage = ({ onDetailClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState(null); // null = Semua, 'menunggu' = Menunggu Verifikasi, 'perbaikan' = Perlu Perbaikan
    const itemsPerPage = 10;

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

    // Filter by status first
    const statusFilteredData = data.filter(surat => {
        if (selectedFilter === null) return true; // Semua
        if (selectedFilter === 'menunggu') return surat.status === 'Menunggu Verifikasi';
        if (selectedFilter === 'perbaikan') return surat.status === 'Perlu Perbaikan';
        return true;
    });

    // Then filter by search term
    const filteredData = statusFilteredData.filter(surat => {
        if (!searchTerm.trim()) return true;
        const pemohonName = surat.pemohon?.toLowerCase() || '';
        const namaLayanan = surat.nama_layanan?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return pemohonName.includes(search) || namaLayanan.includes(search);
    });

    // Sorting data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        if (sortConfig.key === 'tanggal') {
            const dateA = new Date(a.tanggal);
            const dateB = new Date(b.tanggal);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        return 0;
    });

    // Toggle sorting
    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Get sort icon
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 text-navy-600" />
            : <ArrowDown className="w-4 h-4 text-navy-600" />;
    };

    // Pagination calculations
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Handle search - reset to page 1 when searching
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
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
                        className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    {/* Kiri: Judul + Kategori */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Verifikasi Surat</h2>
                        {/* Filter Status - Seperti Module Selector */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => {
                                    setSelectedFilter(null);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedFilter === null
                                    ? 'bg-navy-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Semua</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedFilter('menunggu');
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedFilter === 'menunggu'
                                    ? 'bg-navy-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <AlertCircle className="w-4 h-4" />
                                <span>Menunggu Verifikasi</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedFilter('perbaikan');
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedFilter === 'perbaikan'
                                    ? 'bg-navy-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Perlu Perbaikan</span>
                            </button>
                        </div>
                    </div>

                    {/* Kanan: Total Pengajuan */}
                    <div className="text-center ml-6">
                        <p className="text-sm text-gray-500 mb-1">Total Pengajuan</p>
                        <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Cari pemohon atau layanan"
                />

                <div className="overflow-x-auto mt-4">
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
                                    Layanan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('tanggal')}
                                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                                    >
                                        Tanggal
                                        {getSortIcon('tanggal')}
                                    </button>
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
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-lg font-medium">Tidak ada surat yang perlu diverifikasi</p>
                                        <p className="text-sm mt-1">Semua surat telah diverifikasi</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((surat, index) => (
                                    <tr
                                        key={surat.id_pengajuan}
                                        className="hover:bg-navy-50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => onDetailClick(surat)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">{startIndex + index + 1}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {surat.pemohon || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {surat.nama_layanan || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(surat.tanggal).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDetailClick(surat);
                                                }}
                                                className="text-navy-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {paginatedData.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedData.length}
                    />
                )}
            </div>
        </div>
    );
};

export default VerifikasiSuratPage;
