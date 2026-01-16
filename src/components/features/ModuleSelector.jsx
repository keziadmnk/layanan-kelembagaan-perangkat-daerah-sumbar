import { modules } from '../../constants/modules';

const ModuleSelector = ({ selectedModule, onModuleChange }) => {
    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={() => onModuleChange(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedModule === null
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                Semua Modul
            </button>
            {modules.map((module) => (
                <button
                    key={module.id}
                    onClick={() => onModuleChange(module.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedModule === module.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <span>{module.icon}</span>
                    <span>{module.shortName}</span>
                </button>
            ))}
        </div>
    );
};

export default ModuleSelector;
