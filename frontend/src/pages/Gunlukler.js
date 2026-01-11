import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaSearch, FaFilter, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaEye, FaStar,
  FaSave, FaTimes, FaCheck, FaPlus
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Gunlukler() {
  // Başlangıç demo verileri
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
    }
  ];

  // LocalStorage'dan al
  const [gunlukler, setGunlukler] = useState(() => {
    const saved = localStorage.getItem('ayGunlukleriData');
    return saved ? JSON.parse(saved) : initialGunlukler;
  });

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('ayGunlukleriData', JSON.stringify(gunlukler));
  }, [gunlukler]);

  const [filtre, setFiltre] = useState({
    arama: '',
    ayEvresi: 'tum',
    siralama: 'yeniden-eskive'
  });

  // DÜZELTME: SADECE BİR GÜNLÜĞÜ DÜZENLE
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlemeForm, setDuzenlemeForm] = useState({
    baslik: '',
    tarih: '',
    ayEvresi: '',
    evreAdi: '',
    tamIcerik: '',
    not: ''
  });

  // İstatistikler
  const istatistikler = {
    toplamGunluk: gunlukler.length,
    goruntulenme: gunlukler.reduce((toplam, gunluk) => toplam + gunluk.goruntulenme, 0),
    favoriSayisi: gunlukler.filter(g => g.favori).length,
    sonGunluk: gunlukler.length > 0 ? gunlukler[0].tarih : "Henüz yok"
  };

  // Filtreleme
  const filtrelenmisGunlukler = gunlukler.filter(gunluk => {
    if (filtre.arama && !gunluk.baslik.toLowerCase().includes(filtre.arama.toLowerCase()) && 
        !gunluk.tamIcerik.toLowerCase().includes(filtre.arama.toLowerCase())) {
      return false;
    }
    
    if (filtre.ayEvresi !== 'tum' && !gunluk.evreAdi.toLowerCase().includes(filtre.ayEvresi.toLowerCase())) {
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

  // DÜZENLEMEYE BAŞLA
  const duzenlemeyeBasla = (gunluk) => {
    setDuzenlenenId(gunluk.id);
    setDuzenlemeForm({
      baslik: gunluk.baslik,
      tarih: gunluk.tarih,
      ayEvresi: gunluk.ayEvresi,
      evreAdi: gunluk.evreAdi,
      tamIcerik: gunluk.tamIcerik,
      not: gunluk.not
    });
  };

  // DÜZENLEMEYİ KAYDET
  const duzenlemeyiKaydet = () => {
    if (!duzenlemeForm.baslik.trim() || !duzenlemeForm.tamIcerik.trim()) {
      alert('Başlık ve içerik boş olamaz!');
      return;
    }

    const guncellenmisGunlukler = gunlukler.map(gunluk => {
      if (gunluk.id === duzenlenenId) {
        return {
          ...gunluk,
          baslik: duzenlemeForm.baslik,
          tarih: duzenlemeForm.tarih,
          ayEvresi: duzenlemeForm.ayEvresi,
          evreAdi: duzenlemeForm.evreAdi,
          tamIcerik: duzenlemeForm.tamIcerik,
          icerik: duzenlemeForm.tamIcerik.substring(0, 100) + '...',
          not: duzenlemeForm.not,
          duzenlemeTarihi: new Date().toLocaleString('tr-TR')
        };
      }
      return gunluk;
    });

    setGunlukler(guncellenmisGunlukler);
    setDuzenlenenId(null);
    alert('✅ Günlük başarıyla güncellendi!');
  };

  // DÜZENLEMEYİ İPTAL
  const duzenlemeyiIptal = () => {
    setDuzenlenenId(null);
    setDuzenlemeForm({
      baslik: '',
      tarih: '',
      ayEvresi: '',
      evreAdi: '',
      tamIcerik: '',
      not: ''
    });
  };

  // GÜNLÜK SİL
  const gunlukSil = (id) => {
    if (window.confirm('Bu günlüğü silmek istediğinize emin misiniz?')) {
      const yeniGunlukler = gunlukler.filter(gunluk => gunluk.id !== id);
      setGunlukler(yeniGunlukler);
      setDuzenlenenId(null);
      alert('🗑️ Günlük silindi!');
    }
  };

  // FAVORİ DEĞİŞTİR
  const favoriDegistir = (id) => {
    const guncellenmisGunlukler = gunlukler.map(gunluk =>
      gunluk.id === id ? { ...gunluk, favori: !gunluk.favori } : gunluk
    );
    setGunlukler(guncellenmisGunlukler);
  };

  // YENİ GÜNLÜK EKLE
  const yeniGunlukEkle = () => {
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
    duzenlemeyeBasla(yeniGunluk);
    alert('🆕 Yeni günlük oluşturuldu! Düzenleyebilirsiniz.');
  };

  // GÖRÜNTÜLENME ARTIR
  const goruntulenmeArtir = (id) => {
    const guncellenmisGunlukler = gunlukler.map(gunluk =>
      gunluk.id === id ? { ...gunluk, goruntulenme: gunluk.goruntulenme + 1 } : gunluk
    );
    setGunlukler(guncellenmisGunlukler);
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
          {/* İstatistikler */}
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
                  <p className="text-lg font-bold truncate">{istatistikler.sonGunluk}</p>
                </div>
                <FaCalendarAlt className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          {/* Kontroller */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold">Günlük Yönetimi</h2>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={yeniGunlukEkle}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Yeni Günlük
                </button>
                
                <Link
                  to="/YeniGunluk"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Yeni Gözlem Yaz
                </Link>
              </div>
            </div>
          </div>

          {/* DÜZENLEME FORMU - SADECE BİR GÜNLÜK İÇİN */}
          {duzenlenenId && (
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border-2 border-yellow-500/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-yellow-300">
                  ✏️ Günlük Düzenleme Modu
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={duzenlemeyiIptal}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                  >
                    <FaTimes className="mr-1" /> İptal
                  </button>
                  <button
                    onClick={duzenlemeyiKaydet}
                    className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center"
                  >
                    <FaSave className="mr-1" /> Kaydet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={duzenlemeForm.baslik}
                    onChange={(e) => setDuzenlemeForm({...duzenlemeForm, baslik: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Tarih</label>
                  <input
                    type="text"
                    value={duzenlemeForm.tarih}
                    onChange={(e) => setDuzenlemeForm({...duzenlemeForm, tarih: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Ay Evresi</label>
                  <div className="flex gap-2">
                    {['🌙', '🌓', '🌕', '🌗'].map((evre) => {
                      let evreAdi = "Hilal";
                      if (evre === '🌓') evreAdi = "İlk Dördün";
                      if (evre === '🌕') evreAdi = "Dolunay";
                      if (evre === '🌗') evreAdi = "Son Dördün";
                      
                      return (
                        <button
                          key={evre}
                          type="button"
                          onClick={() => setDuzenlemeForm({
                            ...duzenlemeForm,
                            ayEvresi: evre,
                            evreAdi: evreAdi
                          })}
                          className={`p-3 text-xl rounded-lg ${duzenlemeForm.ayEvresi === evre ? 'bg-yellow-500/30 border-2 border-yellow-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                        >
                          {evre}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Seçili: {duzenlemeForm.evreAdi}</label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Gözlem İçeriği</label>
                <textarea
                  value={duzenlemeForm.tamIcerik}
                  onChange={(e) => setDuzenlemeForm({...duzenlemeForm, tamIcerik: e.target.value})}
                  className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Ek Notlar</label>
                <textarea
                  value={duzenlemeForm.not}
                  onChange={(e) => setDuzenlemeForm({...duzenlemeForm, not: e.target.value})}
                  className="w-full h-20 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* Günlük Listesi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Tüm Günlükler ({filtrelenmisGunlukler.length})
              </h3>
              <div className="text-sm text-gray-400">
                <span className="text-green-400">📍 LocalStorage'da kayıtlı</span>
              </div>
            </div>

            {filtrelenmisGunlukler.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Günlük Bulunamadı</h3>
                <p className="text-gray-400 mb-4">Henüz günlük yazmamışsınız.</p>
                <button
                  onClick={yeniGunlukEkle}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600"
                >
                  İlk Günlüğünü Yaz
                </button>
              </div>
            ) : (
              filtrelenmisGunlukler.map((gunluk) => (
                <div 
                  key={gunluk.id} 
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                    duzenlenenId === gunluk.id ? 'border-yellow-500' : 'border-gray-700 hover:border-blue-700/50'
                  }`}
                >
                  {duzenlenenId === gunluk.id ? (
                    /* Düzenleme Modunda Görünüm */
                    <div className="text-center py-8">
                      <div className="text-4xl text-yellow-400 mb-4">✏️</div>
                      <h4 className="text-xl font-bold text-yellow-300 mb-2">
                        Bu günlük düzenleme modunda
                      </h4>
                      <p className="text-gray-300">
                        Yukarıdaki formdan düzenleyebilirsiniz
                      </p>
                    </div>
                  ) : (
                    /* Normal Görünüm */
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Günlük Bilgisi */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <button
                                onClick={() => favoriDegistir(gunluk.id)}
                                className={`mr-2 text-xl ${gunluk.favori ? 'text-yellow-400' : 'text-gray-500'}`}
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
                          {gunluk.duzenlemeTarihi && (
                            <div className="mt-2 text-xs text-yellow-500">
                              ✏️ Son düzenleme: {gunluk.duzenlemeTarihi}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Butonlar */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            goruntulenmeArtir(gunluk.id);
                            alert(`📖 Günlük içeriği:\n\n${gunluk.tamIcerik}\n\nNot: ${gunluk.not}`);
                          }}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          <FaEye className="mr-2" />
                          İçeriği Gör
                        </button>
                        <button
                          onClick={() => duzenlemeyeBasla(gunluk)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all"
                        >
                          <FaEdit className="mr-2" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => gunlukSil(gunluk.id)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                        >
                          <FaTrash className="mr-2" />
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Firebase Bilgilendirme */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🔥 Firebase'e Geçiş Hazırlığı
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-300">
                  <strong>📍 Şu An:</strong> LocalStorage kullanılıyor
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  • Veriler tarayıcı belleğinde<br/>
                  • Sadece bu cihazda görünür<br/>
                  • Tarayıcı temizlenirse silinir
                </p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-300">
                  <strong>🎯 Hedef:</strong> Firebase ile gerçek veritabanı
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  • Tüm cihazlardan erişilebilir<br/>
                  • Veriler kalıcı olarak saklanır<br/>
                  • Gerçek öğrenci verileri yüklenir
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
            Bu sayfada günlüklerinizi düzenleyebilir, silebilir ve yeni günlükler oluşturabilirsiniz.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;