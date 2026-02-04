const StatusBadge = ({ status, dokumenLengkap, tahapan = null, showTahapan = false }) => {
    // Jika showTahapan true dan ada tahapan, tampilkan tahapan dengan warna spesifik
    if (showTahapan && tahapan) {
        const getTahapanColor = () => {
            switch (tahapan) {
                case 'Penjadwalan Rapat':
                    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
                case 'Pelaksanaan Rapat Fasilitasi':
                    return 'bg-orange-100 text-orange-700 border-orange-300';
                case 'Penyusunan Draft Rekomendasi/Hasil Fasilitasi':
                    return 'bg-blue-100 text-blue-700 border-blue-300';
                case 'Proses Penandatanganan':
                    return 'bg-purple-100 text-purple-800 border-purple-300';
                default:
                    return 'bg-gray-100 text-gray-700 border-gray-300';
            }
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getTahapanColor()}`}>
                {tahapan}
            </span>
        );
    }

    // Logika status normal
    const getColor = () => {
        if (!dokumenLengkap) return 'bg-red-100 text-red-700 border-red-300';
        if (status === 'Perlu Perbaikan') return 'bg-red-100 text-red-700 border-red-300';
        if (status.includes('Selesai')) return 'bg-green-100 text-green-700 border-green-300';
        if (status.includes('TTD')) return 'bg-gray-100 text-gray-700 border-gray-300';
        if (status.includes('Paraf')) return 'bg-blue-100 text-blue-700 border-blue-300';
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getColor()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
