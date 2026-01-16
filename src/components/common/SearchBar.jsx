import { Search, Filter } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="flex gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari nomor registrasi atau nama pemohon..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
            </button>
        </div>
    );
};

export default SearchBar;
