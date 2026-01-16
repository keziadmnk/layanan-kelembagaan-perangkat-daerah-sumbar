import { useState } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SuratTable from '../components/features/SuratTable';
import ModuleCard from '../components/common/ModuleCard';
import ModuleSelector from '../components/features/ModuleSelector';
import { modules } from '../constants/modules';

const DashboardPemohon = ({ data, onDetailClick, onNewSubmission }) => {
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, Kab. Padang Pariaman</h2>
                <p className="text-blue-100">Pantau status pengajuan Anda atau ajukan layanan baru</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Layanan yang Tersedia</h3>
                    <p className="text-sm text-gray-600">Klik untuk mengajukan layanan baru</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.map(module => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            stats={getModuleStats(module.id)}
                            onClick={() => onNewSubmission(module.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Pengajuan" value={data.length} icon={FileText} />
                <StatCard
                    label="Dalam Proses"
                    value={data.filter(s => !s.status.includes('Selesai')).length}
                    icon={Clock}
                    valueColor="text-yellow-600"
                    iconColor="text-yellow-500"
                />
                <StatCard
                    label="Selesai"
                    value={data.filter(s => s.status.includes('Selesai')).length}
                    icon={CheckCircle}
                    valueColor="text-green-600"
                    iconColor="text-green-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pengajuan Saya</h2>
                    </div>
                    <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} />
                </div>
                <div className="p-6">
                    <SuratTable data={filteredData} isPemohon={true} onDetailClick={onDetailClick} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPemohon;
