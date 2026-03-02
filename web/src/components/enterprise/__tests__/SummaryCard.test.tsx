import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SummaryCard from '../SummaryCard';
import { Database } from 'lucide-react';

describe('SummaryCard', () => {
  it('renders label and value', () => {
    render(<SummaryCard label="Total Datasets" value="42" icon={Database} />);
    expect(screen.getByText('Total Datasets')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    render(
      <SummaryCard
        label="Revenue"
        value="$1,200"
        icon={Database}
        trend="+12% from last month"
        trendUp={true}
      />
    );
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });

  it('does not render trend when not provided', () => {
    render(<SummaryCard label="Total Datasets" value="42" icon={Database} />);
    expect(screen.queryByText(/from last month/i)).not.toBeInTheDocument();
  });

  it('shows trend with trendUp=true using primary color styling', () => {
    render(
      <SummaryCard
        label="Revenue"
        value="$1,200"
        icon={Database}
        trend="+12%"
        trendUp={true}
      />
    );
    const trendEl = screen.getByText('+12%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl.style.color).toBe('var(--primary)');
  });

  it('shows trend with trendUp=false using red color styling', () => {
    render(
      <SummaryCard
        label="Revenue"
        value="$1,200"
        icon={Database}
        trend="-5%"
        trendUp={false}
      />
    );
    const trendEl = screen.getByText('-5%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl.style.color).toBe('var(--red)');
  });
});
