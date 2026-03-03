import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SuratTable from '../components/features/SuratTable';
import ModuleSelector from '../components/features/ModuleSelector';
import TahapanSelector from '../components/features/TahapanSelector';
import { pengajuanAPI, modulLayananAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

const SuratListPage = ({ title, status, showTahapan = false, onDetailClick }) => {
    const { user } = useAuthContext();
    const location = useLocation(); // Track route changes
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTahapan, setSelectedTahapan] = useState(null);
    const [data, setData] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
        setSelectedModule(null);
        setSelectedTahapan(null);
    }, [location.pathname, status, showTahapan, user?.id]);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const modulRes = await modulLayananAPI.getAll();
            if (modulRes.success) {
                setModules(modulRes.data);
            }
        } catch (err) {
            console.error('Error fetching modules:', err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            let pengajuanRes;

            if (user?.role === 'kab/kota') {
                pengajuanRes = await pengajuanAPI.getByUser(user.id);
            } else {
                pengajuanRes = status
                    ? await pengajuanAPI.getByStatus(status)
                    : await pengajuanAPI.getAll();
            }

            if (pengajuanRes.success) {
                if (showTahapan && !status) {
                    setData(pengajuanRes.data.filter(s => s.status_verifikasi === 'Disetujui'));
                } else {
                    setData(pengajuanRes.data);
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    let filteredData = data;

    if (showTahapan) {
        if (selectedTahapan) {
            filteredData = data.filter(s => s.status === selectedTahapan);
        }
    } else {
        if (selectedModule) {
            filteredData = data.filter(s => s.id_modul === selectedModule);
        }
    }

    const isPemohon = user?.role === 'kab/kota';

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                        {showTahapan ? (
                            <TahapanSelector
                                selectedTahapan={selectedTahapan}
                                onTahapanChange={setSelectedTahapan}
                            />
                        ) : (
                            <ModuleSelector
                                selectedModule={selectedModule}
                                onModuleChange={setSelectedModule}
                                modules={modules}
                            />
                        )}
                    </div>

                    {!loading && !error && data.length > 0 && (
                        <div className="text-center ml-6">
                            <p className="text-sm text-gray-500 mb-1">Total Pengajuan</p>
                            <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-2"></div>
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-navy-600 text-white rounded hover:bg-navy-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada data pengajuan</p>
                    </div>
                ) : (
                    <SuratTable data={filteredData} isPemohon={isPemohon} showTahapan={showTahapan} onDetailClick={onDetailClick} />
                )}
            </div>
        </div>
    );
};

export default SuratListPage;

