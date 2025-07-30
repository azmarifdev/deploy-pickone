'use client';
import React from 'react';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface SimpleChartProps {
    title: string;
    data: ChartData[];
    type: 'bar' | 'doughnut';
}

const SimpleChart: React.FC<SimpleChartProps> = ({ title, data, type }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    if (type === 'bar') {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(item.value / maxValue) * 100}%`,
                                        backgroundColor: item.color,
                                    }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Simple doughnut chart representation
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                    {data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        return (
                            <div
                                key={index}
                                className="absolute inset-0 w-32 h-32 rounded-full"
                                style={{
                                    background: `conic-gradient(${item.color} 0deg ${angle}deg, transparent ${angle}deg 360deg)`,
                                    transform: `rotate(${index * (360 / data.length)}deg)`,
                                }}></div>
                        );
                    })}
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{total}</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleChart;
