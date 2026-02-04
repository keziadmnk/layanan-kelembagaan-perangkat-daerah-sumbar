import { CheckCircle, AlertCircle } from 'lucide-react';

const AdminSuccessModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

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

            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
                    <div className="p-8 text-center">
                        <div className={`mx-auto w-16 h-16 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mb-4`}>
                            {isSuccess ? (
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {title || (isSuccess ? 'Berhasil!' : 'Perhatian')}
                        </h2>
                        <p className="text-gray-600 text-sm mb-6 whitespace-pre-line">
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className={`w-full ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-navy-600 hover:bg-navy-700'} text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md`}
                        >
                            OK, Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSuccessModal;
