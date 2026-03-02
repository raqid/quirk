import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('framer-motion', () => import('../../__mocks__/framer-motion'));

import Home from '../page';

describe('Home page', () => {
  it('renders Navbar with Quirk wordmark', () => {
    render(<Home />);
    expect(screen.getByText('Quirk')).toBeInTheDocument();
  });

  it('renders Hero section', () => {
    render(<Home />);
    expect(screen.getByText(/Your data trains AI/i)).toBeInTheDocument();
  });

  it('renders HowItWorks section', () => {
    render(<Home />);
    expect(screen.getByText('Browse tasks')).toBeInTheDocument();
  });

  it('renders ForContributors section', () => {
    render(<Home />);
    expect(screen.getByText('Build a portfolio that earns while you sleep')).toBeInTheDocument();
  });

  it('renders ForCompanies section', () => {
    render(<Home />);
    expect(screen.getByText('Diverse, ethical, real-world training data')).toBeInTheDocument();
  });

  it('renders Testimonials section', () => {
    render(<Home />);
    expect(screen.getByText(/royalty income is now covering my rent/i)).toBeInTheDocument();
  });

  it('renders Footer with copyright', () => {
    render(<Home />);
    expect(screen.getByText(/2026 Quirk Labs/i)).toBeInTheDocument();
  });

  it('renders CTASection with email form', () => {
    render(<Home />);
    expect(screen.getByText('Get Early Access')).toBeInTheDocument();
  });
});
