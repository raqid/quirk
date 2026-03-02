import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ForContributors from '../ForContributors';

describe('ForContributors', () => {
  it('renders section heading', () => {
    render(<ForContributors />);
    expect(screen.getByText('Build a portfolio that earns while you sleep')).toBeInTheDocument();
  });

  it('renders section number', () => {
    render(<ForContributors />);
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('renders inline stats in prose', () => {
    render(<ForContributors />);
    expect(screen.getByText('$127/month')).toBeInTheDocument();
    expect(screen.getByText('3x royalty multiplier')).toBeInTheDocument();
  });

  it('renders royalty portfolio description', () => {
    render(<ForContributors />);
    expect(screen.getByText(/royalty system means your past submissions/i)).toBeInTheDocument();
  });
});
