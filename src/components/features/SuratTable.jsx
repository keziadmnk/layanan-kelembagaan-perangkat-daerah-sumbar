import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Edit, Download, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';

const SuratTable = ({ data, isPemohon = false, showTahapan = false, onDetailClick }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // search query (pemohon dan layanan)
    const filteredData = data.filter(surat => {
        if (!searchQuery.trim()) return true;

        const pemohonName = surat.pemohon?.toLowerCase() || '';
        const namaLayanan = surat.nama_layanan?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return pemohonName.includes(query) || namaLayanan.includes(query);
    });

    // Sorting data
    const sortedData = [...filteredData].sort((a, b) => {
        // Khusus untuk pemohon: pindahkan status "Selesai" ke paling bawah
        if (isPemohon) {
            const aIsSelesai = a.status === 'Selesai';
            const bIsSelesai = b.status === 'Selesai';

            // Jika salah satu selesai dan yang lain tidak, yang selesai ke bawah
            if (aIsSelesai && !bIsSelesai) return 1;
            if (!aIsSelesai && bIsSelesai) return -1;
            // Jika keduanya selesai atau keduanya tidak, lanjutkan sorting normal
        }

        if (!sortConfig.key) return 0;

        if (sortConfig.key === 'tanggal') {
            const dateA = new Date(a.tanggal);
            const dateB = new Date(b.tanggal);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (sortConfig.key === 'progress') {
            const progressA = a.progress || 0;
            const progressB = b.progress || 0;
            return sortConfig.direction === 'asc' ? progressA - progressB : progressB - progressA;
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
            ? <ArrowUp className="w-4 h-4 text-blue-600" />
            : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    // Pagination calculations
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Handle search - reset to page 1 when searching
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getTahapanBadge = (tahapan) => {
        if (!tahapan) return <span className="text-gray-500 text-sm">-</span>;

        const badges = {
            'Penjadwalan Rapat': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Pelaksanaan Rapat Fasilitasi': 'bg-orange-100 text-orange-800 border-orange-300',
            'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 'bg-blue-100 text-blue-800 border-blue-300',
            'Proses Penandatanganan': 'bg-blue-100 text-blue-800 border-blue-300'
        };

        const colorClass = badges[tahapan] || 'bg-gray-100 text-gray-800 border-gray-300';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colorClass}`}>
                {tahapan}
            </span>
        );
    };

    // Handler untuk preview surat rekomendasi
    const handlePreviewRekomendasi = (surat) => {
        if (!surat.file_surat_rekomendasi) {
            alert('Surat rekomendasi belum tersedia');
            return;
        }
        const baseURL = 'http://localhost:3001';
        window.open(`${baseURL}${surat.file_surat_rekomendasi}`, '_blank');
    };

    // Handler untuk download surat rekomendasi
    const handleDownloadRekomendasi = async (surat) => {
        if (!surat.file_surat_rekomendasi) {
            alert('Surat rekomendasi belum tersedia');
            return;
        }

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
    };

    return (
        <div className="space-y-4">
            {/* Search Bar - untuk admin dan pemohon */}
            <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={isPemohon ? "Cari layanan" : "Cari pemohon atau layanan"}
            />

            {/* Search Result Count */}
            {searchQuery && (
                <div className="text-sm text-gray-600">
                    Menampilkan {sortedData.length} dari {data.length} {isPemohon ? 'pengajuan' : 'surat'}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No
                            </th>
                            {!isPemohon && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pemohon
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Layanan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('tanggal')}
                                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                                >
                                    Tanggal
                                    {getSortIcon('tanggal')}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {showTahapan ? 'Tahapan Proses' : 'Status'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('progress')}
                                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                                >
                                    Progress
                                    {getSortIcon('progress')}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData && paginatedData.length > 0 ? (
                            paginatedData.map((surat, index) => (
                                <tr key={surat.id_pengajuan} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {startIndex + index + 1}
                                    </td>
                                    {!isPemohon && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {surat.pemohon || '-'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {surat.nama_layanan || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {surat.tanggal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {showTahapan ? (
                                            getTahapanBadge(surat.tahapan_proses)
                                        ) : isPemohon && surat.status === 'Dalam Proses' && surat.tahapan_proses ? (
                                            <StatusBadge
                                                status={surat.status}
                                                dokumenLengkap={true}
                                                tahapan={surat.tahapan_proses}
                                                showTahapan={true}
                                            />
                                        ) : (
                                            <StatusBadge status={surat.status} dokumenLengkap={true} />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600"
                                                    style={{ width: `${surat.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-900 font-medium">{surat.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            {/* Tombol Detail - Selalu ada */}
                                            <button
                                                onClick={() => onDetailClick(surat)}
                                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>

                                            {/* Tombol Revisi - Untuk Pemohon dengan status Perlu Perbaikan */}
                                            {isPemohon && surat.status === 'Perlu Perbaikan' && (
                                                <button
                                                    onClick={() => navigate(`/revisi/${surat.id_pengajuan}`)}
                                                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Perbaiki
                                                </button>
                                            )}

                                            {/* Link Surat Rekomendasi - Untuk Pemohon dengan status Selesai */}
                                            {isPemohon && surat.status === 'Selesai' && surat.file_surat_rekomendasi && (
                                                <button
                                                    onClick={() => handlePreviewRekomendasi(surat)}
                                                    className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1 transition-colors"
                                                    title="Lihat surat rekomendasi"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Surat Rekomendasi
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada data'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {paginatedData && paginatedData.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedData.length}
                />
            )}
        </div>
    );
};

export default SuratTable;
