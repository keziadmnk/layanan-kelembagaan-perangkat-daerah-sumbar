export const modules = [
    {
        id: 'evaluasi-kelembagaan',
        name: 'Evaluasi Kelembagaan Perangkat Daerah',
        shortName: 'Evaluasi Kelembagaan',
        description: 'Pengajuan evaluasi kelembagaan perangkat daerah kabupaten/kota',
        icon: '🏛️',
        color: 'blue'
    },
    {
        id: 'ranperda',
        name: 'Fasilitasi Ranperda/Ranperkada',
        shortName: 'Ranperda/Ranperkada',
        description: 'Fasilitasi penyusunan rancangan peraturan daerah atau peraturan kepala daerah',
        icon: '📋',
        color: 'green'
    },
    {
        id: 'uptd',
        name: 'Pembentukan UPTD',
        shortName: 'UPTD',
        description: 'Pengajuan pembentukan Unit Pelaksana Teknis Daerah',
        icon: '🏢',
        color: 'purple'
    }
];

export const getModuleById = (id) => {
    return modules.find(m => m.id === id);
};

export const getModuleColor = (moduleId) => {
    const module = getModuleById(moduleId);
    const colors = {
        blue: 'bg-blue-100 text-blue-700 border-blue-300',
        green: 'bg-green-100 text-green-700 border-green-300',
        purple: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return colors[module?.color] || colors.blue;
};

export const getModuleSpecificStageName = (moduleId, stageName) => {
    if (stageName !== 'Pelaksanaan Rapat') return stageName;

    const moduleTypes = {
        'evaluasi-kelembagaan': 'Pelaksanaan Rapat Evaluasi',
        'ranperda': 'Pelaksanaan Rapat Fasilitasi',
        'uptd': 'Pelaksanaan Rapat Pembentukan UPTD'
    };

    return moduleTypes[moduleId] || stageName;
};
