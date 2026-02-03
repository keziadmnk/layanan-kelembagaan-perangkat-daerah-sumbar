import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ title, message, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertTriangle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium transition shadow-lg"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
