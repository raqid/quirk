'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Dataset } from '@/data/enterprise';

interface DatasetChartsProps {
  dataset: Dataset;
}

const tooltipStyle = {
  contentStyle: {
    background: 'var(--surface-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--text)',
  },
};

export default function DatasetCharts({ dataset }: DatasetChartsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Geographic Distribution */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', margin: '0 0 16px' }}>
          Geographic Distribution
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataset.geoDistribution} layout="vertical" margin={{ left: 12, right: 12 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString(), 'Items']} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16}>
              {dataset.geoDistribution.map((_, i) => (
                <Cell key={i} fill={i === 0 ? 'var(--primary)' : 'var(--surface-elevated)'} stroke="var(--border)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quality Distribution */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', margin: '0 0 16px' }}>
          Quality Distribution
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataset.qualityDistribution} margin={{ left: 0, right: 12 }}>
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString(), 'Items']} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {dataset.qualityDistribution.map((_, i) => (
                <Cell key={i} fill={i === 0 ? 'var(--primary)' : 'var(--blue)'} opacity={1 - i * 0.2} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
