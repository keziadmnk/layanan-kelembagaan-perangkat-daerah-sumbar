import { Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';

const SuratTable = ({ data, isPemohon = false, onDetailClick }) => {
    // Helper untuk mendapatkan icon berdasarkan nama layanan
    const getModuleIcon = (namaLayanan) => {
        // ✅ NULL SAFETY: Cek apakah namaLayanan ada nilainya
        if (!namaLayanan) return '📄';

        const lower = namaLayanan.toLowerCase();
        if (lower.includes('evaluasi')) return '🏛️';
        if (lower.includes('ranperda')) return '📋';
        if (lower.includes('uptd')) return '🏢';
        return '📄';
    };

    // Helper untuk mendapatkan warna badge berdasarkan nama layanan
    const getModuleColor = (namaLayanan) => {
        // ✅ NULL SAFETY: Jika undefined/null, return default
        if (!namaLayanan) return 'bg-gray-100 text-gray-700 border-gray-300';

        const lower = namaLayanan.toLowerCase();
        if (lower.includes('evaluasi')) return 'bg-blue-100 text-blue-700 border-blue-300';
        if (lower.includes('ranperda')) return 'bg-green-100 text-green-700 border-green-300';
        if (lower.includes('uptd')) return 'bg-purple-100 text-purple-700 border-purple-300';
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <div className="space-y-4">
            <SearchBar />

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Layanan
                            </th>
                            {!isPemohon && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pemohon
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data && data.length > 0 ? (
                            data.map((surat) => (
                                <tr key={surat.id_pengajuan} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {surat.no}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getModuleColor(surat.nama_layanan)}`}>
                                            {getModuleIcon(surat.nama_layanan)} {surat.nama_layanan}
                                        </span>
                                    </td>
                                    {!isPemohon && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {surat.pemohon || '-'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {surat.tanggal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={surat.status} dokumenLengkap={true} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600"
                                                    style={{ width: `${surat.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">{surat.progress}%</span>
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
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Tidak ada data
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
