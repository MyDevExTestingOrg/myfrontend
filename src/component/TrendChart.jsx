import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const TrendCharts = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-400 text-center py-10">No trend data available.</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-800 mb-4">Cycle Time Trend (30 Days)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tick={{fontSize: 10}} stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tick={{fontSize: 12}} />
                            <Tooltip />
                            <Line type="monotone" dataKey="dailyAvgCycleTime" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Cycle Time (min)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-800 mb-4">Weekly Throughput (PRs Merged)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tick={{fontSize: 10}} stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Bar dataKey="prCount" fill="#10b981" radius={[4, 4, 0, 0]} name="PRs Merged" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-md font-bold text-gray-800 mb-4">Average PR Size Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tick={{fontSize: 10}} stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Area type="monotone" dataKey="dailyAvgPrSize" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSize)" name="Avg LOC" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TrendCharts;