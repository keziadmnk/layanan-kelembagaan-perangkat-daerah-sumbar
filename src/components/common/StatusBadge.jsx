const StatusBadge = ({ status, dokumenLengkap }) => {
    const getColor = () => {
        if (!dokumenLengkap) return 'bg-red-100 text-red-700 border-red-300';
        if (status.includes('Selesai')) return 'bg-green-100 text-green-700 border-green-300';
        if (status.includes('TTD')) return 'bg-purple-100 text-purple-700 border-purple-300';
        if (status.includes('Paraf')) return 'bg-blue-100 text-blue-700 border-blue-300';
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColor()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
