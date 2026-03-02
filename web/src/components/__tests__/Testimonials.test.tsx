import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Testimonials from '../Testimonials';

describe('Testimonials', () => {
  it('renders quotes for each testimonial', () => {
    render(<Testimonials />);
    expect(screen.getByText(/royalty income is now covering my rent/i)).toBeInTheDocument();
    expect(screen.getByText(/photography student/i)).toBeInTheDocument();
    expect(screen.getByText(/Voice tasks are my go-to/i)).toBeInTheDocument();
  });

  it('renders attributions with names and countries', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Amara O., Nigeria/)).toBeInTheDocument();
    expect(screen.getByText(/Rafael M., Brazil/)).toBeInTheDocument();
    expect(screen.getByText(/Priya S., India/)).toBeInTheDocument();
  });

  it('renders section number', () => {
    render(<Testimonials />);
    expect(screen.getByText('06')).toBeInTheDocument();
  });
});
