import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to display - only show 2 pages
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages === 1) {
            pageNumbers.push(1);
        } else if (totalPages === 2) {
            pageNumbers.push(1, 2);
        } else {
            // Show current page and next page
            // If we're on the last page, show previous and current
            if (currentPage === totalPages) {
                pageNumbers.push(currentPage - 1, currentPage);
            } else {
                pageNumbers.push(currentPage, currentPage + 1);
            }
        }

        return pageNumbers;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
                <span className="font-medium">{endItem}</span> dari{' '}
                <span className="font-medium">{totalItems}</span> data
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Halaman sebelumnya"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers - Only 2 boxes */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Halaman selanjutnya"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
