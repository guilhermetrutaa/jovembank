import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

interface User {
  name: string;
  parish: 'Sagrado' | 'Lourdes' | 'São Vicente';
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;