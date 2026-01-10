import React, { useState } from 'react';
import { 
  FaMoon, FaSearch, FaFilter, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaEye, FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Demo günlük verileri
  const [gunlukler] = useState([
    {
      id: 1,
      baslik: "🌙 Hilal'in İlk Görünüşü",
      tarih: "10 Ocak 2026",
      ayEvresi: "🌙 Hilal",
      icerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi...",
      tamIcerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi. Hava açıktı ve yıldızlar parlaktı. JKBBA5DskjwnhSLKsldnx sbc kscnsncBADBVKASJDNKJSNDCOwjfpmexs",
      not: "kdfhvlsd fmvsaskdmlkhxnvmssalkhdflaudmyufspoaldhvb zmvrnmök cssaldkgfnosssm <cdfkcsl <.sjdcm",
      goruntulenme: 5,
      favori: true
    },
    {
      id: 2,
      baslik: "🌕 Dolunay Gözlemi",
      tarih: "15 Ocak 2026",
      ayEvresi: "🌕 Dolunay",
      icerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü...",
      tamIcerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü. Bulutlar arasında kaybolup tekrar görünüyordu.",
      not: "Fotoğraf çekmeyi unutma",
      goruntulenme: 3,
      favori: false
    },
    {
      id: 3,
      baslik: "🌓 İlk Dördün",
      tarih: "5 Ocak 2026",
      ayEvresi: "🌓 İlk Dördün",
      icerik: "Ayın sağ yarısı aydınlıktı. Net bir şekilde görülüyordu...",
      tamIcerik: "Ayın sağ yarısı aydınlıktı. Net bir şekilde görülüyordu. Hava biraz bulutluydu ama ay görünüyordu.",
      not: "Teleskop ile gözlem yapıldı",
      goruntulenme: 2,
      favori: true
    }
  ]);

  const [filtre, setFiltre] = useState({
    arama: '',
    ayEvresi: 'tum',
    siralama: 'yeniden-eskive'
  });

  const [seciliGunluk, setSeciliGunluk] = useState(null);

  // İstatistikler
  const istatistikler = {
    toplamGunluk: gunlukler.length,
    goruntulenme: gunlukler.reduce((toplam, gunluk) => toplam + gunluk.goruntulenme, 0),
    enCokGoruntulenen: gunlukler.reduce((enCok, gunluk) => 
      gunluk.goruntulenme > enCok.goruntulenme ? gunluk : enCok
    ),
    favoriSayisi: gunlukler.filter(g => g.favori).length
  };

  // Filtreleme
  const filtrelenmisGunlukler = gunlukler.filter(gunluk => {
    // Arama filtresi
    if (filtre.arama && !gunluk.baslik.toLowerCase().includes(filtre.arama.toLowerCase()) && 
        !gunluk.icerik.toLowerCase().includes(filtre.arama.toLowerCase())) {
      return false;
    }
    
    // Ay evresi filtresi
    if (filtre.ayEvresi !== 'tum' && !gunluk.ayEvresi.includes(filtre.ayEvresi)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sıralama
    if (filtre.siralama === 'yeniden-eskive') {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  const handleFiltreTemizle = () => {
    setFiltre({
      arama: '',
      ayEvresi: 'tum',
      siralama: 'yeniden-eskive'
    });
  };

  const handleGunlukSil = (id) => {
    if (window.confirm('Bu günlüğü silmek istediğinize emin misiniz?')) {
      alert(`Günlük #${id} silinecek (Firebase entegrasyonu sonrası aktif olacak)`);
    }
  };

  const handleGunlukDetay = (gunluk) => {
    setSeciliGunluk(gunluk);
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
                Geçmiş Günlüklerim
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
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-900/30 to-blue-700/30 rounded-xl p-4 border border-blue-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Toplam Günlük</p>
                  <p className="text-2xl font-bold">{istatistikler.toplamGunluk}</p>
                </div>
                <FaCalendarAlt className="text-2xl text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-700/30 rounded-xl p-4 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Görüntülenme</p>
                  <p className="text-2xl font-bold">{istatistikler.goruntulenme}</p>
                </div>
                <FaEye className="text-2xl text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 rounded-xl p-4 border border-yellow-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Favoriler</p>
                  <p className="text-2xl font-bold">{istatistikler.favoriSayisi}</p>
                </div>
                <FaStar className="text-2xl text-yellow-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/30 to-green-700/30 rounded-xl p-4 border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Çok Görüntülenen</p>
                  <p className="text-lg font-bold truncate">{istatistikler.enCokGoruntulenen.baslik.split(' ')[0]}</p>
                </div>
                <FaEye className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          {/* Filtreler */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filtreler</h2>
              <button
                onClick={handleFiltreTemizle}
                className="text-sm text-gray-400 hover:text-white"
              >
                Filtreleri Temizle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Arama */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaSearch className="mr-2" />
                  Günlük başlığı veya notlarda ara
                </label>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.arama}
                  onChange={(e) => setFiltre({...filtre, arama: e.target.value})}
                />
              </div>
              
              {/* Ay Evresi */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaFilter className="mr-2" />
                  Ay Evresi
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.ayEvresi}
                  onChange={(e) => setFiltre({...filtre, ayEvresi: e.target.value})}
                >
                  <option value="tum">Tüm Ay Evreleri</option>
                  <option value="🌙">Hilal</option>
                  <option value="🌓">İlk Dördün</option>
                  <option value="🌕">Dolunay</option>
                  <option value="🌗">Son Dördün</option>
                </select>
              </div>
              
              {/* Sıralama */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaFilter className="mr-2" />
                  Sıralama
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.siralama}
                  onChange={(e) => setFiltre({...filtre, siralama: e.target.value})}
                >
                  <option value="yeniden-eskive">Yeniden Eskiye</option>
                  <option value="eskiden-yeniye">Eskiden Yeniye</option>
                </select>
              </div>
            </div>
          </div>

          {/* Günlük Listesi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Kayıtlı Günlükleriniz ({filtrelenmisGunlukler.length})
              </h3>
              <div className="text-sm text-gray-400">
                Kaynak: <span className="text-green-400">Kayıtlı Veriler</span>
              </div>
            </div>
            
            {filtrelenmisGunlukler.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Günlük Bulunamadı</h3>
                <p className="text-gray-400">Filtrelerinizi değiştirmeyi deneyin veya yeni günlük yazın.</p>
              </div>
            ) : (
              filtrelenmisGunlukler.map((gunluk) => (
                <div 
                  key={gunluk.id} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-700/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Sol: Günlük Bilgisi */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold mb-1">
                            {gunluk.ayEvresi} {gunluk.baslik}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{gunluk.tarih}</span>
                            <span>ID: {gunluk.id}</span>
                            <span className="text-green-400">Kayıtlı</span>
                            {gunluk.favori && (
                              <span className="text-yellow-400">⭐ Favori</span>
                            )}
                          </div>
                        </div>
                        <span className="text-3xl">{gunluk.ayEvresi}</span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-300 line-clamp-2">
                          {gunluk.icerik}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <strong>Not:</strong> {gunluk.not}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sağ: Butonlar */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleGunlukDetay(gunluk)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        <FaEye className="mr-2" />
                        Detay
                      </button>
                      <button
                        onClick={() => alert(`Günlük #${gunluk.id} düzenlenecek`)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all"
                      >
                        <FaEdit className="mr-2" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleGunlukSil(gunluk.id)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                      >
                        <FaTrash className="mr-2" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detay Modalı */}
          {seciliGunluk && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {seciliGunluk.ayEvresi} {seciliGunluk.baslik}
                  </h3>
                  <button
                    onClick={() => setSeciliGunluk(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{seciliGunluk.tarih}</span>
                    <span>ID: {seciliGunluk.id}</span>
                    <span className="text-green-400">Kayıtlı</span>
                    <span>👁️ {seciliGunluk.goruntulenme} görüntülenme</span>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Günlük İçeriği</h4>
                    <p className="text-gray-300 whitespace-pre-line">
                      {seciliGunluk.tamIcerik}
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Not</h4>
                    <p className="text-gray-300">{seciliGunluk.not}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSeciliGunluk(null)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => alert(`Günlük #${seciliGunluk.id} düzenlenecek`)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all"
                    >
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Gunlukler;