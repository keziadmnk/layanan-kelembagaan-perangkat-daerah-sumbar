import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SuratTable from '../components/features/SuratTable';
import ModuleCard from '../components/common/ModuleCard';
import ModuleSelector from '../components/features/ModuleSelector';
import { pengajuanAPI, modulLayananAPI } from '../services/api';

const DashboardAdmin = ({ onDetailClick }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [data, setData] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [pengajuanRes, modulRes] = await Promise.all([
                pengajuanAPI.getAll(),
                modulLayananAPI.getAll()
            ]);

            if (pengajuanRes.success) {
                setData(pengajuanRes.data);
            }
            if (modulRes.success) {
                setModules(modulRes.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = selectedModule
        ? data.filter(s => s.id_modul === selectedModule)
        : data;

    const getModuleStats = (moduleId) => {
        const moduleData = data.filter(s => s.id_modul === moduleId);
        return {
            total: moduleData.length,
            inProgress: moduleData.filter(s => s.status === 'Dalam Proses').length,
            completed: moduleData.filter(s => s.status === 'Selesai').length,
            pending: moduleData.filter(s => s.status === 'Menunggu Verifikasi').length
        };
    };

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
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h2>
                <p className="text-gray-600">Kelola semua pengajuan dari kabupaten/kota</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modules.map(module => {
                    const moduleInfo = {
                        id_modul: module.id_modul,
                        nama_modul: module.nama_modul,
                        deskripsi: module.deskripsi
                    };
                    return (
                        <ModuleCard
                            key={module.id_modul}
                            module={moduleInfo}
                            stats={getModuleStats(module.id_modul)}
                            onClick={() => setSelectedModule(selectedModule === module.id_modul ? null : module.id_modul)}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Surat"
                    value={filteredData.length}
                    icon={FileText}
                />
                <StatCard
                    label="Menunggu Verifikasi"
                    value={filteredData.filter(s => s.status === 'Menunggu Verifikasi').length}
                    icon={AlertCircle}
                    valueColor="text-yellow-600"
                    iconColor="text-yellow-500"
                />
                <StatCard
                    label="Dalam Proses"
                    value={filteredData.filter(s => s.status === 'Dalam Proses').length}
                    icon={Clock}
                    valueColor="text-blue-600"
                    iconColor="text-blue-500"
                />
                <StatCard
                    label="Selesai"
                    value={filteredData.filter(s => s.status === 'Selesai').length}
                    icon={CheckCircle}
                    valueColor="text-green-600"
                    iconColor="text-green-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Surat Masuk Terbaru</h2>
                    </div>
                    <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} modules={modules} />
                </div>
                <div className="p-6">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Tidak ada data pengajuan</p>
                        </div>
                    ) : (
                        <SuratTable data={filteredData} onDetailClick={onDetailClick} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
