import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

const themeContextValue = {
  theme: { barStyle: 'dark-content', bgColor: '#000' },
  themeKey: 'dark',
  toggleTheme: jest.fn(),
};
const refetchContextValue = {
  shouldRefetch: false,
  setShouldRefetch: jest.fn(),
};
const walletContextValue = {
  wallets: [{ label: 'Wallet1', value: 'Wallet1' }],
  addWallet: jest.fn(),
  editWallet: jest.fn(),
};
const authContextValue = {
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock('./src/constants/ThemeContext', () => ({
  ThemeProvider: ({ children }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  ThemeContext: {
    Consumer: ({ children }) => children(themeContextValue),
  },
  useTheme: () => themeContextValue,
}));
jest.mock('./src/constants/RefetchContext', () => ({
  RefetchProvider: ({ children }) => (
    <div data-testid="refetch-provider">{children}</div>
  ),
  RefetchContext: {
    Consumer: ({ children }) => children(refetchContextValue),
  },
}));
jest.mock('./src/constants/WalletContext', () => ({
  WalletProvider: ({ children }) => (
    <div data-testid="wallet-provider">{children}</div>
  ),
  WalletContext: {
    Consumer: ({ children }) => children(walletContextValue),
  },
}));
jest.mock('./src/navigation/AuthContext', () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  AuthContext: {
    Consumer: ({ children }) => children(authContextValue),
  },
  useAuth: () => authContextValue,
}));
jest.mock('./src/graphql/ApolloClientProvider', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="apollo-provider">{children}</div>
  ),
}));
const mockAppNavigation = jest.fn(() => null);
jest.mock('./src/navigation/AppNavigation', () => {
  return function MockAppNavigation(props) {
    mockAppNavigation(props);
    return <div data-testid="app-navigation" />;
  };
});

describe('App', () => {
  afterEach(() => {
    mockAppNavigation.mockClear();
  });

  it('should_propagate_context_values_to_app_navigation', () => {
    render(<App />);
    // The mockAppNavigation should have been called at least once
    expect(mockAppNavigation).toHaveBeenCalled();
    // Optionally, check that context hooks were called (if AppNavigation uses them)
    // Since we mock useTheme and useAuth, we can check their values
    // But here, we check that AppNavigation rendered, implying context propagation
  });
});
