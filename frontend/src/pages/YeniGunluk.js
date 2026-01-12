import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaCalendarAlt, 
  FaArrowLeft, FaSave 
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function YeniGunluk() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getUrlDate = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('date');
  };
  
  const getTodayDate = () => {
    const urlDate = getUrlDate();
    
    if (urlDate) {
      return urlDate;
    }
    
    const today = new Date();
    today.setFullYear(2026);
    return today.toISOString().split('T')[0];
  };
  
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  };

  const [formData, setFormData] = useState({
    tarih: getTodayDate(),
    ayEvresi: '',
    gozlem: ''
  });

  const [karakterSayisi, setKarakterSayisi] = useState(0);

  useEffect(() => {
    const urlDate = getUrlDate();
    if (urlDate) {
      setFormData(prev => ({
        ...prev,
        tarih: urlDate
      }));
    }
  }, [location]);

  const ayEvreleri = [
    { emoji: '🌑', ad: 'Yeni Ay', deger: 'yeni' },
    { emoji: '🌒', ad: 'Hilal', deger: 'hilal' },
    { emoji: '🌓', ad: 'İlk Dördün', deger: 'ilk-dordun' },
    { emoji: '🌔', ad: 'Şişkin Ay', deger: 'siskin' },
    { emoji: '🌕', ad: 'Dolunay', deger: 'dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay', deger: 'siskin-son' },
    { emoji: '🌗', ad: 'Son Dördün', deger: 'son-dordun' },
    { emoji: '🌘', ad: 'Hilal', deger: 'hilal-son' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'gozlem') {
      setKarakterSayisi(value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.ayEvresi) {
      alert("❌ Lütfen ayın evresini seçin!");
      return;
    }
    
    const secilenAyEvresi = ayEvreleri.find(e => e.deger === formData.ayEvresi);
    
    const gunlukVerisi = {
      id: Date.now(),
      tarih: formatDisplayDate(formData.tarih),
      ayEvresi: secilenAyEvresi?.emoji || '🌑',
      ayEvresiAd: secilenAyEvresi?.ad || 'Yeni Ay',
      icerik: formData.gozlem && formData.gozlem.length > 100 
        ? formData.gozlem.substring(0, 100) + '...' 
        : formData.gozlem || 'Gözlem notu eklenmedi',
      tamIcerik: formData.gozlem || '',
      goruntulenme: 0,
      duzenlemeTarihi: null,
      olusturmaTarihi: new Date().toLocaleString('tr-TR'),
      // Yıldız alanları eklendi
      ogretmenYildizi: null,
      ogretmenYorumu: null,
      yildizVerilmeTarihi: null
    };
    
    const mevcutGunlukler = JSON.parse(localStorage.getItem('gunlukVerileri') || '[]');
    mevcutGunlukler.unshift(gunlukVerisi);
    localStorage.setItem('gunlukVerileri', JSON.stringify(mevcutGunlukler));
    
    alert(`✅ Günlük başarıyla kaydedildi!\nTarih: ${formatDisplayDate(formData.tarih)}\nAy Evresi: ${secilenAyEvresi?.ad}`);
    
    // DÜZELTME BURADA: Gunlukler'e değil, OgrenciDashboard'a yönlendir
    navigate('/OgrenciDashboard');
  };

  const handleDemoDoldur = () => {
    const bugun = new Date();
    bugun.setFullYear(2026);
    
    const secilenAyEvresi = 'dolunay';
    const secilenAyEvresiAd = ayEvreleri.find(e => e.deger === secilenAyEvresi)?.ad || 'Dolunay';
    
    setFormData({
      tarih: bugun.toISOString().split('T')[0],
      ayEvresi: secilenAyEvresi,
      gozlem: `${formatDisplayDate(bugun.toISOString().split('T')[0])} tarihinde ayı gözlemledim. Ay ${secilenAyEvresiAd} evresindeydi ve inanılmaz parlaktı.`
    });
    
    setKarakterSayisi(120);
    
    alert("Demo bilgileri yüklendi. Kaydetmek için 'GÜNLÜĞÜ KAYDET' butonuna tıklayın.");
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
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="text-6xl animate-pulse">🌙</div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              2026 Yılı - Yeni Ay Gözlemi
            </h1>
            <p className="text-gray-300">
              Tarih: <span className="text-yellow-300 font-semibold">{formatDisplayDate(formData.tarih)}</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sol: Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Tarih */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-yellow-400" />
                      Gözlem Tarihi (2026)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="date"
                        name="tarih"
                        value={formData.tarih}
                        onChange={handleChange}
                        min="2026-01-01"
                        max="2026-12-31"
                        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        required
                      />
                      <div className="text-sm text-gray-400 bg-gray-900/50 px-3 py-2 rounded-lg">
                        📅 2026 Yılı
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Seçili tarih: <span className="text-yellow-300">{formatDisplayDate(formData.tarih)}</span>
                    </p>
                  </div>

                  {/* Ay Evresi */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">
                      🌕 Ayın Evresi
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {ayEvreleri.map((evre) => (
                        <button
                          key={evre.deger}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, ayEvresi: evre.deger }))}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${formData.ayEvresi === evre.deger ? 'border-yellow-500 bg-yellow-500/10 scale-105' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'}`}
                        >
                          <span className="text-3xl mb-2">{evre.emoji}</span>
                          <span className="text-xs text-gray-300">{evre.ad}</span>
                        </button>
                      ))}
                    </div>
                    {formData.ayEvresi && (
                      <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-gray-300">
                          Seçilen: <span className="text-yellow-300 font-semibold">
                            {ayEvreleri.find(e => e.deger === formData.ayEvresi)?.emoji} {ayEvreleri.find(e => e.deger === formData.ayEvresi)?.ad}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Gözlem */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-300 text-lg font-semibold flex items-center">
                        📝 Gözlem Notların (Opsiyonel)
                      </label>
                      <div className={`text-sm ${karakterSayisi > 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                        {karakterSayisi} karakter
                      </div>
                    </div>
                    <textarea
                      name="gozlem"
                      value={formData.gozlem}
                      onChange={handleChange}
                      className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder="Gözlem notlarınızı yazın (zorunlu değil)..."
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-400 text-sm">
                        Not yazmak istemezseniz boş bırakabilirsiniz
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, gozlem: '' }));
                          setKarakterSayisi(0);
                          alert("Gözlem notları temizlendi.");
                        }}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>

                  {/* Demo ve Kaydet Butonları */}
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleDemoDoldur}
                      className="w-full py-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 text-green-300 font-semibold rounded-lg hover:from-green-900/70 hover:to-blue-900/70 transition-colors border border-green-700/50 transform hover:scale-[1.02]"
                    >
                      📋 Demo Bilgilerini Doldur
                    </button>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!formData.ayEvresi}
                        className={`w-full py-4 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 text-lg ${!formData.ayEvresi ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'}`}
                      >
                        <FaSave className="inline mr-2" />
                        {!formData.ayEvresi ? '❌ Ay Evresi Seçilmedi' : '✅ GÜNLÜĞÜ KAYDET'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Yardım ve Bilgi */}
            <div className="space-y-6">
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  💡 İpuçları
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span className="text-sm">Ayı net görebildin mi?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span className="text-sm">Parlaklığı nasıldı?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span className="text-sm">Bulutlar görüşü engelledi mi?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span className="text-sm">Hangi renkte göründü?</span>
                  </li>
                </ul>
              </div>
              
              {/* Yıldız Bilgisi */}
              <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  ⭐ Yıldız Kazanma
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Günlüğünü kaydettikten sonra öğretmenin günlüğünü okuyacak ve yıldız verecek.
                </p>
                <div className="text-center">
                  <div className="inline-flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">1-5 arası yıldız alabilirsin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Ay Günlüğü - Yeni Gözlem Kaydı
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Her akşam gökyüzüne bak ve 2026 yılı ay gözlemlerini kaydet!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default YeniGunluk;