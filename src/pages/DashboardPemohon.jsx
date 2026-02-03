import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import SuratTable from '../components/features/SuratTable';
import ModuleCard from '../components/common/ModuleCard';
import ModuleSelector from '../components/features/ModuleSelector';
import { pengajuanAPI, modulLayananAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

const DashboardPemohon = ({ onDetailClick }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [selectedModule, setSelectedModule] = useState(null);
    const [data, setData] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [pengajuanRes, modulRes] = await Promise.all([
                pengajuanAPI.getByUser(user.id),
                modulLayananAPI.getAll()
            ]);

            if (pengajuanRes.success) {
                console.log('📊 Data Pengajuan:', pengajuanRes.data);
                console.log('📋 Status yang ada:', pengajuanRes.data.map(d => ({ id: d.id_pengajuan, status: d.status, modul: d.id_modul })));
                setData(pengajuanRes.data);
            }
            if (modulRes.success) {
                console.log('📦 Data Modul:', modulRes.data);
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
            inProgress: moduleData.filter(s => s.status && !s.status.includes('Selesai') && s.status !== 'Perlu Perbaikan').length,
            completed: moduleData.filter(s => s.status && s.status.includes('Selesai')).length,
            pending: moduleData.filter(s => s.status === 'Perlu Perbaikan').length
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.kabupaten_kota || 'Pemohon'}</h2>
                <p className="text-blue-100">Pantau status pengajuan Anda atau ajukan layanan baru</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Pengajuan"
                    value={data.length}
                    icon={FileText}
                    valueColor="text-gray-900"
                    iconColor="text-gray-500"
                />
                <StatCard
                    label="Dalam Proses"
                    value={data.filter(s => s.status && !s.status.includes('Selesai') && s.status !== 'Perlu Perbaikan').length}
                    icon={Clock}
                    valueColor="text-blue-600"
                    iconColor="text-blue-500"
                />
                <StatCard
                    label="Selesai"
                    value={data.filter(s => s.status && s.status.includes('Selesai')).length}
                    icon={CheckCircle}
                    valueColor="text-green-600"
                    iconColor="text-green-500"
                />
                <StatCard
                    label="Pending"
                    value={data.filter(s => s.status === 'Perlu Perbaikan').length}
                    icon={Clock}
                    valueColor="text-red-600"
                    iconColor="text-red-500"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Layanan yang Tersedia</h3>
                    <p className="text-sm text-gray-600">Klik untuk mengajukan layanan baru</p>
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
                                onClick={() => navigate('/pengajuan-baru', { state: { selectedModuleId: module.id_modul } })}
                            />
                        );
                    })}
                </div>
            </div>



            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pengajuan Saya</h2>
                    </div>
                    <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} modules={modules} />
                </div>
                <div className="p-6">
                    {data.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Belum ada pengajuan</p>
                        </div>
                    ) : (
                        <SuratTable data={filteredData} isPemohon={true} onDetailClick={onDetailClick} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPemohon;
