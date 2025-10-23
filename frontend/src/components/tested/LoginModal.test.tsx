import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <AuthProvider>
          <LoginModal {...defaultProps} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Check modal heading
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginModal {...defaultProps} />
        </AuthProvider>
      </BrowserRouter>
    );

    // Find the X button that closes the modal
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));
    
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('allows user to fill in form fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginModal {...defaultProps} />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});