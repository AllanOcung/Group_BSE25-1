import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '../Register';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth;

describe('Register component', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ 
      register: mockRegister,
      user: null,
      loading: false,
      isAuthenticated: false
    });
    jest.clearAllMocks();
  });

  it('submits registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValueOnce({ token: 'fake-token' });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });
});