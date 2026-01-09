import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-4xl">🌙</span>
            <span>Ay Bilgisi</span>
          </Link>
          
          <div className="flex gap-8">
            <Link 
              to="/"
              className={`text-base font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-blue-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/candemirin-ay-gunlugu"
              className={`text-base font-medium transition-all duration-300 ${
                isActive('/candemirin-ay-gunlugu') 
                  ? 'text-blue-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Candemir'in Ay Günlüğü
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
