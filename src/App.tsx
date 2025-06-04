import React from 'react';
import Layout from './components/Layout';
import InstallmentsList from './components/InstallmentsList';
import RegistrationScreen from './components/RegistrationScreen';
import { InstallmentProvider } from './context/InstallmentContext';
import { UserProvider, useUser } from './context/UserContext';

const AppContent: React.FC = () => {
  const { isRegistered } = useUser();

  if (!isRegistered) {
    return <RegistrationScreen />;
  }

  return (
    <Layout>
      <InstallmentsList />
    </Layout>
  );
};

function App() {
  return (
    <UserProvider>
      <InstallmentProvider>
        <AppContent />
      </InstallmentProvider>
    </UserProvider>
  );
}

export default App;