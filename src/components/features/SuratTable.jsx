import { Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SearchBar from '../common/SearchBar';
import { getModuleById, getModuleColor } from '../../constants/modules';

const SuratTable = ({ data, isPemohon = false, onDetailClick }) => {
    return (
        <div className="space-y-4">
            <SearchBar />

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No. Registrasi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Modul
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
                        {data.map((surat) => {
                            const module = getModuleById(surat.moduleId);
                            return (
                                <tr key={surat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {surat.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getModuleColor(surat.moduleId)}`}>
                                            {module?.icon} {module?.shortName}
                                        </span>
                                    </td>
                                    {!isPemohon && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {surat.pemohon}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {surat.tanggal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={surat.status} dokumenLengkap={surat.dokumenLengkap} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${surat.dokumenLengkap ? 'bg-blue-600' : 'bg-red-500'
                                                        }`}
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuratTable;
