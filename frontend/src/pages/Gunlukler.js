import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaSearch, FaFilter, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaEye,
  FaSave, FaTimes, FaCheck
} from 'react-icons/fa'; // FaPlus KALDIRILDI
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Doğru ay evreleri ile demo veriler
  const initialGunlukler = [
    {
      id: 1,
      tarih: "10 Ocak 2026",
      ayEvresi: "🌒", // Hilal
      icerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi...",
      tamIcerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi. Hava açıktı ve yıldızlar parlaktı. Gökyüzünde tek başına parlıyordu.",
      goruntulenme: 5,
      duzenlemeTarihi: null
    },
    {
      id: 2,
      tarih: "15 Ocak 2026",
      ayEvresi: "🌕", // Dolunay
      icerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü...",
      tamIcerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü. Bulutlar arasında kaybolup tekrar görünüyordu. Deniz kenarından izlemek harikaydı.",
      goruntulenme: 3,
      duzenlemeTarihi: null
    }
  ];

  const [gunlukler, setGunlukler] = useState(() => {
    const saved = localStorage.getItem('gunlukVerileri');
    return saved ? JSON.parse(saved) : initialGunlukler;
  });

  useEffect(() => {
    localStorage.setItem('gunlukVerileri', JSON.stringify(gunlukler));
  }, [gunlukler]);

  const [filtre, setFiltre] = useState({
    arama: '',
    ayEvresi: 'tum',
    siralama: 'yeniden-eskive'
  });

  const [modalDurumu, setModalDurumu] = useState({
    goster: false,
    mod: 'detay',
    seciliGunluk: null
  });

  const [duzenlemeVerisi, setDuzenlemeVerisi] = useState(null);

  // Doğru ay evreleri listesi
  const ayEvreleri = [
    { emoji: '🌑', ad: 'Yeni Ay' },
    { emoji: '🌒', ad: 'Hilal' },
    { emoji: '🌓', ad: 'İlk Dördün' },
    { emoji: '🌔', ad: 'Şişkin Ay' },
    { emoji: '🌕', ad: 'Dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay' },
    { emoji: '🌗', ad: 'Son Dördün' },
    { emoji: '🌘', ad: 'Hilal' }
  ];

  // Filtreleme
  const filtrelenmisGunlukler = gunlukler.filter(gunluk => {
    if (filtre.arama && !gunluk.tamIcerik.toLowerCase().includes(filtre.arama.toLowerCase())) {
      return false;
    }
    
    if (filtre.ayEvresi !== 'tum' && !gunluk.ayEvresi.includes(filtre.ayEvresi)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
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
      const yeniGunlukler = gunlukler.filter(gunluk => gunluk.id !== id);
      setGunlukler(yeniGunlukler);
      setModalDurumu({ goster: false, mod: 'detay', seciliGunluk: null });
      alert('✅ Günlük başarıyla silindi!');
    }
  };

  const handleDetayGoster = (gunluk) => {
    const guncellenmisGunlukler = gunlukler.map(g => 
      g.id === gunluk.id ? { ...g, goruntulenme: g.goruntulenme + 1 } : g
    );
    setGunlukler(guncellenmisGunlukler);
    
    setModalDurumu({
      goster: true,
      mod: 'detay',
      seciliGunluk: { ...gunluk, goruntulenme: gunluk.goruntulenme + 1 }
    });
  };

  const handleDuzenlemeyeBasla = (gunluk) => {
    setDuzenlemeVerisi({ ...gunluk });
    setModalDurumu({
      goster: true,
      mod: 'duzenle',
      seciliGunluk: gunluk
    });
  };

  const handleDuzenlemeKaydet = () => {
    if (!duzenlemeVerisi.tamIcerik.trim()) {
      alert('Gözlem içeriği boş olamaz!');
      return;
    }

    const guncellenmisGunlukler = gunlukler.map(gunluk =>
      gunluk.id === duzenlemeVerisi.id 
        ? { 
            ...duzenlemeVerisi, 
            duzenlemeTarihi: new Date().toLocaleString('tr-TR'),
            icerik: duzenlemeVerisi.tamIcerik.substring(0, 100) + '...'
          } 
        : gunluk
    );

    setGunlukler(guncellenmisGunlukler);
    setModalDurumu({
      goster: false,
      mod: 'detay',
      seciliGunluk: null
    });
    setDuzenlemeVerisi(null);
    alert('✅ Günlük başarıyla güncellendi!');
  };

  const handleModalKapat = () => {
    setModalDurumu({
      goster: false,
      mod: 'detay',
      seciliGunluk: null
    });
    setDuzenlemeVerisi(null);
  };

  // YENİ GÜNLÜK EKLE FONKSİYONU KALDIRILDI

  // DÜZENLEME MODAL İÇERİĞİ
  const renderDuzenlemeModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            ✏️ Günlük Düzenle - {duzenlemeVerisi?.tarih}
          </h3>
          <button
            onClick={handleModalKapat}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Tarih */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Tarih</label>
            <input
              type="text"
              value={duzenlemeVerisi?.tarih || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                tarih: e.target.value
              })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              placeholder="Örnek: 15 Ocak 2026"
            />
          </div>
          
          {/* DOĞRU AY EVRELERİ */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Ay Evresi</label>
            <div className="grid grid-cols-4 gap-3">
              {ayEvreleri.map((evre, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDuzenlemeVerisi({
                    ...duzenlemeVerisi,
                    ayEvresi: evre.emoji
                  })}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                    duzenlemeVerisi?.ayEvresi === evre.emoji 
                      ? 'bg-yellow-500/30 border-2 border-yellow-500 scale-105' 
                      : 'bg-gray-900 hover:bg-gray-800 border border-gray-700'
                  }`}
                  title={evre.ad}
                >
                  <span className="text-2xl mb-1">{evre.emoji}</span>
                  <span className="text-xs text-gray-300">{evre.ad}</span>
                </button>
              ))}
            </div>
            {duzenlemeVerisi?.ayEvresi && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-300 text-sm">
                  Seçilen: <span className="text-yellow-300 font-semibold">
                    {duzenlemeVerisi.ayEvresi} {ayEvreleri.find(e => e.emoji === duzenlemeVerisi.ayEvresi)?.ad}
                  </span>
                </p>
              </div>
            )}
          </div>
          
          {/* Gözlem İçeriği */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Gözlem İçeriği</label>
            <textarea
              value={duzenlemeVerisi?.tamIcerik || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                tamIcerik: e.target.value
              })}
              className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
              placeholder="Ay gözleminizi buraya yazın..."
            />
            <p className="text-gray-400 text-sm mt-1">
              Karakter sayısı: {(duzenlemeVerisi?.tamIcerik || '').length}
            </p>
          </div>
          
          {/* Butonlar */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleModalKapat}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
            >
              <FaTimes className="mr-2" />
              İptal
            </button>
            <button
              onClick={handleDuzenlemeKaydet}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center"
            >
              <FaCheck className="mr-2" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // DETAY MODAL İÇERİĞİ
  const renderDetayModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            {modalDurumu.seciliGunluk.ayEvresi} Gözlemi - {modalDurumu.seciliGunluk.tarih}
          </h3>
          <button
            onClick={handleModalKapat}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{modalDurumu.seciliGunluk.tarih}</span>
            <span>ID: {modalDurumu.seciliGunluk.id}</span>
            <span className="text-green-400">✅ Kayıtlı</span>
            <span>👁️ {modalDurumu.seciliGunluk.goruntulenme} görüntülenme</span>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-bold mb-2">Gözlem İçeriği</h4>
            <p className="text-gray-300 whitespace-pre-line">
              {modalDurumu.seciliGunluk.tamIcerik}
            </p>
          </div>
          
          {modalDurumu.seciliGunluk.duzenlemeTarihi && (
            <div className="bg-yellow-900/30 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-yellow-300">✏️ Son Düzenleme</h4>
              <p className="text-gray-300">{modalDurumu.seciliGunluk.duzenlemeTarihi}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => handleGunlukSil(modalDurumu.seciliGunluk.id)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center"
            >
              <FaTrash className="mr-2" />
              Sil
            </button>
            <button
              onClick={() => handleDuzenlemeyeBasla(modalDurumu.seciliGunluk)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all flex items-center"
            >
              <FaEdit className="mr-2" />
              Düzenle
            </button>
            <button
              onClick={handleModalKapat}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
            
            <Link 
              to="/OgrenciDashboard" 
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Dashboard'a Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filtreler - + YENİ GÜNLÜK BUTONU KALDIRILDI */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filtreler</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleFiltreTemizle}
                  className="text-sm text-gray-400 hover:text-white px-3 py-1 hover:bg-gray-700 rounded"
                >
                  Filtreleri Temizle
                </button>
                {/* + YENİ GÜNLÜK BUTONU BURADA YOK */}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaSearch className="mr-2" />
                  Gözlem içeriğinde ara
                </label>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.arama}
                  onChange={(e) => setFiltre({...filtre, arama: e.target.value})}
                />
              </div>
              
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
                  <option value="🌑">Yeni Ay</option>
                  <option value="🌒">Hilal</option>
                  <option value="🌓">İlk Dördün</option>
                  <option value="🌔">Şişkin Ay</option>
                  <option value="🌕">Dolunay</option>
                  <option value="🌖">Şişkin Ay</option>
                  <option value="🌗">Son Dördün</option>
                  <option value="🌘">Hilal</option>
                </select>
              </div>
              
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

          {/* Günlük Listesi - YENİ GÜNLÜK BUTONU KALDIRILDI */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Kayıtlı Günlükleriniz ({filtrelenmisGunlukler.length})
              </h3>
              <div className="text-sm text-gray-400">
                <span className="text-green-400">Düzenlenebilir Mod</span>
              </div>
            </div>
            
            {filtrelenmisGunlukler.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Günlük Bulunamadı</h3>
                <p className="text-gray-400">Filtrelerinizi değiştirmeyi deneyin.</p>
                {/* + YENİ GÜNLÜK BUTONU BURADA YOK */}
              </div>
            ) : (
              filtrelenmisGunlukler.map((gunluk) => (
                <div 
                  key={gunluk.id} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-700/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold mb-1">
                            {gunluk.ayEvresi} {ayEvreleri.find(e => e.emoji === gunluk.ayEvresi)?.ad || 'Gözlem'} - {gunluk.tarih}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{gunluk.tarih}</span>
                            <span>ID: {gunluk.id}</span>
                            <span className="text-green-400">✅ Kayıtlı</span>
                            <span className="text-blue-400">👁️ {gunluk.goruntulenme} görüntülenme</span>
                          </div>
                        </div>
                        <span className="text-3xl">{gunluk.ayEvresi}</span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-300 line-clamp-2">
                          {gunluk.icerik}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleDetayGoster(gunluk)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        <FaEye className="mr-2" />
                        Detay
                      </button>
                      <button
                        onClick={() => handleDuzenlemeyeBasla(gunluk)}
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

          {/* MODALLAR */}
          {modalDurumu.goster && (
            modalDurumu.mod === 'duzenle' 
              ? renderDuzenlemeModal()
              : renderDetayModal()
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Ay Günlüğü - Günlük Yönetimi
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;