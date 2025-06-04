import React from 'react';
import { HeartIcon } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; {currentYear} JovemBank - Todos os direitos reservados
          </p>
          
          <p className="text-sm text-slate-600 flex items-center gap-1">
            Feito com <HeartIcon className="h-4 w-4 text-red-500" /> para a comunidade Crisma Jovem
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;