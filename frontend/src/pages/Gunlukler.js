import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaSearch, FaFilter,
  FaArrowLeft, FaEye, FaTrash, FaEdit, FaPlus, FaDatabase
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Gunlukler() {
  const navigate = useNavigate();
  
  const [gunlukler, setGunlukler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreler, setFiltreler] = useState({
    arama: '',
    ayEvresi: '',
    baslangicTarihi: '',
    bitisTarihi: ''
  });
  const [siralama, setSiralama] = useState('yeniden-eskiye');
  const [dataSource, setDataSource] = useState('localStorage'); // 'demo' veya 'localStorage'

  // localStorage'dan günlükleri yükle
  useEffect(() => {
    const loadGunlukler = () => {
      setLoading(true);
      
      try {
        // localStorage'dan günlükleri al
        const storedGunlukler = JSON.parse(localStorage.getItem('ayGunlukleri') || '[]');
        
        if (storedGunlukler.length > 0) {
          setGunlukler(storedGunlukler);
          setDataSource('localStorage');
        } else {
          // Eğer localStorage'da veri yoksa demo verileri göster
          const demoGunlukler = getDemoGunlukler();
          setGunlukler(demoGunlukler);
          setDataSource('demo');
        }
      } catch (error) {
        console.error('Günlükler yüklenirken hata:', error);
        // Hata durumunda demo verileri göster
        setGunlukler(getDemoGunlukler());
        setDataSource('demo');
      } finally {
        setLoading(false);
      }
    };

    loadGunlukler();
    
    // LocalStorage değişikliklerini dinle
    const handleStorageChange = () => {
      loadGunlukler();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Demo günlük verileri - localStorage'da veri yoksa gösterilecek
  const getDemoGunlukler = () => {
    return [
      {
        id: 1,
        tarih: "15 Ocak 2026",
        ayEvresi: "🌕 Dolunay",
        havaDurumu: "☀️ Güneşli",
        gozlem: "Ay bu gece çok parlaktı. Gökyüzü tamamen açıktı. Kraterleri net görebiliyordum.",
        notlar: "Teleskopla izledim, harikaydı!"
      },
      {
        id: 2,
        tarih: "14 Ocak 2026",
        ayEvresi: "🌔 Şişkin Ay",
        havaDurumu: "⛅ Parçalı Bulutlu",
        gozlem: "Ay bulutlar arasında kaybolup çıkıyordu. Biraz puslu görünüyordu.",
        notlar: ""
      }
    ];
  };

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
      // LocalStorage'dan sil
      const mevcutGunlukler = JSON.parse(localStorage.getItem('ayGunlukleri') || '[]');
      const yeniGunlukler = mevcutGunlukler.filter(gunluk => gunluk.id !== id);
      localStorage.setItem('ayGunlukleri', JSON.stringify(yeniGunlukler));
      
      // State'i güncelle
      setGunlukler(yeniGunlukler);
      
      // Eğer tüm günlükler silindiyse demo verilere geç
      if (yeniGunlukler.length === 0) {
        setGunlukler(getDemoGunlukler());
        setDataSource('demo');
      }
      
      alert(`Günlük silindi! (ID: ${id})`);
    }
  };

  const handleGunlukDuzenle = (id) => {
    alert(`Günlük düzenleme sayfası yakında eklenecek! (ID: ${id})`);
  };

  const handleGunlukDetay = (id) => {
    navigate(`/GunlukDetay/${id}`);
  };

  const handleYeniGunluk = () => {
    navigate('/YeniGunluk');
  };

  // Tarih formatını düzeltme fonksiyonu
  const tarihSiralama = (tarihString) => {
    // "10 Ocak 2026" -> "2026-01-10"
    const parts = tarihString.split(' ');
    const gun = parseInt(parts[0]);
    const ay = parts[1];
    const yil = parseInt(parts[2]);
    
    const aylar = {
      'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04',
      'Mayıs': '05', 'Haziran': '06', 'Temmuz': '07', 'Ağustos': '08',
      'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12'
    };
    
    return `${yil}-${aylar[ay]}-${gun.toString().padStart(2, '0')}`;
  };

  // Filtreleme ve sıralama işlemi
  const filtrelenmisGunlukler = gunlukler
    .filter(gunluk => {
      // Arama filtresi
      if (filtreler.arama && 
          !gunluk.gozlem.toLowerCase().includes(filtreler.arama.toLowerCase()) &&
          !gunluk.notlar.toLowerCase().includes(filtreler.arama.toLowerCase())) {
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
      const tarihA = new Date(tarihSiralama(a.tarih));
      const tarihB = new Date(tarihSiralama(b.tarih));
      
      if (siralama === 'yeniden-eskiye') {
        return tarihB - tarihA; // Yeniden eskiye
      } else {
        return tarihA - tarihB; // Eskiden yeniye
      }
    });

  const toplamGunluk = gunlukler.length;
  const goruntulenenGunluk = filtrelenmisGunlukler.length;

  // En çok yazılan ay evresini bul
  const enCokAyEvresi = () => {
    const evreler = {};
    gunlukler.forEach(gunluk => {
      const evre = gunluk.ayEvresi.split(' ')[1] || gunluk.ayEvresi;
      evreler[evre] = (evreler[evre] || 0) + 1;
    });
    
    const enCok = Object.entries(evreler)
      .sort((a, b) => b[1] - a[1])[0];
    
    return enCok ? enCok[0] : 'Henüz yok';
  };

  // LocalStorage'ı temizle (demo için)
  const handleLocalStorageTemizle = () => {
    if (window.confirm('Tüm kayıtlı günlükleri silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      localStorage.removeItem('ayGunlukleri');
      setGunlukler(getDemoGunlukler());
      setDataSource('demo');
      alert('Tüm günlükler silindi! Demo veriler gösteriliyor.');
    }
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
                Ay Günlüğü - 2026
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleYeniGunluk}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
              >
                <FaPlus className="mr-2" />
                Yeni Günlük
              </button>
              
              <Link 
                to="/OgrenciDashboard" 
                className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
              >
                <FaArrowLeft className="mr-2" />
                Dashboard
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  📚 Geçmiş Günlüklerim
                </h1>
                <p className="text-gray-300">
                  {dataSource === 'localStorage' 
                    ? 'Kayıtlı günlükleriniz' 
                    : 'Demo günlükler (henüz kayıt yok)'}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-lg">
                  <span className="text-gray-300">Toplam:</span>
                  <span className="font-bold text-white text-2xl">{toplamGunluk}</span>
                  <span className="text-gray-300">günlük</span>
                </div>
                
                {dataSource === 'localStorage' && (
                  <button
                    onClick={handleLocalStorageTemizle}
                    className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-lg hover:bg-red-900/70"
                    title="Tüm kayıtlı günlükleri sil"
                  >
                    <FaDatabase className="inline mr-1" />
                    Temizle
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className={`rounded-lg px-4 py-2 ${dataSource === 'localStorage' ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
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
                  En Çok: <span className="font-bold text-white">{enCokAyEvresi()}</span>
                </p>
              </div>
              <div className="bg-yellow-900/30 rounded-lg px-4 py-2">
                <p className="text-gray-300">
                  Kaynak: <span className="font-bold text-white">
                    {dataSource === 'localStorage' ? 'Kayıtlı Veriler' : 'Demo Veriler'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Veri Kaynağı Bilgisi */}
          {dataSource === 'demo' && (
            <div className="mb-6 bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/50">
              <div className="flex items-center">
                <FaDatabase className="text-yellow-400 mr-3" />
                <div>
                  <p className="text-yellow-200 font-semibold">Demo Modunda Görüntüleniyor</p>
                  <p className="text-gray-300 text-sm">
                    Henüz kayıtlı günlüğünüz yok. "Yeni Günlük" butonuna tıklayarak ilk günlüğünüzü yazın!
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  placeholder="Gözlem veya notlarda ara..."
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

          {/* Yükleniyor */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
              <p className="text-gray-300">Günlükler yükleniyor...</p>
            </div>
          )}

          {/* Günlük Listesi */}
          {!loading && (
            <div className="space-y-6">
              {filtrelenmisGunlukler.length > 0 ? (
                filtrelenmisGunlukler.map((gunluk) => (
                  <div 
                    key={gunluk.id} 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Sol: Bilgiler */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-4xl group-hover:scale-110 transition-transform">{gunluk.ayEvresi.split(' ')[0]}</span>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {gunluk.ayEvresi}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400 mt-1">
                              <span className="flex items-center">
                                <FaCalendarAlt className="mr-2" />
                                {gunluk.tarih}
                              </span>
                              <span className="flex items-center">
                                {gunluk.havaDurumu}
                              </span>
                              <span className="text-sm bg-gray-900/50 px-2 py-1 rounded">
                                ID: {gunluk.id}
                              </span>
                              {dataSource === 'localStorage' && (
                                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                                  ✅ Kayıtlı
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 line-clamp-2 mb-3">
                          "{gunluk.gozlem}"
                        </p>
                        
                        {gunluk.notlar && (
                          <div className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-yellow-500/50">
                            <p className="text-gray-400">
                              <strong>📝 Not:</strong> {gunluk.notlar}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Sağ: Butonlar */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleGunlukDetay(gunluk.id)}
                          className="flex items-center justify-center px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-colors hover:scale-105"
                        >
                          <FaEye className="mr-2" />
                          Detay
                        </button>
                        <button
                          onClick={() => handleGunlukDuzenle(gunluk.id)}
                          className="flex items-center justify-center px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded-lg hover:bg-yellow-900/70 transition-colors hover:scale-105"
                        >
                          <FaEdit className="mr-2" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleGunlukSil(gunluk.id)}
                          className="flex items-center justify-center px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900/70 transition-colors hover:scale-105"
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
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Günlük Bulunamadı
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    {dataSource === 'localStorage' 
                      ? 'Filtrelere uygun günlük bulunamadı.' 
                      : 'Henüz günlük yazmadınız. İlk günlüğünüzü yazmaya ne dersiniz?'}
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setFiltreler({ arama: '', ayEvresi: '', baslangicTarihi: '', bitisTarihi: '' })}
                      className="px-6 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 font-semibold rounded-lg hover:from-blue-900/70 hover:to-purple-900/70 transition-colors border border-blue-700/50 hover:scale-105"
                    >
                      Filtreleri Temizle
                    </button>
                    <button
                      onClick={handleYeniGunluk}
                      className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors hover:scale-105"
                    >
                      {dataSource === 'localStorage' ? 'Yeni Günlük Yaz' : 'İlk Günlüğü Yaz'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sayfalama Bilgisi */}
          {!loading && filtrelenmisGunlukler.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-300 mb-4 md:mb-0">
                {goruntulenenGunluk} günlük görüntüleniyor
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">
                  📄 {dataSource === 'localStorage' ? 'Kayıtlı veriler gösteriliyor' : 'Demo veriler gösteriliyor'}
                </p>
              </div>
            </div>
          )}

          {/* Demo Mod Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {dataSource === 'localStorage' ? '💾 Kayıtlı Günlükler' : '🎯 Demo Modu'}
              </h3>
              <span className="ml-3 px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded">
                2026 YILI
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              {dataSource === 'localStorage' 
                ? `Şu anda ${toplamGunluk} kayıtlı günlüğünüzü görüntülüyorsunuz.`
                : 'Henüz kayıtlı günlüğünüz yok. Yeni günlük yazarak başlayabilirsiniz.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>📅 Yıl:</strong> 2026
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>🔍 Veri Kaynağı:</strong> {dataSource === 'localStorage' ? 'LocalStorage' : 'Demo'}
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>⚡ Durum:</strong> {loading ? 'Yükleniyor...' : 'Hazır'}
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
            © 2026 Ay Günlüğü - Geçmiş Günlükler
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {dataSource === 'localStorage' 
              ? 'Kayıtlı günlükleriniz burada saklanır.' 
              : 'İlk günlüğünüzü yazmaya başlayın!'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;