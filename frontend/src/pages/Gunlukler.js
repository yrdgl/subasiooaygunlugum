import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaSearch, FaFilter, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaEye, FaStar,
  FaSave, FaTimes, FaCheck
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Başlangıç demo günlük verileri
  const initialGunlukler = [
    {
      id: 1,
      baslik: "🌙 Hilal'in İlk Görünüşü",
      tarih: "10 Ocak 2026",
      ayEvresi: "🌙",
      evreAdi: "Hilal",
      icerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi...",
      tamIcerik: "Hilal ayı bugün çok net göründü. İncecik bir hilal şeklindeydi. Hava açıktı ve yıldızlar parlaktı. Gökyüzünde tek başına parlıyordu.",
      not: "Gözlem saat: 20:30, hava sıcaklığı: 15°C",
      goruntulenme: 5,
      favori: true,
      duzenlemeTarihi: null
    },
    {
      id: 2,
      baslik: "🌕 Dolunay Gözlemi",
      tarih: "15 Ocak 2026",
      ayEvresi: "🌕",
      evreAdi: "Dolunay",
      icerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü...",
      tamIcerik: "Ay bugün tam daire şeklindeydi. Çok parlak ve büyüktü. Bulutlar arasında kaybolup tekrar görünüyordu. Deniz kenarından izlemek harikaydı.",
      not: "Fotoğraf çekmeyi unutma, tripod kullan",
      goruntulenme: 3,
      favori: false,
      duzenlemeTarihi: null
    },
    {
      id: 3,
      baslik: "🌓 İlk Dördün",
      tarih: "5 Ocak 2026",
      ayEvresi: "🌓",
      evreAdi: "İlk Dördün",
      icerik: "Ayın sağ yarısı aydınlıktı. Net bir şekilde görülüyordu...",
      tamIcerik: "Ayın sağ yarısı aydınlıktı. Net bir şekilde görülüyordu. Hava biraz bulutluydu ama ay görünüyordu. Teleskop ile kraterleri görebildim.",
      not: "Teleskop ile gözlem yapıldı, 100x büyütme",
      goruntulenme: 2,
      favori: true,
      duzenlemeTarihi: null
    }
  ];

  // LocalStorage'dan günlükleri al veya başlangıç verilerini kullan
  const [gunlukler, setGunlukler] = useState(() => {
    const saved = localStorage.getItem('gunlukVerileri');
    return saved ? JSON.parse(saved) : initialGunlukler;
  });

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('gunlukVerileri', JSON.stringify(gunlukler));
  }, [gunlukler]);

  const [filtre, setFiltre] = useState({
    arama: '',
    ayEvresi: 'tum',
    siralama: 'yeniden-eskive'
  });

  // DÜZELTME: Tek state'te tutuyoruz
  const [modalDurumu, setModalDurumu] = useState({
    goster: false,
    mod: 'detay', // 'detay' veya 'duzenle'
    seciliGunluk: null
  });

  const [duzenlemeVerisi, setDuzenlemeVerisi] = useState(null);

  // İstatistikleri dinamik hesapla
  const istatistikler = {
    toplamGunluk: gunlukler.length,
    goruntulenme: gunlukler.reduce((toplam, gunluk) => toplam + gunluk.goruntulenme, 0),
    enCokGoruntulenen: gunlukler.length > 0 ? 
      gunlukler.reduce((enCok, gunluk) => gunluk.goruntulenme > enCok.goruntulenme ? gunluk : enCok, gunlukler[0]) : 
      { baslik: "Henüz yok", goruntulenme: 0 },
    favoriSayisi: gunlukler.filter(g => g.favori).length,
    enSonGunluk: gunlukler.length > 0 ? gunlukler[0].tarih : "Henüz yok"
  };

  // Filtreleme
  const filtrelenmisGunlukler = gunlukler.filter(gunluk => {
    // Arama filtresi
    if (filtre.arama && !gunluk.baslik.toLowerCase().includes(filtre.arama.toLowerCase()) && 
        !gunluk.icerik.toLowerCase().includes(filtre.arama.toLowerCase()) &&
        !gunluk.not.toLowerCase().includes(filtre.arama.toLowerCase())) {
      return false;
    }
    
    // Ay evresi filtresi
    if (filtre.ayEvresi !== 'tum' && !gunluk.evreAdi.toLowerCase().includes(filtre.ayEvresi.toLowerCase())) {
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
    if (window.confirm('Bu günlüğü silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      const yeniGunlukler = gunlukler.filter(gunluk => gunluk.id !== id);
      setGunlukler(yeniGunlukler);
      setModalDurumu({ goster: false, mod: 'detay', seciliGunluk: null });
      alert('✅ Günlük başarıyla silindi!');
    }
  };

  // DETAY GÖSTER
  const handleDetayGoster = (gunluk) => {
    // Görüntülenme sayısını artır
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

  // DÜZENLEMEYE BAŞLA
  const handleDuzenlemeyeBasla = (gunluk) => {
    setDuzenlemeVerisi({ ...gunluk });
    setModalDurumu({
      goster: true,
      mod: 'duzenle',
      seciliGunluk: gunluk
    });
  };

  // DÜZENLEMEYİ KAYDET
  const handleDuzenlemeKaydet = () => {
    if (!duzenlemeVerisi.baslik.trim() || !duzenlemeVerisi.tamIcerik.trim()) {
      alert('Başlık ve içerik boş olamaz!');
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

  const handleFavoriDegistir = (id) => {
    const guncellenmisGunlukler = gunlukler.map(gunluk =>
      gunluk.id === id ? { ...gunluk, favori: !gunluk.favori } : gunluk
    );
    setGunlukler(guncellenmisGunlukler);
  };

  const handleYeniGunlukEkle = () => {
    const yeniGunluk = {
      id: Date.now(),
      baslik: "🌙 Yeni Ay Gözlemi",
      tarih: new Date().toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      ayEvresi: "🌙",
      evreAdi: "Hilal",
      icerik: "Bugünkü gözlem notlarınızı buraya yazın...",
      tamIcerik: "Bugünkü gözlem notlarınızı buraya detaylı şekilde yazın. Ayın görünümü nasıldı? Hava koşulları ne durumdaydı? Özel gözlemleriniz nelerdi?",
      not: "Ek notlarınızı buraya yazabilirsiniz",
      goruntulenme: 0,
      favori: false,
      duzenlemeTarihi: null
    };

    setGunlukler([yeniGunluk, ...gunlukler]);
    setDuzenlemeVerisi(yeniGunluk);
    setModalDurumu({
      goster: true,
      mod: 'duzenle',
      seciliGunluk: yeniGunluk
    });
    alert('🆕 Yeni günlük oluşturuldu! Şimdi düzenleyebilirsiniz.');
  };

  // DÜZENLEME MODAL İÇERİĞİ
  const renderDuzenlemeModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            ✏️ Günlük Düzenle
          </h3>
          <button
            onClick={handleModalKapat}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Başlık</label>
            <input
              type="text"
              value={duzenlemeVerisi?.baslik || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                baslik: e.target.value
              })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
          
          {/* Ay Evresi */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Ay Evresi</label>
            <div className="grid grid-cols-4 gap-2">
              {['🌙', '🌓', '🌕', '🌗'].map((evre) => (
                <button
                  key={evre}
                  type="button"
                  onClick={() => {
                    let evreAdi = "Hilal";
                    if (evre === '🌓') evreAdi = "İlk Dördün";
                    if (evre === '🌕') evreAdi = "Dolunay";
                    if (evre === '🌗') evreAdi = "Son Dördün";
                    
                    setDuzenlemeVerisi({
                      ...duzenlemeVerisi,
                      ayEvresi: evre,
                      evreAdi: evreAdi,
                      baslik: `${evre} ${duzenlemeVerisi.baslik.replace(/^[🌙🌓🌕🌗]\s*/, '')}`
                    });
                  }}
                  className={`p-4 text-2xl rounded-lg ${duzenlemeVerisi?.ayEvresi === evre ? 'bg-yellow-500/20 border-2 border-yellow-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  {evre}
                </button>
              ))}
            </div>
          </div>
          
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
          
          {/* Tam İçerik */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Gözlem İçeriği</label>
            <textarea
              value={duzenlemeVerisi?.tamIcerik || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                tamIcerik: e.target.value
              })}
              className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
            />
            <p className="text-gray-400 text-sm mt-1">
              Karakter sayısı: {(duzenlemeVerisi?.tamIcerik || '').length}
            </p>
          </div>
          
          {/* Not */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Ek Notlar</label>
            <textarea
              value={duzenlemeVerisi?.not || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                not: e.target.value
              })}
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
            />
          </div>
          
          {/* Favori */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favori"
              checked={duzenlemeVerisi?.favori || false}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                favori: e.target.checked
              })}
              className="w-5 h-5 mr-2"
            />
            <label htmlFor="favori" className="text-gray-300">
              Favorilere Ekle
            </label>
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
            {modalDurumu.seciliGunluk.ayEvresi} {modalDurumu.seciliGunluk.baslik}
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
            {modalDurumu.seciliGunluk.favori && (
              <span className="text-yellow-400">⭐ Favori</span>
            )}
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-bold mb-2">Günlük İçeriği</h4>
            <p className="text-gray-300 whitespace-pre-line">
              {modalDurumu.seciliGunluk.tamIcerik}
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-bold mb-2">Not</h4>
            <p className="text-gray-300">{modalDurumu.seciliGunluk.not}</p>
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
                  <p className="text-gray-400 text-sm">Son Günlük</p>
                  <p className="text-lg font-bold truncate">{istatistikler.enSonGunluk}</p>
                </div>
                <FaCalendarAlt className="text-2xl text-green-400" />
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
                <button
                  onClick={handleYeniGunlukEkle}
                  className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1 rounded"
                >
                  + Yeni Günlük
                </button>
              </div>
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
                  <option value="hilal">Hilal</option>
                  <option value="ilk">İlk Dördün</option>
                  <option value="dolunay">Dolunay</option>
                  <option value="son">Son Dördün</option>
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
                  <option value="goruntulenme">Görüntülenme</option>
                  <option value="favori">Favoriler</option>
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
                <span className="text-green-400">Düzenlenebilir Mod</span>
              </div>
            </div>
            
            {filtrelenmisGunlukler.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Günlük Bulunamadı</h3>
                <p className="text-gray-400">Filtrelerinizi değiştirmeyi deneyin veya yeni günlük oluşturun.</p>
                <button
                  onClick={handleYeniGunlukEkle}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600"
                >
                  + Yeni Günlük Oluştur
                </button>
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
                          <div className="flex items-center mb-1">
                            <button
                              onClick={() => handleFavoriDegistir(gunluk.id)}
                              className={`mr-2 text-xl ${gunluk.favori ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                            >
                              {gunluk.favori ? '★' : '☆'}
                            </button>
                            <h4 className="text-xl font-bold inline">
                              {gunluk.ayEvresi} {gunluk.baslik}
                            </h4>
                          </div>
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
                        <div className="mt-2 text-sm text-gray-500">
                          <strong>Not:</strong> {gunluk.not}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sağ: Butonlar */}
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

          {/* Bilgilendirme */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              💡 Kullanım Kılavuzu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>1. Detay Görüntüle:</strong> Detay butonuna tıkla
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>2. Düzenle:</strong> Detay ekranından Düzenle butonuna tıkla
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>3. Kaydet:</strong> Değişiklikleri yapıp Kaydet butonuna tıkla
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
            © 2026 Ay Günlüğü - Günlük Yönetimi
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Tüm günlükler tarayıcı belleğinizde saklanır. Düzenlemeler otomatik kaydedilir.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;