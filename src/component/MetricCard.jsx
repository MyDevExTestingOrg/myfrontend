const MetricCard = ({ title, value, change, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-gray-900">{value}</h3>
            <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </span>
        </div>
    </div>
);

export default MetricCard;