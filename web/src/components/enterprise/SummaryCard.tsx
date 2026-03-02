import { type LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function SummaryCard({ label, value, icon: Icon, trend, trendUp }: SummaryCardProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={15} color="var(--text-secondary)" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>{value}</p>
        {trend && (
          <p style={{
            fontSize: '12px',
            color: trendUp ? 'var(--primary)' : 'var(--red)',
            margin: 0,
          }}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
