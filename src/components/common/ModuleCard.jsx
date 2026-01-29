const ModuleCard = ({ module, stats, onClick }) => {
    const getIcon = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return '🏛️';
        if (namaModul.toLowerCase().includes('ranperda')) return '📋';
        if (namaModul.toLowerCase().includes('uptd')) return '🏢';
        return '📄';
    };

    const getShortName = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return 'Evaluasi Kelembagaan';
        if (namaModul.toLowerCase().includes('ranperda')) return 'Ranperda/Ranperkada';
        if (namaModul.toLowerCase().includes('uptd')) return 'UPTD';
        return namaModul;
    };

    const getColor = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return 'blue';
        if (namaModul.toLowerCase().includes('ranperda')) return 'green';
        if (namaModul.toLowerCase().includes('uptd')) return 'purple';
        return 'blue';
    };

    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };

    const icon = getIcon(module.nama_modul);
    const shortName = getShortName(module.nama_modul);
    const color = getColor(module.nama_modul);

    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{icon}</div>
                {stats && (
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">{stats.total} Surat</span>
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold mb-2">{shortName}</h3>
            <p className="text-sm text-white text-opacity-90">{module.deskripsi}</p>
            {stats && (
                <div className="mt-4 pt-4 border-t border-white border-opacity-20 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-xs opacity-80">Proses</div>
                        <div className="text-lg font-bold">{stats.inProgress}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-80">Selesai</div>
                        <div className="text-lg font-bold">{stats.completed}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-80">Pending</div>
                        <div className="text-lg font-bold">{stats.pending}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleCard;
