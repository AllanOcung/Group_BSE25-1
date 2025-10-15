import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the complex components
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div>Toaster</div>,
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }) => children,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Just check that the app renders without throwing errors
    // Use getAllByText and check that at least one exists
    const portfolioHubs = screen.getAllByText('Portfolio Hub');
    expect(portfolioHubs.length).toBeGreaterThan(0);
  });
});