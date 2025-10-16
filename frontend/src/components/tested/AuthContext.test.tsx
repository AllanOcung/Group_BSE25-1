import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <div>
      <span data-testid="logged-in">Logged in: {isLoggedIn ? 'Yes' : 'No'}</span>
      <span data-testid="user">User: {user?.name || 'None'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('logged-in')).toHaveTextContent('Logged in: No');
    expect(screen.getByTestId('user')).toHaveTextContent('User: None');
  });
});