import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataTable from '../DataTable';

type Row = { id: string; name: string; status: string; amount: number };

const columns = [
  { key: 'id' as const, label: 'ID' },
  { key: 'name' as const, label: 'Name' },
  { key: 'status' as const, label: 'Status' },
  { key: 'amount' as const, label: 'Amount' },
];

const rows: Row[] = [
  { id: 'PUR-001', name: 'Urban Traffic Footage', status: 'Delivered', amount: 1750 },
  { id: 'PUR-002', name: 'South Asian Street Scenes', status: 'Processing', amount: 200 },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('PUR-001')).toBeInTheDocument();
    expect(screen.getByText('Urban Traffic Footage')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('PUR-002')).toBeInTheDocument();
    expect(screen.getByText('South Asian Street Scenes')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('handles custom render functions for columns', () => {
    const columnsWithRender = [
      { key: 'id' as const, label: 'ID' },
      {
        key: 'status' as const,
        label: 'Status',
        render: (value: Row[keyof Row]) => (
          <span data-testid="status-badge">{String(value).toUpperCase()}</span>
        ),
      },
    ];

    render(<DataTable columns={columnsWithRender} rows={rows} />);
    const badges = screen.getAllByTestId('status-badge');
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent('DELIVERED');
    expect(badges[1]).toHaveTextContent('PROCESSING');
  });

  it('renders correct number of rows', () => {
    render(<DataTable columns={columns} rows={rows} />);
    const tableRows = screen.getAllByRole('row');
    // 1 header row + 2 data rows
    expect(tableRows).toHaveLength(3);
  });
});
