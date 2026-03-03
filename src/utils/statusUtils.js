
/**
 * Mendapatkan class Tailwind CSS untuk styling status badge
 * @param {string} status - Status pengajuan/surat
 * @returns {string} - Class Tailwind CSS untuk background dan text color
 */
export const getStatusColor = (status) => {
    const statusColorMap = {
        // Status Verifikasi
        'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-800',
        'Perlu Perbaikan': 'bg-red-100 text-red-800',
        'Disetujui': 'bg-blue-100 text-blue-800',

        // Tahapan Proses
        'Penjadwalan Rapat': 'bg-indigo-100 text-indigo-800',
        'Pelaksanaan Rapat Fasilitasi': 'bg-purple-100 text-purple-800',
        'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 'bg-orange-100 text-orange-800',
        'Proses Penandatanganan': 'bg-cyan-100 text-cyan-800',
        
        // Status Final
        'Selesai': 'bg-green-100 text-green-800',
    };

    return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Mendapatkan class Tailwind CSS untuk styling status badge dengan border
 * @param {string} status - Status pengajuan/surat
 * @returns {string} - Class Tailwind CSS untuk background, text color, dan border
 */
export const getStatusColorWithBorder = (status) => {
    const statusColorMap = {
        // Status Verifikasi
        'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Perlu Perbaikan': 'bg-red-100 text-red-800 border-red-300',
        'Disetujui': 'bg-blue-100 text-blue-800 border-blue-300',

        // Tahapan Proses
        'Penjadwalan Rapat': 'bg-indigo-100 text-indigo-800 border-indigo-300',
        'Pelaksanaan Rapat Fasilitasi': 'bg-purple-100 text-purple-800 border-purple-300',
        'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 'bg-orange-100 text-orange-800 border-orange-300',
        'Proses Penandatanganan': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        
        // Status Final
        'Selesai': 'bg-green-100 text-green-800 border-green-300',
    };

    return statusColorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * @param {string} status - Status pengajuan/surat
 * @returns {string} - Nama icon dari Lucide React
 */
export const getStatusIconName = (status) => {
    const iconMap = {
        'Menunggu Verifikasi': 'AlertCircle',
        'Perlu Perbaikan': 'XCircle',
        'Disetujui': 'CheckCircle',
        'Penjadwalan Rapat': 'Calendar',
        'Pelaksanaan Rapat Fasilitasi': 'Users',
        'Penyusunan Draft Rekomendasi/Hasil Fasilitasi': 'FileEdit',
        'Proses Penandatanganan': 'PenTool',
        'Selesai': 'CheckCircle',
    };

    return iconMap[status] || 'Circle';
};

/**
 * Cek apakah status adalah status yang sudah selesai
 * @param {string} status - Status pengajuan/surat
 * @returns {boolean}
 */
export const isCompletedStatus = (status) => {
    return status === 'Selesai' || status?.includes('Selesai');
};

/**
 * Cek apakah status memerlukan perbaikan
 * @param {string} status - Status pengajuan/surat
 * @returns {boolean}
 */
export const needsRevision = (status) => {
    return status === 'Perlu Perbaikan';
};

/**
 * Cek apakah status masih menunggu verifikasi
 * @param {string} status - Status pengajuan/surat
 * @returns {boolean}
 */
export const isPendingVerification = (status) => {
    return status === 'Menunggu Verifikasi';
};
