import React, { useState } from 'react';
import { FaUser, FaLock, FaArrowLeft, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function OgrenciGiris() {
  const [formData, setFormData] = useState({
    email: '',
    sifre: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Giriş denemesi:', formData);
    alert('Firebase eklenince çalışacak! Şimdilik demo modda.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Ay Günlüğü
              </h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🌙 Öğrenci Girişi
            </h1>
            <p className="text-gray-300">
              Ay günlüğüne devam etmek için giriş yap
            </p>
          </div>

          {/* Giriş Formu */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="ogrenci@okul.edu.tr"
                  required
                />
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  Şifre
                </label>
                <input
                  type="password"
                  name="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>

              {/* Giriş Butonu */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02]"
              >
                🔓 GİRİŞ YAP
              </button>
            </form>

            {/* Ekstra Linkler */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-gray-400">
                Hesabın yok mu?{' '}
                <Link 
                  to="/OgrenciKayit" 
                  className="text-yellow-400 hover:text-yellow-300 font-semibold"
                >
                  Kayıt Ol
                </Link>
              </p>
              
              <p className="text-gray-400">
                Öğretmen misin?{' '}
                <Link 
                  to="#" 
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Öğretmen girişi yakında eklenecek!');
                  }}
                >
                  Öğretmen Girişi
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🎯 Demo Modu
            </h3>
            <p className="text-gray-300">
              Şu anda Firebase bağlantısı yok. Tasarımı test ediyoruz.
              Firebase ekleyince gerçek giriş çalışacak.
            </p>
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong>Demo giriş:</strong> test@ogrenci.com / 123456
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - Öğrenci Platformu
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciGiris;