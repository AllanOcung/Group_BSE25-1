export const mockUser = { id: '1', name: 'John', email: 'john@example.com' };

export const useAuthMock = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  hasRole: () => true,
  hasPermission: () => true,
  ...overrides,
});
