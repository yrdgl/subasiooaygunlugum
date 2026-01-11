import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaBook, FaChartBar, 
  FaUserCircle, FaArrowRight, FaPlus, FaHistory,
  FaStar, FaSignOutAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function OgrenciDashboard() {
  const navigate = useNavigate();
  
  // Demo verileri
  const [ogrenci] = useState({
    ad: "Ali",
    soyad: "Yılmaz",
    sinif: "5",
    sube: "A",
    ogrenciNo: "12345"
  });

  const [bugununBilgisi] = useState({
    tarih: "10 Ocak 2026",
    ayEvresi: "🌖 Son Dördün",
    ayDurumu: "Ayın yarısı görünüyor, hafif bulutlu"
  });

  const handleCikis = () => {
    navigate('/');
  };

  const handleYeniGunluk = () => {
    navigate('/YeniGunluk');
  };

  const handleGecmisGunlukler = () => {
    navigate('/Gunlukler');
  };

  const handleAyTakvimi = () => {
    navigate('/AyTakvimi');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaUserCircle className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">{ogrenci.ad} {ogrenci.soyad}</p>
                  <p className="text-sm text-gray-400">{ogrenci.sinif}-{ogrenci.sube}</p>
                </div>
              </div>
              
              <button
                onClick={handleCikis}
                className="flex items-center text-gray-300 hover:text-white transition-colors ml-4 px-3 py-2 hover:bg-gray-800 rounded-lg"
              >
                <FaSignOutAlt className="mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hoşgeldin Bölümü */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              🌙 Merhaba, {ogrenci.ad}!
            </h1>
            <p className="text-gray-300">
              Ay gözlem günlüğüne hoş geldin. Bugün ayı gözlemledin mi?
            </p>
          </div>

          {/* Bugünün Bilgisi */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 mb-8 border border-blue-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-3">
                  <div className="text-6xl">{bugununBilgisi.ayEvresi}</div>
                  <div>
                    <h3 className="text-2xl font-bold">Bugün: {bugununBilgisi.tarih}</h3>
                    <p className="text-gray-300">{bugununBilgisi.ayDurumu}</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/YeniGunluk"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Yeni Günlük Yaz
              </Link>
            </div>
          </div>

          {/* Hızlı Eylemler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Eylem 1 - Yeni Günlük */}
            <button 
              onClick={handleYeniGunluk}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <FaPlus className="text-2xl text-blue-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Yeni Günlük Yaz</h3>
              <p className="text-gray-300 mb-4">
                Bugünkü ay gözlemini kaydet
              </p>
              <div className="w-full py-2 bg-blue-900/50 text-blue-300 rounded-lg text-center">
                Hemen Başla
              </div>
            </button>

            {/* Eylem 2 - Geçmiş Günlükler */}
            <button 
              onClick={handleGecmisGunlukler}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center">
                  <FaHistory className="text-2xl text-purple-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Geçmiş Günlükler</h3>
              <p className="text-gray-300 mb-4">
                Önceki gözlemlerini incele
              </p>
              <div className="w-full py-2 bg-purple-900/50 text-purple-300 rounded-lg text-center">
                Görüntüle
              </div>
            </button>

            {/* Eylem 3 - Ay Takvimi */}
            <button 
              onClick={handleAyTakvimi}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-green-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ay Takvimi</h3>
              <p className="text-gray-300 mb-4">
                Ayın evrelerini takip et
              </p>
              <div className="w-full py-2 bg-green-900/50 text-green-300 rounded-lg text-center">
                Takvimi Aç
              </div>
            </button>
          </div>

          {/* AY TAKVİMİ BÖLÜMÜ - SON GÜNLÜKLER YERİNE */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-2xl text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold">🌙 Ay Takvimi</h2>
                </div>
                <button 
                  onClick={handleAyTakvimi}
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  Tam Ekran Aç →
                </button>
              </div>
              
              {/* Mini Ay Takvimi Görünümü */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                  <div className="text-7xl mb-4 animate-pulse">🌕</div>
                  <h3 className="text-xl font-bold mb-2">Dolunay - Ocak 2026</h3>
                  <p className="text-gray-300 mb-4">
                    Bu ayın en parlak evresi 15 Ocak'ta
                  </p>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((gun, index) => (
                      <div key={index} className="text-center p-2 text-sm text-gray-400">
                        {gun}
                      </div>
                    ))}
                    {/* Ay takvimi günleri - basit versiyon */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((gun) => (
                      <div 
                        key={gun} 
                        className={`text-center p-2 text-sm rounded-lg ${gun === 10 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' : 'text-gray-400 hover:bg-gray-800/50'}`}
                      >
                        {gun}
                        {gun === 10 && <div className="text-xs mt-1">🌖</div>}
                        {gun === 15 && <div className="text-xs mt-1">🌕</div>}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Ay Evreleri Özeti */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🌑</div>
                    <p className="text-xs text-gray-400 mt-1">Yeni Ay</p>
                    <p className="text-xs text-yellow-300">5 Oca</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🌓</div>
                    <p className="text-xs text-gray-400 mt-1">İlk Dördün</p>
                    <p className="text-xs text-yellow-300">12 Oca</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🌕</div>
                    <p className="text-xs text-gray-400 mt-1">Dolunay</p>
                    <p className="text-xs text-yellow-300">15 Oca</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl">🌗</div>
                    <p className="text-xs text-gray-400 mt-1">Son Dördün</p>
                    <p className="text-xs text-yellow-300">22 Oca</p>
                  </div>
                </div>
                
                {/* Hızlı Navigasyon */}
                <div className="flex justify-center space-x-3 pt-4">
                  <button
                    onClick={() => navigate('/YeniGunluk?date=2026-01-15')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm"
                  >
                    📝 15 Ocak Günlüğü
                  </button>
                  <button
                    onClick={handleAyTakvimi}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all text-sm"
                  >
                    📅 Tam Takvim
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Mod Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🎯 Demo Modu
            </h3>
            <p className="text-gray-300">
              Şu anda Firebase bağlantısı yok. Bu bir demo gösterimdir.
              Firebase eklenince gerçek öğrenci verileri yüklenecek.
            </p>
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong>Demo Öğrenci:</strong> Ali Yılmaz / 5-A
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - Öğrenci Dashboard
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Bu panel öğrencilerin ay gözlemlerini takip etmesi için tasarlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciDashboard;