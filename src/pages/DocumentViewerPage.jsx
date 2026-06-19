import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Download, FileText, Loader } from 'lucide-react';
import { fetchProtectedFileBlobUrl, getDocumentViewerItem } from '../utils/apiConfig';

const getExtension = (name = '') => {
    const cleanName = name.split('?')[0];
    const parts = cleanName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const DocumentViewerPage = () => {
    const { viewerId } = useParams();
    const navigate = useNavigate();
    const [viewerItem, setViewerItem] = useState(null);
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const item = getDocumentViewerItem(viewerId);
        if (!item?.path) {
            setError('Data dokumen tidak ditemukan. Silakan buka dokumen ulang dari halaman pengajuan.');
            setLoading(false);
            return;
        }

        setViewerItem(item);
        let objectUrl = null;

        const loadDocument = async () => {
            try {
                setLoading(true);
                setError(null);
                objectUrl = await fetchProtectedFileBlobUrl(item.path);
                setBlobUrl(objectUrl);
            } catch (err) {
                setError(err.message || 'Gagal membuka dokumen');
            } finally {
                setLoading(false);
            }
        };

        loadDocument();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [viewerId]);

    const fileName = viewerItem?.name || 'Dokumen';
    const extension = useMemo(() => getExtension(fileName || viewerItem?.path || ''), [fileName, viewerItem?.path]);
    const canPreviewInline = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension);

    const handleBack = () => {
        const returnTo = viewerItem?.returnTo || '/dashboard';
        navigate(returnTo, { replace: true });
    };
    const handleDownload = () => {
        if (!blobUrl) return;
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                            title="Kembali"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{fileName}</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-150px)]">
                    {loading ? (
                        <div className="min-h-[520px] flex flex-col items-center justify-center text-gray-600 gap-3">
                            <Loader className="w-8 h-8 animate-spin text-navy-600" />
                            <p>Memuat dokumen...</p>
                        </div>
                    ) : error ? (
                        <div className="min-h-[520px] flex flex-col items-center justify-center text-center p-8 gap-3">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <h2 className="text-lg font-bold text-gray-900">Dokumen tidak dapat dibuka</h2>
                            <p className="text-gray-600 max-w-md">{error}</p>
                        </div>
                    ) : canPreviewInline ? (
                        <iframe
                            src={blobUrl}
                            title={fileName}
                            className="w-full h-[calc(100vh-160px)] min-h-[620px] bg-gray-50"
                        />
                    ) : (
                        <div className="min-h-[520px] flex flex-col items-center justify-center text-center p-8 gap-4">
                            <FileText className="w-16 h-16 text-navy-600" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Preview tidak tersedia untuk format ini</h2>
                                <p className="text-gray-600 mt-1">Silakan download dokumen untuk membukanya di aplikasi yang sesuai.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                            >
                                <Download className="w-4 h-4" />
                                Download Dokumen
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DocumentViewerPage;

