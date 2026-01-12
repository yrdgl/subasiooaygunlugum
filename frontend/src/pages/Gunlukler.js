import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaSearch, FaFilter, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaEye,
  FaTimes, FaCheck, FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Demo veriler - Öğretmen yıldızları dahil
  const initialGunlukler = [
    {
      id: 1,
      tarih: "10 Ocak 2026",
      ayEvresi: "🌒",
      ayEvresiAd: "Hilal",
      icerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi...",
      tamIcerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi. Hava açıktı ve yıldızlar parlaktı. Gökyüzünde tek başına parlıyordu.",
      goruntulenme: 5,
      duzenlemeTarihi: null,
      ogretmenYildizi: 5,
      ogretmenYorumu: "Çok detaylı ve bilimsel bir gözlem olmuş! 🌟",
      yildizVerilmeTarihi: "12 Ocak 2026"
    },
    {
      id: 2,
      tarih: "15 Ocak 2026",
      ayEvresi: "🌕",
      ayEvresiAd: "Dolunay",
      icerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü...",
      tamIcerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü. Bulutlar arasında kaybolup tekrar görünüyordu. Deniz kenarından izlemek harikaydı.",
      goruntulenme: 3,
      duzenlemeTarihi: null,
      ogretmenYildizi: 4,
      ogretmenYorumu: "Güzel gözlem, ancak biraz daha detay ekleyebilirdin.",
      yildizVerilmeTarihi: "17 Ocak 2026"
    },
    {
      id: 3,
      tarih: "8 Ocak 2026",
      ayEvresi: "🌓",
      ayEvresiAd: "İlk Dördün",
      icerik: "Ay yarım daire şeklinde görünüyordu...",
      tamIcerik: "Ay yarım daire şeklinde görünüyordu. Kenarları keskin ve netti. Teleskopla gözlemlemek çok keyifliydi.",
      goruntulenme: 2,
      duzenlemeTarihi: null,
      ogretmenYildizi: 3,
      ogretmenYorumu: "Gözlem güzel, devam et!",
      yildizVerilmeTarihi: "10 Ocak 2026"
    },
    {
      id: 4,
      tarih: "5 Ocak 2026",
      ayEvresi: "🌑",
      ayEvresiAd: "Yeni Ay",
      icerik: "Ay bugün görünmüyordu ama gökyüzü yıldızlarla doluydu...",
      tamIcerik: "Ay bugün görünmüyordu ama gökyüzü yıldızlarla doluydu. Samanyolu çok net görünüyordu. Yıldız gözlemi için mükemmel bir geceydi.",
      goruntulenme: 4,
      duzenlemeTarihi: null,
      ogretmenYildizi: 4,
      ogretmenYorumu: "Yıldız gözlemi fikri çok yaratıcı!",
      yildizVerilmeTarihi: "7 Ocak 2026"
    },
    {
      id: 5,
      tarih: "3 Ocak 2026",
      ayEvresi: "🌘",
      ayEvresiAd: "Hilal",
      icerik: "Sabah erken saatlerde ince bir hilal gözlemledim...",
      tamIcerik: "Sabah erken saatlerde ince bir hilal gözlemledim. Güneş doğmadan hemen önce ufukta parlıyordu. Çok etkileyici bir manzaraydı.",
      goruntulenme: 1,
      duzenlemeTarihi: null,
      ogretmenYildizi: null,
      ogretmenYorumu: null,
      yildizVerilmeTarihi: null
    }
  ];

  const [gunlukler, setGunlukler] = useState(() => {
    const saved = localStorage.getItem('gunlukVerileri');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(gunluk => ({
        ...gunluk,
        ayEvresiAd: gunluk.ayEvresiAd || getAyEvresiAdFromEmoji(gunluk.ayEvresi),
        ogretmenYildizi: gunluk.ogretmenYildizi || null,
        ogretmenYorumu: gunluk.ogretmenYorumu || null,
        yildizVerilmeTarihi: gunluk.yildizVerilmeTarihi || null
      }));
    }
    return initialGunlukler;
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

  const getAyEvresiAdFromEmoji = (emoji) => {
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
    
    const bulunan = ayEvreleri.find(evre => evre.emoji === emoji);
    return bulunan ? bulunan.ad : 'Bilinmeyen Evre';
  };

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

  // Yıldızları render etme fonksiyonu
  const renderYildizlar = (sayi) => {
    if (!sayi) return null;
    
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
      </div>
    );
  };

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
    const guncellenmisGunlukler = gunlukler.map(gunluk =>
      gunluk.id === duzenlemeVerisi.id 
        ? { 
            ...duzenlemeVerisi, 
            duzenlemeTarihi: new Date().toLocaleString('tr-TR'),
            icerik: duzenlemeVerisi.tamIcerik && duzenlemeVerisi.tamIcerik.length > 100 
              ? duzenlemeVerisi.tamIcerik.substring(0, 100) + '...' 
              : duzenlemeVerisi.tamIcerik || 'Gözlem notu eklenmedi',
            ayEvresiAd: duzenlemeVerisi.ayEvresiAd || getAyEvresiAdFromEmoji(duzenlemeVerisi.ayEvresi)
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
          
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Ay Evresi</label>
            <div className="grid grid-cols-4 gap-3">
              {ayEvreleri.map((evre, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDuzenlemeVerisi({
                    ...duzenlemeVerisi,
                    ayEvresi: evre.emoji,
                    ayEvresiAd: evre.ad
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
                    {duzenlemeVerisi.ayEvresi} {duzenlemeVerisi.ayEvresiAd || getAyEvresiAdFromEmoji(duzenlemeVerisi.ayEvresi)}
                  </span>
                </p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Gözlem İçeriği (Opsiyonel)</label>
            <textarea
              value={duzenlemeVerisi?.tamIcerik || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                tamIcerik: e.target.value
              })}
              className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
              placeholder="Ay gözleminizi buraya yazın (zorunlu değil)..."
            />
            <p className="text-gray-400 text-sm mt-1">
              Karakter sayısı: {(duzenlemeVerisi?.tamIcerik || '').length}
            </p>
          </div>
          
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

  // DETAY MODAL İÇERİĞİ - YILDIZ BİLGİLERİ EKLENDİ
  const renderDetayModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            {modalDurumu.seciliGunluk.ayEvresi} {modalDurumu.seciliGunluk.ayEvresiAd || getAyEvresiAdFromEmoji(modalDurumu.seciliGunluk.ayEvresi)} Gözlemi - {modalDurumu.seciliGunluk.tarih}
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
          
          {/* YILDIZ BİLGİSİ - SADECE DETAYDA GÖSTER */}
          {modalDurumu.seciliGunluk.ogretmenYildizi ? (
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 rounded-xl p-4 border border-yellow-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-3 text-xl" />
                  <h4 className="font-bold text-yellow-300">Öğretmen Değerlendirmesi</h4>
                </div>
                <div className="flex items-center">
                  {renderYildizlar(modalDurumu.seciliGunluk.ogretmenYildizi)}
                  <span className="ml-2 text-yellow-300 font-bold">
                    {modalDurumu.seciliGunluk.ogretmenYildizi}/5
                  </span>
                </div>
              </div>
              
              {modalDurumu.seciliGunluk.ogretmenYorumu && (
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-gray-300 italic">
                    "{modalDurumu.seciliGunluk.ogretmenYorumu}"
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    📅 Değerlendirme tarihi: {modalDurumu.seciliGunluk.yildizVerilmeTarihi}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <FaStar className="text-gray-500 mr-3" />
                <div>
                  <h4 className="font-bold text-gray-400">Henüz Değerlendirilmedi</h4>
                  <p className="text-gray-500 text-sm">
                    Öğretmeniniz bu günlüğü henüz değerlendirmedi.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-bold mb-2">Gözlem İçeriği</h4>
            <p className="text-gray-300 whitespace-pre-wrap break-words overflow-wrap-break-word">
              {modalDurumu.seciliGunluk.tamIcerik || 'Gözlem notu eklenmemiş.'}
            </p>
          </div>
          
          {modalDurumu.seciliGunluk.duzenlemeTarihi && (
            <div className="bg-blue-900/30 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-blue-300">✏️ Son Düzenleme</h4>
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
          {/* Basit Toplam Bilgisi */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Tüm Günlükleriniz</h2>
                <p className="text-gray-300">
                  Toplam <span className="text-yellow-300 font-bold">{gunlukler.length}</span> günlük kaydınız bulunuyor.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-gray-300">
                  Öğretmen yıldızlarını görmek için günlüğe tıklayın
                </span>
              </div>
            </div>
          </div>

          {/* Filtreler */}
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

          {/* Günlük Listesi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Kayıtlı Günlükleriniz ({filtrelenmisGunlukler.length})
              </h3>
              <div className="text-sm text-gray-400">
                <span className="text-green-400">Detayda öğretmen yıldızını görün</span>
              </div>
            </div>
            
            {filtrelenmisGunlukler.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Günlük Bulunamadı</h3>
                <p className="text-gray-400">Filtrelerinizi değiştirmeyi deneyin.</p>
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
                            {gunluk.ayEvresi} {gunluk.ayEvresiAd || getAyEvresiAdFromEmoji(gunluk.ayEvresi)} - {gunluk.tarih}
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
                      
                      {/* Sadece yıldız varsa küçük gösterim */}
                      {gunluk.ogretmenYildizi && (
                        <div className="flex items-center text-sm">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-yellow-300 mr-2">
                            {gunluk.ogretmenYildizi} yıldız
                          </span>
                          <span className="text-gray-500 text-xs">
                            (detay için tıklayın)
                          </span>
                        </div>
                      )}
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
          <p className="text-gray-500 text-sm mt-2">
            Öğretmen yıldızlarını görmek için günlüklere tıklayın
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;