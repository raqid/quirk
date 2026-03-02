import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the Quirk wordmark', () => {
    render(<Navbar />);
    expect(screen.getByText('Quirk')).toBeInTheDocument();
  });

  it('renders as a fixed header', () => {
    render(<Navbar />);
    const header = screen.getByText('Quirk').closest('header');
    expect(header).toHaveClass('fixed');
  });
});
