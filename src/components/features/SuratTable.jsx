import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';

const SuratTable = ({ data, isPemohon = false, showTahapan = false, onDetailClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

    const getTahapanBadge = (tahapan) => {
        if (!tahapan) return <span className="text-gray-500 text-sm">-</span>;

        const badges = {
            'Penjadwalan Rapat': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Pelaksanaan Rapat Fasilitasi': 'bg-orange-100 text-orange-800 border-orange-300',
            'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 'bg-blue-100 text-blue-800 border-blue-300',
            'Proses Penandatanganan': 'bg-green-100 text-green-800 border-green-300'
        };

        const colorClass = badges[tahapan] || 'bg-gray-100 text-gray-800 border-gray-300';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                {tahapan}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            {!isPemohon && <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Cari pemohon atau layanan" />}

            {searchQuery && !isPemohon && (
                <div className="text-sm text-gray-600">
                    Menampilkan {sortedData.length} dari {data.length} surat
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
                        {sortedData && sortedData.length > 0 ? (
                            sortedData.map((surat, index) => (
                                <tr key={surat.id_pengajuan} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
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
                                        {showTahapan ? getTahapanBadge(surat.tahapan_proses) : <StatusBadge status={surat.status} dokumenLengkap={true} />}
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
                                        <button
                                            onClick={() => onDetailClick(surat)}
                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Detail
                                        </button>
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
        </div>
    );
};

export default SuratTable;
