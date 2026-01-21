import { useState, useEffect } from 'react';
import SuratTable from '../components/features/SuratTable';
import ModuleSelector from '../components/features/ModuleSelector';

const API_BASE_URL = 'http://localhost:3001/api';

const SuratListPage = ({ title, onDetailClick }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data pengajuan dari backend
    useEffect(() => {
        fetchPengajuan();
    }, []);

    const fetchPengajuan = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Ganti dengan id_user dari session/auth
            const id_user = 1;

            const response = await fetch(`${API_BASE_URL}/pengajuan/user/${id_user}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal mengambil data');
            }

            setData(result.data);
            console.log('✅ Riwayat pengajuan loaded:', result.data);
        } catch (err) {
            console.error('❌ Error fetching pengajuan:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter data berdasarkan modul yang dipilih
    const filteredData = selectedModule
        ? data.filter(s => s.id_modul === selectedModule)
        : data;

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} />
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">Error: {error}</p>
                        <button
                            onClick={fetchPengajuan}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Belum ada pengajuan</p>
                    </div>
                ) : (
                    <SuratTable data={filteredData} onDetailClick={onDetailClick} isPemohon={true} />
                )}
            </div>
        </div>
    );
};

export default SuratListPage;
