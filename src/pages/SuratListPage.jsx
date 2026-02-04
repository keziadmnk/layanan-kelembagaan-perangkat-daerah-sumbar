import { useState, useEffect } from 'react';
import SuratTable from '../components/features/SuratTable';
import ModuleSelector from '../components/features/ModuleSelector';
import TahapanSelector from '../components/features/TahapanSelector';
import { pengajuanAPI, modulLayananAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

const SuratListPage = ({ title, status, showTahapan = false, onDetailClick }) => {
    const { user } = useAuthContext();
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTahapan, setSelectedTahapan] = useState(null);
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
                // Jika showTahapan aktif dan tidak ada status filter, filter hanya tahapan
                if (showTahapan && !status) {
                    const tahapanStatuses = ['Penjadwalan Rapat', 'Pelaksanaan Rapat Fasilitasi', 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', 'Proses Penandatanganan'];
                    setData(pengajuanRes.data.filter(s => tahapanStatuses.includes(s.status)));
                } else {
                    setData(pengajuanRes.data);
                }
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

    // Filter berdasarkan module atau tahapan
    let filteredData = data;

    if (showTahapan) {
        // Untuk halaman tahapan proses, filter berdasarkan status (karena tahapan sekarang adalah status)
        if (selectedTahapan) {
            filteredData = data.filter(s => {
                // Handle berbagai kemungkinan nama tahapan untuk Pelaksanaan Rapat
                if (selectedTahapan === 'Pelaksanaan Rapat Evaluasi') {
                    return s.status && (
                        s.status.includes('Pelaksanaan Rapat') ||
                        s.status === 'Pelaksanaan Rapat Evaluasi' ||
                        s.status === 'Pelaksanaan Rapat Fasilitasi' ||
                        s.status === 'Pelaksanaan Rapat Pembentukan UPTD'
                    );
                }
                return s.status === selectedTahapan;
            });
        }
    } else {
        // Untuk halaman lain (Semua Surat, Selesai), filter berdasarkan module
        if (selectedModule) {
            filteredData = data.filter(s => {
                // Filter berdasarkan id_modul
                return s.id_modul === selectedModule;
            });
        }
    }

    // Tentukan apakah user adalah pemohon (kab/kota)
    const isPemohon = user?.role === 'kab/kota';

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    {/* Kiri: Judul + Selector */}
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

                    {/* Kanan: Total Pengajuan */}
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

