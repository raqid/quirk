import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('framer-motion', () => import('../../__mocks__/framer-motion'));

import Hero from '../Hero';

describe('Hero', () => {
  it('renders headline text', () => {
    render(<Hero />);
    expect(screen.getByText(/Your data trains AI/i)).toBeInTheDocument();
  });

  it('renders subheadline text about earning', () => {
    render(<Hero />);
    expect(screen.getByText(/Earn upfront payments plus royalties/i)).toBeInTheDocument();
  });

  it('renders within a section element', () => {
    render(<Hero />);
    const headline = screen.getByText(/Your data trains AI/i);
    expect(headline.closest('section')).toBeInTheDocument();
  });

  it('renders phone mockup with earnings', () => {
    render(<Hero />);
    expect(screen.getByText('Total Earned')).toBeInTheDocument();
    expect(screen.getByText('$284.50')).toBeInTheDocument();
  });

  it('renders task cards in phone mockup', () => {
    render(<Hero />);
    expect(screen.getByText('Photo · Street Signs')).toBeInTheDocument();
    expect(screen.getByText('Audio · Ambient Sound')).toBeInTheDocument();
  });
});
