import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginModal from '../LoginModal';
import { AuthProvider } from '@/contexts/AuthContext';



//Renders login form - Tests if modal shows email/password fields and "Sign In" button

//Closes modal - Tests that X button calls the close function

//Submits credentials - Tests that entering email/password and clicking submit calls the login function with correct data

describe('LoginModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnLogin = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onLogin: mockOnLogin,
  };

  it('renders login form when open', () => {
    render(
      <AuthProvider>
        <LoginModal {...defaultProps} />
      </AuthProvider>
    );

    expect(screen.getByText('Join Our Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AuthProvider>
        <LoginModal {...defaultProps} />
      </AuthProvider>
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('submits form with email and password', async () => {
    render(
      <AuthProvider>
        <LoginModal {...defaultProps} />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});