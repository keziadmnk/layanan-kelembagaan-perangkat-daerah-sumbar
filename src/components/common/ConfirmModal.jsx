import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    confirmColor = 'green',
    onClose,
    onConfirm
}) => {
    if (!isOpen) return null;

    const colorClasses = {
        red: 'bg-red-600 hover:bg-red-700',
        green: 'bg-green-600 hover:bg-green-700',
        navy: 'bg-navy-600 hover:bg-navy-700',
        yellow: 'bg-yellow-600 hover:bg-yellow-700'
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-yellow-100 rounded-full p-3">
                            <AlertTriangle className="w-12 h-12 text-yellow-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-center mb-6 text-sm">
                        {message}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${colorClasses[confirmColor]} text-white py-2.5 px-4 rounded-lg font-semibold transition shadow-md`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
