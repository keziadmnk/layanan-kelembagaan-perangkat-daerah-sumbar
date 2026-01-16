import { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SuratTable from '../components/features/SuratTable';
import ModuleCard from '../components/common/ModuleCard';
import ModuleSelector from '../components/features/ModuleSelector';
import { modules } from '../constants/modules';

const DashboardAdmin = ({ data, onDetailClick }) => {
    const [selectedModule, setSelectedModule] = useState(null);

    const filteredData = selectedModule
        ? data.filter(s => s.moduleId === selectedModule)
        : data;

    const getModuleStats = (moduleId) => {
        const moduleData = data.filter(s => s.moduleId === moduleId);
        return {
            total: moduleData.length,
            inProgress: moduleData.filter(s => !s.status.includes('Selesai') && s.dokumenLengkap).length,
            completed: moduleData.filter(s => s.status.includes('Selesai')).length,
            pending: moduleData.filter(s => !s.dokumenLengkap).length
        };
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h2>
                <p className="text-gray-600">Kelola semua pengajuan dari kabupaten/kota</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modules.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        stats={getModuleStats(module.id)}
                        onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Surat" value={filteredData.length} icon={FileText} />
                <StatCard
                    label="Dalam Proses"
                    value={filteredData.filter(s => !s.status.includes('Selesai') && s.dokumenLengkap).length}
                    icon={Clock}
                    valueColor="text-yellow-600"
                    iconColor="text-yellow-500"
                />
                <StatCard
                    label="Selesai"
                    value={filteredData.filter(s => s.status.includes('Selesai')).length}
                    icon={CheckCircle}
                    valueColor="text-green-600"
                    iconColor="text-green-500"
                />
                <StatCard
                    label="Dokumen Kurang"
                    value={filteredData.filter(s => !s.dokumenLengkap).length}
                    icon={XCircle}
                    valueColor="text-red-600"
                    iconColor="text-red-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Surat Masuk Terbaru</h2>
                    </div>
                    <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} />
                </div>
                <div className="p-6">
                    <SuratTable data={filteredData} onDetailClick={onDetailClick} />
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
