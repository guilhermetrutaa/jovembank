import React from 'react';
import Layout from './components/Layout';
import InstallmentsList from './components/InstallmentsList';
import { InstallmentProvider } from './context/InstallmentContext';

function App() {
  return (
    <InstallmentProvider>
      <Layout>
        <InstallmentsList />
      </Layout>
    </InstallmentProvider>
  );
}

export default App;