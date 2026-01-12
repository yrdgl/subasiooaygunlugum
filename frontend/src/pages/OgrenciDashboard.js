import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaBook, FaChartBar, 
  FaUserCircle, FaArrowRight, FaPlus, FaHistory,
  FaStar, FaSignOutAlt, FaAward, FaTrophy
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function OgrenciDashboard() {
  const navigate = useNavigate();
  
  // Bugünün tarihini al
  const getTodayDate = () => {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('tr-TR', options).format(today);
  };
  
  // Demo verileri - Öğretmen yıldızları dahil
  const [ogrenci] = useState({
    ad: "Ali",
    soyad: "Yılmaz",
    sinif: "5",
    sube: "A",
    ogrenciNo: "12345",
    toplamPuan: 42
  });

  // Öğretmenin verdiği yıldızlı günlükler
  const [yildizliGunlukler] = useState([
    { 
      id: 1, 
      tarih: "2026-01-10", 
      baslik: "Ay'ın Detaylı Gözlemi", 
      ogretmenYildizi: 5,
      ogretmenYorumu: "Çok detaylı ve bilimsel bir gözlem olmuş! 🌟"
    },
    { 
      id: 2, 
      tarih: "2026-01-08", 
      baslik: "Ay Evreleri Karşılaştırması", 
      ogretmenYildizi: 4,
      ogretmenYorumu: "Güzel karşılaştırma, devam et!"
    },
    { 
      id: 3, 
      tarih: "2026-01-05", 
      baslik: "Bulutlu Gecede Ay", 
      ogretmenYildizi: 3,
      ogretmenYorumu: "Gözlem koşullarını iyi anlatmışsın"
    },
    { 
      id: 4, 
      tarih: "2026-01-03", 
      baslik: "İlk Ay Gözlemim", 
      ogretmenYildizi: 4,
      ogretmenYorumu: "İlk gözlem için çok iyi!"
    }
  ]);

  // Yıldızları render etme fonksiyonu
  const renderYildizlar = (sayi) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FaStar 
            key={index}
            className={`text-sm ${
              index < sayi 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-yellow-300 font-semibold">
          {sayi}/5
        </span>
      </div>
    );
  };

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
              {/* Öğrenci bilgileri ve puan */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <FaUserCircle className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {ogrenci.toplamPuan}
                  </div>
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
              🌟 Merhaba, {ogrenci.ad}!
            </h1>
            <p className="text-gray-300">
              Ay gözlem günlüğüne hoş geldin. Öğretmeninden aldığın yıldızlar aşağıda!
            </p>
          </div>

          {/* Toplam Puan ve Yıldız Özeti */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 rounded-2xl p-6 mb-8 border border-yellow-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-6xl">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold flex items-center">
                    <FaTrophy className="mr-3 text-yellow-400" />
                    Toplam Puan: {ogrenci.toplamPuan}
                  </h3>
                  <p className="text-gray-300 mt-2">
                    Öğretmeninden aldığın toplam yıldız puanı
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ))}
                    </div>
                    <span className="ml-4 text-gray-300">
                      En son 5 yıldız aldın! 🎉
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-gray-300">Başarı Puanı</p>
              </div>
            </div>
          </div>

          {/* Yıldızlı Günlükler Bölümü */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <FaStar className="mr-3 text-yellow-400" />
                Öğretmeninden Yıldızlı Günlükler
              </h2>
              <span className="text-gray-400">
                {yildizliGunlukler.length} günlük
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yildizliGunlukler.map((gunluk) => (
                <div 
                  key={gunluk.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{gunluk.baslik}</h3>
                      <p className="text-gray-400 text-sm">
                        📅 {new Date(gunluk.tarih).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      {renderYildizlar(gunluk.ogretmenYildizi)}
                      <span className="text-xs text-gray-500 mt-1">
                        Öğretmen Puanı
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="text-yellow-400 mr-3">📝</div>
                      <div>
                        <p className="text-gray-300 text-sm italic">
                          "{gunluk.ogretmenYorumu}"
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          — Öğretmen Yorumu
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      #{gunluk.id} nolu günlük
                    </span>
                    <button 
                      onClick={() => navigate(`/gunluk/${gunluk.id}`)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center"
                    >
                      Detaylı Gör <FaArrowRight className="ml-2 text-xs" />
                    </button>
                  </div>
                </div>
              ))}
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
                Bugünkü ay gözlemini kaydet ve yıldız kazan!
              </p>
              <div className="w-full py-2 bg-blue-900/50 text-blue-300 rounded-lg text-center flex items-center justify-center">
                <FaStar className="mr-2" /> Yıldız Kazan
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
              <h3 className="text-xl font-bold mb-2">Tüm Günlüklerim</h3>
              <p className="text-gray-300 mb-4">
                Önceki gözlemlerini ve yıldızlarını incele
              </p>
              <div className="w-full py-2 bg-purple-900/50 text-purple-300 rounded-lg text-center">
                Yıldızlarını Gör
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

          {/* Bugünün Bilgisi */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 mb-8 border border-blue-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-6xl">🌙</div>
                <div>
                  <h3 className="text-2xl font-bold">Bugün: {getTodayDate()}</h3>
                  <p className="text-gray-300">
                    Yeni bir günlük yazarak öğretmeninden yıldız kazanabilirsin!
                  </p>
                  <div className="mt-4 flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span className="text-yellow-300">
                      Her günlük için 1-5 yıldız alabilirsin
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleYeniGunluk}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center"
              >
                <FaPlus className="mr-2" />
                Yeni Günlük Başlat
              </button>
            </div>
          </div>

          {/* Ay Takvimi Bölümü */}
          <div className="max-w-6xl mx-auto mb-8">
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
              </div>
            </div>
          </div>

          {/* Demo Mod Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🎯 Demo Modu - Öğrenci Paneli
            </h3>
            <p className="text-gray-300">
              Şu anda Firebase bağlantısı yok. Öğretmen yıldızları demo verilerle gösterilmektedir.
              Firebase eklenince gerçek öğretmen değerlendirmeleri yüklenecek.
            </p>
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong>Demo Öğrenci:</strong> Ali Yılmaz / 5-A
                <br />
                <strong>Toplam Puan:</strong> {ogrenci.toplamPuan} yıldız
                <br />
                <strong>Yıldızlı Günlükler:</strong> {yildizliGunlukler.length} adet
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
            Öğretmen yıldızları ile motivasyonunu artır!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciDashboard;