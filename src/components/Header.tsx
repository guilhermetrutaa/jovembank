import React from 'react';
import { BanknoteIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="gradient-bg text-white shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BanknoteIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">JovemBank</h1>
              <p className="text-xs text-blue-100">Iniciativa Crisma Jovem</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Facilitando seu pagamento do Crisma</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;