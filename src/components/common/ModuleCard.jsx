import { Building, ClipboardList, Building2, FileText } from 'lucide-react';

const ModuleCard = ({ module, stats, onClick, isSelected = false }) => {
    const getIcon = (namaModul) => {
        const iconProps = { className: "w-7 h-7" };
        if (namaModul.toLowerCase().includes('evaluasi')) return <Building {...iconProps} />;
        if (namaModul.toLowerCase().includes('ranperda')) return <ClipboardList {...iconProps} />;
        if (namaModul.toLowerCase().includes('uptd')) return <Building2 {...iconProps} />;
        return <FileText {...iconProps} />;
    };

    const getShortName = (namaModul) => {
        if (namaModul.toLowerCase().includes('evaluasi')) return 'Evaluasi Kelembagaan';
        if (namaModul.toLowerCase().includes('ranperda')) return 'Ranperda/Ranperkada';
        if (namaModul.toLowerCase().includes('uptd')) return 'UPTD';
        return namaModul;
    };

    const getAccentColor = (namaModul) => {
        return 'blue';
    };

    const accentClasses = {
        blue: {
            border: 'border-blue-200',
            borderSelected: 'border-blue-400',
            iconBg: 'bg-blue-50',
            iconBgSelected: 'bg-blue-100',
            iconText: 'text-navy-600',
            badge: 'bg-navy-600',
            statBg: 'bg-blue-50',
            statBgSelected: 'bg-blue-100',
            statText: 'text-blue-700'
        },
        green: {
            border: 'border-green-200',
            borderSelected: 'border-green-400',
            iconBg: 'bg-green-50',
            iconBgSelected: 'bg-green-100',
            iconText: 'text-green-600',
            badge: 'bg-green-600',
            statBg: 'bg-green-50',
            statBgSelected: 'bg-green-100',
            statText: 'text-green-700'
        },
        purple: {
            border: 'border-purple-200',
            borderSelected: 'border-purple-400',
            iconBg: 'bg-purple-50',
            iconBgSelected: 'bg-purple-100',
            iconText: 'text-purple-600',
            badge: 'bg-purple-600',
            statBg: 'bg-purple-50',
            statBgSelected: 'bg-purple-100',
            statText: 'text-purple-700'
        }
    };

    const icon = getIcon(module.nama_modul);
    const shortName = getShortName(module.nama_modul);
    const accent = getAccentColor(module.nama_modul);
    const colors = accentClasses[accent];

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-200 ${isSelected
                ? `border-2 ${colors.borderSelected} shadow-lg`
                : `border-2 ${colors.border} hover:shadow-lg`
                }`}
        >
            {/* Header with Icon and Badge */}
            <div className="flex items-start justify-between mb-4">
                <div className={`${isSelected ? colors.iconBgSelected : colors.iconBg} w-14 h-14 rounded-lg flex items-center justify-center text-3xl transition-colors duration-200`}>
                    {icon}
                </div>
                {stats && (
                    <div className={`${colors.badge} text-white px-3 py-1.5 rounded-lg`}>
                        <span className="text-sm font-semibold">{stats.total} Pengajuan</span>
                    </div>
                )}
            </div>

            {/* Title and Description */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{shortName}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{module.deskripsi}</p>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <div className={`${isSelected ? colors.statBgSelected : colors.statBg} rounded-lg p-3 text-center transition-colors duration-200`}>
                        <div className="text-xs font-medium text-gray-600 mb-1">Proses</div>
                        <div className={`text-2xl font-bold ${colors.statText}`}>{stats.inProgress}</div>
                    </div>
                    <div className={`${isSelected ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg p-3 text-center transition-colors duration-200`}>
                        <div className="text-xs font-medium text-gray-600 mb-1">Selesai</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                    </div>
                    <div className={`${isSelected ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg p-3 text-center transition-colors duration-200`}>
                        <div className="text-xs font-medium text-gray-600 mb-1">Pending</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleCard;
