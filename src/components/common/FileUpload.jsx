import { useState, useRef } from 'react';
import { Upload, Check, X, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

const FileUpload = ({
    label,
    required = false,
    format = 'PDF (max. 10MB)',
    id_persyaratan,
    onFileUploaded,
    existingFile = null  // Add prop for existing file from database
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(existingFile);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadFile(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        await uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('id_persyaratan', id_persyaratan);

            const response = await fetch(`${API_BASE_URL}/upload/single`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Upload gagal');
            }

            setUploadedFile({
                id_persyaratan: id_persyaratan,
                nama_file: result.data.nama_file,
                path_file: result.data.path_file,
            });

            // Notify parent component
            if (onFileUploaded) {
                onFileUploaded(id_persyaratan, {
                    id_persyaratan: id_persyaratan,
                    nama_file: result.data.nama_file,
                    path_file: result.data.path_file,
                });
            }

            console.log('✅ File uploaded:', result.data);
        } catch (err) {
            console.error('❌ Upload error:', err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Notify parent
        if (onFileUploaded) {
            onFileUploaded(id_persyaratan, null);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {!uploadedFile ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${uploading
                        ? 'border-blue-400 bg-blue-50'
                        : error
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 hover:border-blue-400 cursor-pointer'
                        }`}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {uploading ? (
                        <>
                            <Loader className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-spin" />
                            <p className="text-sm text-navy-600">Uploading...</p>
                        </>
                    ) : error ? (
                        <>
                            <X className="w-6 h-6 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-600">{error}</p>
                            <button
                                type="button"
                                className="text-xs text-blue-500 hover:underline mt-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setError(null);
                                }}
                            >
                                Coba lagi
                            </button>
                        </>
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Klik atau drag & drop file</p>
                            <p className="text-xs text-gray-500 mt-1">{format}</p>
                        </>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className={`border-2 rounded-lg p-4 flex items-center justify-between ${uploadedFile.isExisting
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-green-300 bg-green-50'
                    }`}>
                    <div className="flex items-center gap-2">
                        <Check className={`w-5 h-5 ${uploadedFile.isExisting ? 'text-navy-600' : 'text-green-600'}`} />
                        <div>
                            <p className={`text-sm font-medium ${uploadedFile.isExisting ? 'text-blue-900' : 'text-green-900'}`}>
                                {uploadedFile.nama_file}
                            </p>
                            <p className={`text-xs ${uploadedFile.isExisting ? 'text-blue-700' : 'text-green-700'}`}>
                                {uploadedFile.isExisting && uploadedFile.created_at
                                    ? `Diupload: ${new Date(uploadedFile.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}`
                                    : uploadedFile.isExisting
                                        ? format
                                        : 'File berhasil diupload'
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-red-500 hover:text-red-700"
                        title={uploadedFile.isExisting ? "Replace file" : "Hapus file"}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
