import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ForCompanies from '../ForCompanies';

describe('ForCompanies', () => {
  it('renders section heading about data', () => {
    render(<ForCompanies />);
    expect(screen.getByText('Diverse, ethical, real-world training data')).toBeInTheDocument();
  });

  it('renders section number', () => {
    render(<ForCompanies />);
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('renders the Request a Dataset CTA', () => {
    render(<ForCompanies />);
    expect(screen.getByText('Request a Dataset')).toBeInTheDocument();
  });

  it('renders 47 countries stat', () => {
    render(<ForCompanies />);
    expect(screen.getByText('47 countries')).toBeInTheDocument();
  });
});
