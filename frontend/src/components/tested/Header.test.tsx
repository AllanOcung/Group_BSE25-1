import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';
import '@testing-library/jest-dom';
// Mock the AuthContext




//1.Renders navigation - Tests if header shows "Portfolio Hub", "Home", "Projects", etc.

//2.Shows Sign In button - Tests that non-logged-in users see "Sign In" button

//3.Opens login modal - Tests that clicking "Sign In" opens the login form
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    user: null,
    login: mockLogin,
    logout: mockLogout,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  it('renders the header with logo and navigation', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText('Portfolio Hub')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('shows sign in button when user is not logged in', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('opens login modal when sign in button is clicked', async () => {
    renderWithRouter(<Header />);

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    // Use the actual text from your modal - await for it to appear
    expect(await screen.findByText('Join Our Team')).toBeInTheDocument();
  });
});