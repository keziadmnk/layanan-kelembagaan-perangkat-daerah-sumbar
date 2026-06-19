import { createElement } from 'react';

const StatCard = ({ label, value, icon, valueColor = 'text-gray-900', iconColor = 'text-blue-500' }) => {
    const iconNode = icon
        ? createElement(icon, { className: `w-12 h-12 ${iconColor} opacity-20` })
        : null;

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
                </div>
                {iconNode}
            </div>
        </div>
    );
};

export default StatCard;
