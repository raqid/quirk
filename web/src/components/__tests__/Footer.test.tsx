import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Footer from '../Footer';

describe('Footer', () => {
  it('renders copyright with Quirk Labs', () => {
    render(<Footer />);
    expect(screen.getByText(/2026 Quirk Labs/i)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });
});
