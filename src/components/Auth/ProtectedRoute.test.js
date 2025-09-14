import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth;

const MockPage = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users', () => {
    mockUseAuth.mockReturnValue({ 
      user: null, 
      loading: false, 
      isAuthenticated: false,
      hasRole: jest.fn(), 
      hasPermission: jest.fn() 
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MockPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders content for authenticated users', () => {
    mockUseAuth.mockReturnValue({ 
      user: { id: '1' }, 
      loading: false, 
      isAuthenticated: true,
      hasRole: () => true, 
      hasPermission: () => true 
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockPage />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});