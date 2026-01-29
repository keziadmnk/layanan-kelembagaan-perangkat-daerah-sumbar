import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, nomorRegistrasi, status }) => {
    if (!isOpen) return null;

    return (
        <>
            <style>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Pengajuan berhasil dibuat!
                        </h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Pengajuan Anda akan segera diproses oleh. Anda dapat mengecek status pengajuan pada halaman riwayat pengajuan.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all transform hover:scale-105 shadow-lg"
                        >
                            OK, Lihat Riwayat Pengajuan
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuccessModal;
