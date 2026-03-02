import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  it('renders all 3 steps', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Browse tasks')).toBeInTheDocument();
    expect(screen.getByText('Capture data')).toBeInTheDocument();
    expect(screen.getByText('Earn money')).toBeInTheDocument();
  });

  it('renders descriptions for each step', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/AI companies post specific data collection tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Use the Quirk app to capture media/i)).toBeInTheDocument();
    expect(screen.getByText(/Get paid instantly for approved submissions/i)).toBeInTheDocument();
  });

  it('renders numbered section markers', () => {
    render(<HowItWorks />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });
});
