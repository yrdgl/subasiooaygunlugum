import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OgretmenGiris() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Geçici kontrol - Firebase yapılınca değişecek
    if (email && sifre) {
      navigate('/OgretmenDashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* BAŞLIK */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h1 className="text-3xl font-bold text-white mb-2">Öğretmen Girişi</h1>
          <p className="text-gray-300">Ay Günlüğü Öğretmen Paneli</p>
        </div>

        {/* GİRİŞ FORMU */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ogretmen@okul.edu.tr"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Giriş Yap
          </button>
        </form>

        {/* BİLGİ NOTU */}
        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">Demo Bilgi:</span> Firebase bağlantısı yapılana kadar her geçerli e-posta ve şifre girişi öğretmen paneline yönlendirir.
          </p>
        </div>

        {/* LİNKLER */}
        <div className="mt-6 text-center space-y-3">
          <Link to="/" className="block text-gray-400 hover:text-white">
            ← Ana Sayfaya Dön
          </Link>
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
            Sadece yetkili öğretmenler içindir
          </div>
        </div>
      </div>
    </div>
  );
}

export default OgretmenGiris;