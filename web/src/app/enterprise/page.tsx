import { Database, BarChart2, FolderOpen, DollarSign } from 'lucide-react';
import SummaryCard from '@/components/enterprise/SummaryCard';
import DataTable from '@/components/enterprise/DataTable';
import DonutChart from '@/components/enterprise/DonutChart';
import { RECENT_PURCHASES, AVAILABILITY_DATA } from '@/data/enterprise';

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'var(--primary)',
  Processing: 'var(--amber)',
};

export default function EnterpriseDashboard() {
  const columns = [
    { key: 'dataset' as const, label: 'Dataset' },
    { key: 'date' as const, label: 'Date' },
    { key: 'quantity' as const, label: 'Quantity' },
    { key: 'amount' as const, label: 'Amount' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: unknown) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          color: STATUS_COLORS[String(value)] ?? 'var(--text-secondary)',
          background: `${STATUS_COLORS[String(value)] ?? 'var(--text-secondary)'}1A`,
        }}>
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Overview</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Your enterprise data workspace</p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <SummaryCard label="Available Datasets" value="24" icon={Database} trend="+3 this month" trendUp />
        <SummaryCard label="Total Data Points" value="2.1M" icon={BarChart2} trend="+180K this month" trendUp />
        <SummaryCard label="Active Collections" value="3" icon={FolderOpen} />
        <SummaryCard label="Monthly Spend" value="$12,400" icon={DollarSign} trend="+8% vs last month" trendUp={false} />
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Recent Purchases */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>Recent Purchases</p>
            <a href="/enterprise/purchases" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>View all</a>
          </div>
          <DataTable columns={columns} rows={RECENT_PURCHASES} />
        </div>

        {/* Donut chart */}
        <DonutChart data={AVAILABILITY_DATA} title="Data Availability by Type" />
      </div>
    </div>
  );
}
