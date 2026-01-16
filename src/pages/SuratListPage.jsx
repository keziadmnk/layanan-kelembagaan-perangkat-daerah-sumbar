import { useState } from 'react';
import SuratTable from '../components/features/SuratTable';
import ModuleSelector from '../components/features/ModuleSelector';

const SuratListPage = ({ title, data, onDetailClick }) => {
    const [selectedModule, setSelectedModule] = useState(null);

    const filteredData = selectedModule
        ? data.filter(s => s.moduleId === selectedModule)
        : data;

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <ModuleSelector selectedModule={selectedModule} onModuleChange={setSelectedModule} />
            </div>
            <div className="p-6">
                <SuratTable data={filteredData} onDetailClick={onDetailClick} />
            </div>
        </div>
    );
};

export default SuratListPage;
