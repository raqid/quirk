import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

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
});
