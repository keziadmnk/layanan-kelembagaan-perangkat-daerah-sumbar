import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Activity, XCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SuratTable from '../components/features/SuratTable';
import ModuleCard from '../components/common/ModuleCard';
import { pengajuanAPI, modulLayananAPI } from '../services/api';

const DashboardAdmin = ({ onDetailClick }) => {
    const navigate = useNavigate();
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
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
        const tahapanStatuses = ['Penjadwalan Rapat', 'Pelaksanaan Rapat Fasilitasi', 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', 'Proses Penandatanganan'];
        return {
            total: moduleData.length,
            inProgress: moduleData.filter(s => tahapanStatuses.includes(s.status)).length,
            completed: moduleData.filter(s => s.status === 'Selesai').length,
            pending: moduleData.filter(s => s.status === 'Menunggu Verifikasi').length
        };
    };

    // Analytics calculations
    const tahapanStatuses = ['Penjadwalan Rapat', 'Pelaksanaan Rapat Fasilitasi', 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', 'Proses Penandatanganan'];
    const analytics = {
        // Status breakdown
        menungguVerifikasi: filteredData.filter(s => s.status === 'Menunggu Verifikasi').length,
        perluPerbaikan: filteredData.filter(s => s.status === 'Perlu Perbaikan').length,
        dalamProses: filteredData.filter(s => tahapanStatuses.includes(s.status)).length,
        selesai: filteredData.filter(s => s.status === 'Selesai').length,

        // Average progress
        averageProgress: filteredData.length > 0
            ? Math.round(filteredData.reduce((acc, s) => acc + (s.progress || 0), 0) / filteredData.length)
            : 0,

        // Completion rate
        completionRate: filteredData.length > 0
            ? Math.round((filteredData.filter(s => s.status === 'Selesai').length / filteredData.length) * 100)
            : 0,

        // Top pemohon
        topPemohon: (() => {
            const pemohonCount = {};
            filteredData.forEach(s => {
                if (s.pemohon) {
                    pemohonCount[s.pemohon] = (pemohonCount[s.pemohon] || 0) + 1;
                }
            });
            return Object.entries(pemohonCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
        })(),

        // Progress distribution
        progressDistribution: {
            low: filteredData.filter(s => (s.progress || 0) < 25).length,
            medium: filteredData.filter(s => (s.progress || 0) >= 25 && (s.progress || 0) < 75).length,
            high: filteredData.filter(s => (s.progress || 0) >= 75 && (s.progress || 0) < 100).length,
            complete: filteredData.filter(s => (s.progress || 0) === 100).length,
        }
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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">Selamat Datang, Admin</h2>
                    <p className="text-gray-500 mt-1">Dashboard Monitoring dan analisis pengajuan layanan kelembagaan</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Pengajuan</p>
                    <p className="text-3xl font-bold text-gray-900">{data.length}</p>
                </div>
            </div>

            {/* Primary Stats - Minimalist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Menunggu Verifikasi</p>
                            <p className="text-3xl font-bold text-amber-600">{analytics.menungguVerifikasi}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Perlu Perbaikan</p>
                            <p className="text-3xl font-bold text-red-600">{analytics.perluPerbaikan}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Dalam Proses</p>
                            <p className="text-3xl font-bold text-navy-600">{analytics.dalamProses}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-navy-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Selesai</p>
                            <p className="text-3xl font-bold text-green-600">{analytics.selesai}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-gray-700" />
                        <h3 className="font-semibold text-gray-900">Performa Keseluruhan</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Rata-rata Progress</span>
                                <span className="text-sm font-semibold text-gray-900">{analytics.averageProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-navy-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${analytics.averageProgress}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Tingkat Penyelesaian</span>
                                <span className="text-sm font-semibold text-gray-900">{analytics.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${analytics.completionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-gray-700" />
                        <h3 className="font-semibold text-gray-900">Distribusi Progress</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">0-24%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{analytics.progressDistribution.low}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">25-74%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{analytics.progressDistribution.medium}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">75-99%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{analytics.progressDistribution.high}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">100%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{analytics.progressDistribution.complete}</span>
                        </div>
                    </div>
                </div>

                {/* Top Pemohon */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-gray-700" />
                        <h3 className="font-semibold text-gray-900">Pemohon Teraktif</h3>
                    </div>
                    <div className="space-y-3">
                        {analytics.topPemohon.length > 0 ? (
                            analytics.topPemohon.map(([pemohon, count], index) => (
                                <div key={pemohon} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm text-gray-900 truncate max-w-[150px]" title={pemohon}>
                                            {pemohon}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">Belum ada data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Module Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Layanan Kelembagaan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.map((module, index) => {
                        const moduleInfo = {
                            id_modul: module.id_modul,
                            nama_modul: module.nama_modul,
                            deskripsi: module.deskripsi
                        };
                        // Map card to analytics panel
                        const cardMapping = ['performa', 'distribusi', 'pemohon'];
                        const cardType = cardMapping[index];

                        return (
                            <ModuleCard
                                key={module.id_modul}
                                module={moduleInfo}
                                stats={getModuleStats(module.id_modul)}
                                isSelected={selectedCard === cardType}
                                onClick={() => {
                                    setSelectedModule(selectedModule === module.id_modul ? null : module.id_modul);
                                    setSelectedCard(selectedCard === cardType ? null : cardType);
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Recent Submissions Table */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Pengajuan Terbaru</h3>
                        <span className="text-sm text-gray-500">5 pengajuan terbaru</span>
                    </div>
                </div>
                <div className="p-6">
                    {data.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Tidak ada data pengajuan</p>
                        </div>
                    ) : (
                        <>
                            <SuratTable
                                data={data.slice(0, 5)}
                                onDetailClick={onDetailClick}
                                simple={true}
                            />
                            {data.length > 5 && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => navigate('/surat-masuk')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Lihat Selengkapnya
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
