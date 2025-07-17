import { MetricCard } from "@/types";


interface DashboardMetricsProps {
    metrics: MetricCard[];
}
const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metrics.map((metric, index) => {
                const isNegative = metric.change.includes('-');

                return (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                        <p className="text-white text-sm md:text-lg mb-2">{metric.title}</p>
                        <div className="flex items-center justify-between space-x-2">
                            <span className="text-xl md:text-2xl font-bold text-[#00FFFF]">
                                {metric.value}
                            </span>
                            <span
                                className={`text-sm p-1 px-2 rounded ${isNegative
                                    ? 'text-red-500 bg-red-600/25'
                                    : 'text-green-400 bg-green-600/25'
                                    }`}
                            >
                                {metric.change}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DashboardMetrics;