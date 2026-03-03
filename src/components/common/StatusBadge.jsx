import { getStatusColorWithBorder, isCompletedStatus, needsRevision } from '../../utils/statusUtils';

const StatusBadge = ({ status, dokumenLengkap, tahapan = null, showTahapan = false }) => {
    if (showTahapan && tahapan) {
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColorWithBorder(tahapan)}`}>
                {tahapan}
            </span>
        );
    }

    let colorClass;
    if (!dokumenLengkap) {
        colorClass = 'bg-red-100 text-red-800 border-red-300';
    } else {
        colorClass = getStatusColorWithBorder(status);
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
