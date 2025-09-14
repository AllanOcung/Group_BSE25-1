import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth;

describe('Login component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ 
      login: mockLogin, 
      user: null, 
      loading: false,
      isAuthenticated: false
    });
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('submits valid login data', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ token: 'fake-token' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => 
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });
});