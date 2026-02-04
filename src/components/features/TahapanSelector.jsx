import { Calendar, Users, FileEdit, PenTool } from 'lucide-react';

const TahapanSelector = ({ selectedTahapan, onTahapanChange }) => {
    const tahapanOptions = [
        { value: null, label: 'Semua', icon: Calendar },
        { value: 'Penjadwalan Rapat', label: 'Penjadwalan Rapat', icon: Calendar },
        { value: 'Pelaksanaan Rapat Evaluasi', label: 'Pelaksanaan Rapat', icon: Users },
        { value: 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi', label: 'Penyusunan Draft', icon: FileEdit },
        { value: 'Proses Penandatanganan', label: 'Penandatanganan', icon: PenTool }
    ];

    return (
        <div className="flex gap-2 flex-wrap">
            {tahapanOptions.map((option) => {
                const Icon = option.icon;
                return (
                    <button
                        key={option.value || 'semua'}
                        onClick={() => onTahapanChange(option.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedTahapan === option.value
                                ? 'bg-navy-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TahapanSelector;
