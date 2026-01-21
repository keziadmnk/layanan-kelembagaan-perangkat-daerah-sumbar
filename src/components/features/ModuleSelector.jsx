import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

const ModuleSelector = ({ selectedModule, onModuleChange }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/pengajuan/modul-layanan`);
            const result = await response.json();

            if (result.success) {
                setModules(result.data);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper untuk icon
    const getIcon = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return '🏛️';
        if (namaModul.toLowerCase().includes('ranperda')) return '📋';
        if (namaModul.toLowerCase().includes('uptd')) return '🏢';
        return '📄';
    };

    // Helper untuk short name
    const getShortName = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return 'Evaluasi Kelembagaan';
        if (namaModul.toLowerCase().includes('ranperda')) return 'Ranperda/Ranperkada';
        if (namaModul.toLowerCase().includes('uptd')) return 'UPTD';
        return namaModul;
    };

    if (loading) {
        return <div className="text-gray-500 text-sm">Loading modules...</div>;
    }

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={() => onModuleChange(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedModule === null
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                Semua 
            </button>
            {modules.map((module) => (
                <button
                    key={module.id_modul}
                    onClick={() => onModuleChange(module.id_modul)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedModule === module.id_modul
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <span>{getIcon(module.nama_modul)}</span>
                    <span>{getShortName(module.nama_modul)}</span>
                </button>
            ))}
        </div>
    );
};

export default ModuleSelector;
