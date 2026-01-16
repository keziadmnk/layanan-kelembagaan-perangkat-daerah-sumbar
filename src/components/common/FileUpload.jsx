import { Upload } from 'lucide-react';

const FileUpload = ({ label, required = false, format = 'PDF (max. 10MB)' }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Klik atau drag & drop file</p>
                <p className="text-xs text-gray-500 mt-1">{format}</p>
            </div>
        </div>
    );
};

export default FileUpload;
