interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
}

export default function DataTable<T extends Record<string, unknown>>({ columns, rows }: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              className="table-row"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .table-row:hover td { background: var(--surface-elevated); }
      `}</style>
    </div>
  );
}
