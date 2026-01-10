import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaSearch, FaFilter,
  FaArrowLeft, FaEye, FaTrash, FaEdit
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Demo günlük verileri - 2026 yılı
  const [gunlukler] = useState([
    {
      id: 1,
      tarih: "10 Ocak 2026",
      ayEvresi: "🌕 Dolunay",
      havaDurumu: "☀️ Güneşli",
      gozlem: "Ay bu gece çok parlaktı. Gökyüzü tamamen açıktı. Kraterleri net görebiliyordum.",
      notlar: "Teleskopla izledim, harikaydı!"
    },
    {
      id: 2,
      tarih: "9 Ocak 2026",
      ayEvresi: "🌔 Şişkin Ay",
      havaDurumu: "⛅ Parçalı Bulutlu",
      gozlem: "Ay bulutlar arasında kaybolup çıkıyordu. Biraz puslu görünüyordu.",
      notlar: ""
    },
    {
      id: 3,
      tarih: "8 Ocak 2026",
      ayEvresi: "🌓 İlk Dördün",
      havaDurumu: "☀️ Güneşli",
      gozlem: "Ayın yarısı görünüyordu. Çok net ve parlaktı.",
      notlar: "Fotoğraf çektim"
    },
    {
      id: 4,
      tarih: "7 Ocak 2026",
      ayEvresi: "🌒 Hilal (İlk)",
      havaDurumu: "☁️ Bulutlu",
      gozlem: "Çok ince bir hilaldi. Bulutlar nedeniyle zor göründü.",
      notlar: ""
    },
    {
      id: 5,
      tarih: "6 Ocak 2026",
      ayEvresi: "🌑 Yeni Ay",
      havaDurumu: "⛈️ Fırtınalı",
      gozlem: "Ay görünmüyordu. Gökyüzü bulutluydu ve yağmur vardı.",
      notlar: "Gözlem yapamadım"
    },
    {
      id: 6,
      tarih: "5 Ocak 2026",
      ayEvresi: "🌘 Hilal (Son)",
      havaDurumu: "☀️ Güneşli",
      gozlem: "İnce bir hilal şeklindeydi. Akşam erken saatlerde göründü.",
      notlar: ""
    },
    {
      id: 7,
      tarih: "4 Ocak 2026",
      ayEvresi: "🌗 Son Dördün",
      havaDurumu: "❄️ Karlı",
      gozlem: "Ayın yarısı görünüyordu ama kar nedeniyle pusluydu.",
      notlar: "Hava çok soğuktu"
    },
    {
      id: 8,
      tarih: "3 Ocak 2026",
      ayEvresi: "🌖 Şişkin Ay (Son)",
      havaDurumu: "☀️ Güneşli",
      gozlem: "Ay neredeyse dolunay gibiydi. Çok parlaktı.",
      notlar: ""
    }
  ]);

  const [filtreler, setFiltreler] = useState({
    arama: '',
    ayEvresi: '',
    baslangicTarihi: '',
    bitisTarihi: ''
  });

  const [siralama, setSiralama] = useState('yeniden-eskiye');

  const ayEvreleri = [
    { emoji: '🌑', ad: 'Yeni Ay', deger: 'yeni' },
    { emoji: '🌒', ad: 'Hilal (İlk)', deger: 'hilal-ilk' },
    { emoji: '🌓', ad: 'İlk Dördün', deger: 'ilk-dordun' },
    { emoji: '🌔', ad: 'Şişkin Ay', deger: 'siskin' },
    { emoji: '🌕', ad: 'Dolunay', deger: 'dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay (Son)', deger: 'siskin-son' },
    { emoji: '🌗', ad: 'Son Dördün', deger: 'son-dordun' },
    { emoji: '🌘', ad: 'Hilal (Son)', deger: 'hilal-son' }
  ];

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltreler(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSiralamaChange = (e) => {
    setSiralama(e.target.value);
  };

  const handleGunlukSil = (id) => {
    if (window.confirm('Bu günlüğü silmek istediğinize emin misiniz?')) {
      alert(`Günlük silindi! (ID: ${id}) - Firebase eklenecek`);
    }
  };

  const handleGunlukDuzenle = (id) => {
    alert(`Günlük düzenleme sayfası yakında eklenecek! (ID: ${id})`);
  };

  const handleGunlukDetay = (id) => {
    alert(`Günlük detay sayfası yakında eklenecek! (ID: ${id})`);
  };

  // Filtreleme ve sıralama işlemi
  const filtrelenmisGunlukler = gunlukler
    .filter(gunluk => {
      // Arama filtresi
      if (filtreler.arama && !gunluk.gozlem.toLowerCase().includes(filtreler.arama.toLowerCase())) {
        return false;
      }
      
      // Ay evresi filtresi
      if (filtreler.ayEvresi) {
        const evreAdi = ayEvreleri.find(e => e.deger === filtreler.ayEvresi)?.ad;
        if (!gunluk.ayEvresi.includes(evreAdi)) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      if (siralama === 'yeniden-eskiye') {
        return new Date(b.tarih) - new Date(a.tarih);
      } else {
        return new Date(a.tarih) - new Date(b.tarih);
      }
    });

  const toplamGunluk = gunlukler.length;
  const goruntulenenGunluk = filtrelenmisGunlukler.length;

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
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/OgrenciDashboard" 
                className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
              >
                <FaArrowLeft className="mr-2" />
                Dashboard'a Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Başlık ve İstatistikler */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              📚 Geçmiş Günlüklerim
            </h1>
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-900/30 rounded-lg px-4 py-2">
                <p className="text-gray-300">
                  <span className="font-bold text-white">{toplamGunluk}</span> Toplam Günlük
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-lg px-4 py-2">
                <p className="text-gray-300">
                  <span className="font-bold text-white">{goruntulenenGunluk}</span> Görüntülenen
                </p>
              </div>
              <div className="bg-green-900/30 rounded-lg px-4 py-2">
                <p className="text-gray-300">
                  En Çok: <span className="font-bold text-white">Dolunay</span>
                </p>
              </div>
            </div>
          </div>

          {/* Filtreler */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <FaFilter className="text-2xl text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Filtreler</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Arama */}
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaSearch className="inline mr-2" />
                  Arama
                </label>
                <input
                  type="text"
                  name="arama"
                  value={filtreler.arama}
                  onChange={handleFiltreChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Gözlemlerde ara..."
                />
              </div>

              {/* Ay Evresi */}
              <div>
                <label className="block text-gray-300 mb-2">
                  🌕 Ay Evresi
                </label>
                <select
                  name="ayEvresi"
                  value={filtreler.ayEvresi}
                  onChange={handleFiltreChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  <option value="">Tüm Ay Evreleri</option>
                  {ayEvreleri.map((evre) => (
                    <option key={evre.deger} value={evre.deger}>
                      {evre.emoji} {evre.ad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-gray-300 mb-2">
                  📅 Sıralama
                </label>
                <select
                  value={siralama}
                  onChange={handleSiralamaChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  <option value="yeniden-eskiye">Yeniden Eskiye</option>
                  <option value="eskiden-yeniye">Eskiden Yeniye</option>
                </select>
              </div>

              {/* Filtreleri Temizle */}
              <div className="flex items-end">
                <button
                  onClick={() => setFiltreler({ arama: '', ayEvresi: '', baslangicTarihi: '', bitisTarihi: '' })}
                  className="w-full py-2 bg-gradient-to-r from-red-900/50 to-pink-900/50 text-red-300 font-semibold rounded-lg hover:from-red-900/70 hover:to-pink-900/70 transition-colors border border-red-700/50"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Günlük Listesi */}
          <div className="space-y-6">
            {filtrelenmisGunlukler.length > 0 ? (
              filtrelenmisGunlukler.map((gunluk) => (
                <div 
                  key={gunluk.id} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {/* Sol: Bilgiler */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl">{gunluk.ayEvresi.split(' ')[0]}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {gunluk.ayEvresi}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-400">
                            <span className="flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              {gunluk.tarih}
                            </span>
                            <span>{gunluk.havaDurumu}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 line-clamp-2">
                        "{gunluk.gozlem}"
                      </p>
                      
                      {gunluk.notlar && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded-lg">
                          <p className="text-gray-400 text-sm">
                            <strong>Not:</strong> {gunluk.notlar}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sağ: Butonlar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleGunlukDetay(gunluk.id)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-colors"
                      >
                        <FaEye className="mr-2" />
                        Detay
                      </button>
                      <button
                        onClick={() => handleGunlukDuzenle(gunluk.id)}
                        className="flex items-center justify-center px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded-lg hover:bg-yellow-900/70 transition-colors"
                      >
                        <FaEdit className="mr-2" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleGunlukSil(gunluk.id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900/70 transition-colors"
                      >
                        <FaTrash className="mr-2" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Boş liste durumu */
              <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Günlük Bulunamadı
                </h3>
                <p className="text-gray-300 mb-6">
                  Filtrelere uygun günlük bulunamadı veya henüz günlük yazmadınız.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setFiltreler({ arama: '', ayEvresi: '', baslangicTarihi: '', bitisTarihi: '' })}
                    className="px-6 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 font-semibold rounded-lg hover:from-blue-900/70 hover:to-purple-900/70 transition-colors border border-blue-700/50"
                  >
                    Filtreleri Temizle
                  </button>
                  <Link
                    to="/YeniGunluk"
                    className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
                  >
                    Yeni Günlük Yaz
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sayfalama (ileride eklenecek) */}
          {filtrelenmisGunlukler.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">
                  Sayfalama özelliği yakında eklenecek!
                </p>
              </div>
            </div>
          )}

          {/* Demo Mod Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🎯 Demo Modu
            </h3>
            <p className="text-gray-300">
              Şu anda demo verilerle çalışıyorsunuz. Firebase eklenince gerçek günlükleriniz yüklenecek.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>Toplam:</strong> {toplamGunluk} demo günlük
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>Filtre:</strong> Arama ve ay evresi
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>İşlemler:</strong> Detay, düzenle, sil
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - Geçmiş Günlükler
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Tüm ay gözlemleriniz burada saklanır. İstediğiniz zaman inceleyebilirsiniz.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;