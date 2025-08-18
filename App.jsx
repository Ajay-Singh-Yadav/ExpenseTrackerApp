import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import ApolloClientProvider from './src/graphql/ApolloClientProvider';
import { AuthProvider } from './src/navigation/AuthContext';
import { WalletProvider } from './src/constants/WalletContext';
import { RefetchProvider } from './src/constants/RefetchContext';
import { ThemeProvider } from './src/constants/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <RefetchProvider>
        <WalletProvider>
          <AuthProvider>
            <ApolloClientProvider>
              <AppNavigation />
            </ApolloClientProvider>
          </AuthProvider>
        </WalletProvider>
      </RefetchProvider>
    </ThemeProvider>
  );
};

export default App;
