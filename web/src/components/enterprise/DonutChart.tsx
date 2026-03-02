'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

export default function DonutChart({ data, title }: DonutChartProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 16px' }}>{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--text)',
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', color: 'var(--text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
