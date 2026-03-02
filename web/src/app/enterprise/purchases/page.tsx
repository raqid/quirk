import { DollarSign, Download } from 'lucide-react';
import { PURCHASE_HISTORY } from '@/data/enterprise';

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'rgba(255,255,255,0.5)',
  Processing: 'rgba(180,160,120,0.6)',
};

export default function PurchasesPage() {
  const totalSpend = '$47,200';

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Purchase History</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>All data purchases and transactions</p>
      </div>

      {/* Total Spend Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--primary-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <DollarSign size={18} color="rgba(255,255,255,0.5)" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 2px' }}>Total Spend (All Time)</p>
          <p style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>{totalSpend}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface-elevated)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            <option>All Time</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <select style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface-elevated)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            <option>All Statuses</option>
            <option>Delivered</option>
            <option>Processing</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Dataset', 'Date', 'Quantity', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PURCHASE_HISTORY.map((row, i) => (
                <tr key={row.id} className="purchase-row" style={{
                  borderBottom: i < PURCHASE_HISTORY.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {row.id}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {row.dataset}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {row.quantity}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {row.amount}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: STATUS_COLORS[row.status] ?? 'var(--text-secondary)',
                      background: `${STATUS_COLORS[row.status] ?? 'var(--text-secondary)'}1A`,
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {row.status === 'Delivered' && (
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}>
                        <Download size={11} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .purchase-row:hover td { background: var(--surface-elevated); }
      `}</style>
    </div>
  );
}
