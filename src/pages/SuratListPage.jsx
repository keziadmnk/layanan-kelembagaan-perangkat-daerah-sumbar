import { useState, useEffect } from 'react';
import SuratTable from '../components/features/SuratTable';
import ModuleSelector from '../components/features/ModuleSelector';
import { pengajuanAPI, modulLayananAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

const SuratListPage = ({ title, status, showTahapan = false, onDetailClick }) => {
    const { user } = useAuthContext();
    const [selectedModule, setSelectedModule] = useState(null);
    const [data, setData] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [status, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            let pengajuanRes;

            // Jika user adalah kab/kota (non-admin), ambil hanya pengajuan miliknya
            if (user?.role === 'kab/kota') {
                pengajuanRes = await pengajuanAPI.getByUser(user.id);
            } else {
                // Jika admin, ambil semua atau berdasarkan status
                pengajuanRes = status
                    ? await pengajuanAPI.getByStatus(status)
                    : await pengajuanAPI.getAll();
            }

            const modulRes = await modulLayananAPI.getAll();

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

    // Tentukan apakah user adalah pemohon (kab/kota)
    const isPemohon = user?.role === 'kab/kota';

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} modules={modules} />
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

