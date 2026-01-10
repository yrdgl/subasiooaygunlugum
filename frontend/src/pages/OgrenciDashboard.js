import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaBook, FaChartBar, 
  FaUserCircle, FaArrowRight, FaPlus, FaHistory,
  FaStar, FaSignOutAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function OgrenciDashboard() {
  const navigate = useNavigate();
  
  // Demo verileri (Firebase eklenince gerçek veriler gelecek)
  const [ogrenci] = useState({
    ad: "Ali",
    soyad: "Yılmaz",
    sinif: "5",
    sube: "A",
    ogrenciNo: "12345"
  });

  const [istatistikler] = useState({
    toplamGunluk: 12,
    enCokYazilanEvre: "Dolunay",
    sonGiris: "10 Ocak 2026"
  });

  const [sonGunlukler] = useState([
    { id: 1, tarih: "9 Oca 2026", ayEvresi: "🌕 Dolunay", durum: "Çok parlak ve büyük görünüyordu" },
    { id: 2, tarih: "8 Oca 2026", ayEvresi: "🌔 Şişkin Ay", durum: "Bulutlar arasında kayboluyordu" },
    { id: 3, tarih: "7 Oca 2026", ayEvresi: "🌓 İlk Dördün", durum: "Yarısı görünüyordu, hava açıktı" },
  ]);

  const [bugununBilgisi] = useState({
    tarih: "10 Ocak 2026",
    ayEvresi: "🌖 Son Dördün",
    ayDurumu: "Ayın yarısı görünüyor, hafif bulutlu"
  });

  const handleCikis = () => {
    // Firebase eklenince gerçek çıkış yapılacak
    navigate('/');
  };

  const handleYeniGunluk = () => {
    navigate('/YeniGunluk');
  };

  const handleGecmisGunlukler = () => {
    // Bu butonu düzelttim: /Gunlukler sayfasına yönlendiriyor
    navigate('/Gunlukler');
  };

  const handleAyTakvimi = () => {
    // Bu butonu düzelttim: /AyTakvimi sayfasına yönlendiriyor
    navigate('/AyTakvimi');
  };

  const handleGunlukDetay = (id) => {
    // Günlük detay sayfası için - örnek olarak id ile yönlendirme
    alert(`Günlük detay sayfası yakında eklenecek! ID: ${id}`);
    // Gelecekte: navigate(`/GunlukDetay/${id}`);
  };

  const handleTumGunlukler = () => {
    // Tüm günlükler butonunu da düzelttim
    navigate('/Gunlukler');
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

          {/* İki Sütun: İstatistikler ve Son Günlükler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol: İstatistikler */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <FaChartBar className="text-2xl text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold">İstatistiklerin</h2>
              </div>
              
              <div className="space-y-4">
                {/* Toplam Günlük */}
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                      <FaBook className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">Toplam Günlük</p>
                      <p className="text-2xl font-bold">{istatistikler.toplamGunluk} yazı</p>
                    </div>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>

                {/* En Çok Yazılan */}
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                      <FaStar className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">En Çok Yazılan Evre</p>
                      <p className="text-xl font-bold">{istatistikler.enCokYazilanEvre}</p>
                    </div>
                  </div>
                  <div className="text-3xl">🌕</div>
                </div>

                {/* Son Giriş */}
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mr-3">
                      <FaCalendarAlt className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">Son Giriş Tarihi</p>
                      <p className="text-xl font-bold">{istatistikler.sonGiris}</p>
                    </div>
                  </div>
                  <div className="text-3xl">📅</div>
                </div>
              </div>
            </div>

            {/* Sağ: Son Günlükler */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaHistory className="text-2xl text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold">Son Günlüklerin</h2>
                </div>
                <button 
                  onClick={handleTumGunlukler}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Tümünü Gör →
                </button>
              </div>
              
              <div className="space-y-4">
                {sonGunlukler.map((gunluk) => (
                  <button 
                    key={gunluk.id} 
                    onClick={() => handleGunlukDetay(gunluk.id)}
                    className="w-full p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{gunluk.ayEvresi.split(' ')[0]}</span>
                        <div>
                          <p className="font-semibold">{gunluk.ayEvresi}</p>
                          <p className="text-sm text-gray-400">{gunluk.tarih}</p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <FaArrowRight />
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      "{gunluk.durum}"
                    </p>
                  </button>
                ))}
              </div>
              
              {/* Boş günlük uyarısı */}
              {sonGunlukler.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🌑</div>
                  <h3 className="text-xl font-bold mb-2">Henüz Günlüğün Yok</h3>
                  <p className="text-gray-400 mb-4">
                    İlk ay gözlemini kaydetmeye ne dersin?
                  </p>
                  <button 
                    onClick={handleYeniGunluk}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600"
                  >
                    İlk Günlüğü Yaz
                  </button>
                </div>
              )}
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