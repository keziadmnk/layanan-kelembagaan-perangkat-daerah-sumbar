import { useState } from "react";
import { X, Upload, AlertCircle, FileText, Check } from "lucide-react";
import FileUpload from "../common/FileUpload";
import { dokumentWajib } from "../../constants/mockData";

const UploadPerbaikanModal = ({ isOpen, onClose, surat, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !surat) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Upload Dokumen Perbaikan
              </h2>
              <p className="text-sm text-gray-600">ID: {surat.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {surat.revisionNotes && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">
                    Catatan Perbaikan dari Admin:
                  </h3>
                  <p className="text-sm text-red-800 whitespace-pre-line">
                    {surat.revisionNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Petunjuk:</strong> Silakan upload ulang dokumen yang telah
              diperbaiki sesuai dengan catatan di atas. Pastikan dokumen sudah
              sesuai dengan format dan ketentuan yang berlaku.
            </p>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-gray-900">
              Upload Dokumen yang Diperbaiki
            </h3>

            {dokumentWajib[surat.moduleId]?.map((dok) => (
              <FileUpload
                key={dok.id}
                label={`${dok.id}. ${dok.nama}`}
                required={dok.required}
                format={dok.format}
              />
            ))}
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">
              Catatan Tambahan (Opsional)
            </h3>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tambahkan catatan atau penjelasan terkait perbaikan yang telah dilakukan..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Perhatian:</strong> Setelah Anda submit, dokumen akan
              diverifikasi ulang oleh admin. Pastikan semua dokumen sudah benar
              sebelum melakukan submit.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {isSubmitting ? "Mengirim..." : "Submit Perbaikan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPerbaikanModal;
