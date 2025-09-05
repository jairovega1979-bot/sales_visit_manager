
'use client';

import React from 'react';
import { SalesTrend } from '@/lib/sales-objectives';

interface SparklineProps {
  data: SalesTrend[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({ 
  data, 
  width = 100, 
  height = 30, 
  color = '#3b82f6',
  className = '' 
}: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className={`w-[${width}px] h-[${height}px] bg-gray-100 rounded ${className}`} />;
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return <div className={`w-[${width}px] h-[${height}px] bg-gray-100 rounded ${className}`} />;
  }

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Determine trend direction
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const isUpward = lastValue > firstValue;
  const trendColor = isUpward ? '#10b981' : '#ef4444';

  return (
    <div className={`inline-block ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Background area */}
        <defs>
          <linearGradient id={`gradient-${data[0]?.period}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#gradient-${data[0]?.period})`}
          className="opacity-50"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {values.map((value, index) => {
          const x = (index / (values.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={trendColor}
              className="opacity-75"
            />
          );
        })}
      </svg>
    </div>
  );
}
