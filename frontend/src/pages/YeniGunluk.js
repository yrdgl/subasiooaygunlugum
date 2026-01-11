import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaCamera, 
  FaArrowLeft, FaSave, FaImage 
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function YeniGunluk() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL'den tarih parametresini almak için
  const getUrlDate = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('date');
  };
  
  // Bugünün tarihini 2026 yılına göre ayarlayalım
  const getTodayDate = () => {
    const urlDate = getUrlDate();
    
    // Eğer URL'de tarih varsa onu kullan
    if (urlDate) {
      return urlDate;
    }
    
    // Yoksa bugünün tarihini 2026 yılına ayarla
    const today = new Date();
    today.setFullYear(2026);
    return today.toISOString().split('T')[0];
  };
  
  // Tarihi "15 Ocak 2026" formatında göstermek için
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  };

  const [formData, setFormData] = useState({
    tarih: getTodayDate(),
    ayEvresi: '',
    gozlem: '',
    havaDurumu: 'gunesli',
    notlar: ''
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [karakterSayisi, setKarakterSayisi] = useState(0);

  // URL'de tarih değiştiğinde formu güncelle
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
    { emoji: '🌒', ad: 'Hilal (İlk)', deger: 'hilal-ilk' },
    { emoji: '🌓', ad: 'İlk Dördün', deger: 'ilk-dordun' },
    { emoji: '🌔', ad: 'Şişkin Ay', deger: 'siskin' },
    { emoji: '🌕', ad: 'Dolunay', deger: 'dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay (Son)', deger: 'siskin-son' },
    { emoji: '🌗', ad: 'Son Dördün', deger: 'son-dordun' },
    { emoji: '🌘', ad: 'Hilal (Son)', deger: 'hilal-son' },
    { emoji: '🌙', ad: 'Ay Gözükmüyor', deger: 'goktuk' }
  ];

  const havaDurumlari = [
    { emoji: '☀️', ad: 'Güneşli', deger: 'gunesli' },
    { emoji: '⛅', ad: 'Parçalı Bulutlu', deger: 'parcali-bulutlu' },
    { emoji: '☁️', ad: 'Bulutlu', deger: 'bulutlu' },
    { emoji: '🌧️', ad: 'Yağmurlu', deger: 'yagmurlu' },
    { emoji: '⛈️', ad: 'Fırtınalı', deger: 'firtinali' },
    { emoji: '❄️', ad: 'Karlı', deger: 'karli' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Karakter sayısını güncelle
    if (name === 'gozlem') {
      setKarakterSayisi(value.length);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }
      
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFotoKaldir = () => {
    setFoto(null);
    setFotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasyonlar
    if (!formData.ayEvresi) {
      alert('Lütfen ayın evresini seçin!');
      return;
    }
    
    if (!formData.gozlem.trim()) {
      alert('Lütfen gözlem notlarınızı yazın!');
      return;
    }
    
    if (formData.gozlem.length < 50) {
      alert('Gözlem notlarınız en az 50 karakter olmalıdır!');
      return;
    }
    
    // Günlük verisini hazırla
    const gunlukVerisi = {
      ...formData,
      tarih: formatDisplayDate(formData.tarih), // Tarihi formatla
      id: Date.now(), // Geçici ID
      olusturmaTarihi: new Date().toISOString(),
      foto: foto ? foto.name : null
    };
    
    console.log('Günlük verisi:', gunlukVerisi);
    console.log('Fotoğraf:', foto ? foto.name : 'Yok');
    
    // LocalStorage'a kaydet (demo için)
    const mevcutGunlukler = JSON.parse(localStorage.getItem('ayGunlukleri') || '[]');
    mevcutGunlukler.unshift(gunlukVerisi);
    localStorage.setItem('ayGunlukleri', JSON.stringify(mevcutGunlukler));
    
    alert(`✅ Günlük başarıyla kaydedildi!\nTarih: ${formatDisplayDate(formData.tarih)}\nAy Evresi: ${ayEvreleri.find(e => e.deger === formData.ayEvresi)?.ad}`);
    
    // Dashboard'a yönlendir
    setTimeout(() => {
      navigate('/OgrenciDashboard');
    }, 1500);
  };

  const handleDemoDoldur = () => {
    const bugun = new Date();
    bugun.setFullYear(2026); // 2026 yılına ayarla
    
    const secilenAyEvresi = 'dolunay';
    const secilenAyEvresiAd = ayEvreleri.find(e => e.deger === secilenAyEvresi)?.ad || 'Dolunay';
    
    setFormData({
      tarih: bugun.toISOString().split('T')[0],
      ayEvresi: secilenAyEvresi,
      gozlem: `${formatDisplayDate(bugun.toISOString().split('T')[0])} tarihinde ayı gözlemledim. Ay ${secilenAyEvresiAd} evresindeydi ve inanılmaz parlaktı. Gökyüzü tamamen açıktı, yıldızlar da net görünüyordu. Ayın yüzeyindeki kraterleri bile ayırt edebiliyordum. Etrafında hafif bir hale oluşmuştu ve bu görüntü gerçekten büyüleyiciydi.`,
      havaDurumu: 'gunesli',
      notlar: 'Gözlemimi 20:00-21:00 saatleri arasında yaptım. Yanımda küçük bir teleskop vardı ve bu sayede ay yüzeyini detaylı inceleme fırsatım oldu. Deniz kenarında olduğum için ayın su üzerindeki yansıması da harikaydı.'
    });
    
    setKarakterSayisi(450); // Demo metin karakter sayısı
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

                  {/* Hava Durumu */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">
                      ⛅ Hava Durumu
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {havaDurumlari.map((hava) => (
                        <button
                          key={hava.deger}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, havaDurumu: hava.deger }))}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${formData.havaDurumu === hava.deger ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'}`}
                        >
                          <span className="text-2xl mb-1">{hava.emoji}</span>
                          <span className="text-xs text-gray-300">{hava.ad}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gözlem */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-300 text-lg font-semibold flex items-center">
                        📝 Gözlem Notların
                      </label>
                      <div className={`text-sm ${karakterSayisi >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {karakterSayisi}/50 karakter
                      </div>
                    </div>
                    <textarea
                      name="gozlem"
                      value={formData.gozlem}
                      onChange={handleChange}
                      className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder={`Örnek: "${formatDisplayDate(formData.tarih)} tarihinde ayı gözlemledim. Ay ... evresindeydi. Gökyüzü ...`}
                      required
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-400 text-sm">
                        {karakterSayisi >= 50 ? '✅ Yeterli karakter sayısı' : '⚠️ En az 50 karakter gerekli'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gozlem: '' }))}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>

                  {/* Ek Notlar */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">
                      💭 Ek Notlar (Opsiyonel)
                    </label>
                    <textarea
                      name="notlar"
                      value={formData.notlar}
                      onChange={handleChange}
                      className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder="Eklemek istediğin başka şeyler var mı? Teleskop kullandın mı? Hangi saatte gözlem yaptın? vs..."
                    />
                  </div>

                  {/* Fotoğraf */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold flex items-center">
                      <FaCamera className="mr-2 text-purple-400" />
                      Fotoğraf Ekle (Opsiyonel)
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors">
                      {fotoPreview ? (
                        <div className="space-y-4">
                          <div className="relative mx-auto max-w-md">
                            <img 
                              src={fotoPreview} 
                              alt="Önizleme" 
                              className="rounded-lg w-full h-48 object-cover"
                            />
                            <button
                              type="button"
                              onClick={handleFotoKaldir}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 hover:scale-110 transition-transform"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-gray-300">{foto.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-5xl text-gray-500">
                            <FaImage />
                          </div>
                          <p className="text-gray-400">Ay fotoğrafını buraya sürükle veya tıkla</p>
                          <label className="inline-block px-6 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-300 font-semibold rounded-lg hover:from-purple-900/70 hover:to-blue-900/70 transition-colors border border-purple-700/50 cursor-pointer transform hover:scale-105">
                            <FaCamera className="inline mr-2" />
                            📸 Fotoğraf Seç
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFotoChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Maksimum 5MB, JPG veya PNG formatında.
                    </p>
                  </div>

                  {/* Demo ve Kaydet Butonları */}
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleDemoDoldur}
                      className="w-full py-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 text-green-300 font-semibold rounded-lg hover:from-green-900/70 hover:to-blue-900/70 transition-colors border border-green-700/50 transform hover:scale-[1.02]"
                    >
                      📋 2026 Demo Bilgilerini Doldur
                    </button>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!formData.ayEvresi || karakterSayisi < 50}
                        className={`w-full py-4 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 text-lg ${!formData.ayEvresi || karakterSayisi < 50 ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'}`}
                      >
                        <FaSave className="inline mr-2" />
                        {!formData.ayEvresi || karakterSayisi < 50 ? '❌ Eksik Bilgi Var' : '✅ GÜNLÜĞÜ KAYDET'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Yardım ve Bilgi */}
            <div className="space-y-6">
              {/* 2026 Yılı Bilgisi */}
              <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  🎯 2026 Yılı Ay Gözlemleri
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Bu yıl (2026) yaptığınız tüm ay gözlemlerini kaydediyorsunuz.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>📅 Tarih aralığı: 01 Ocak - 31 Aralık 2026</p>
                  <p>📊 Hedef: 365 günlük tam bir gözlem kaydı!</p>
                  <p>🏆 Ödül: Tüm yıl gözlem tamamlama rozeti</p>
                </div>
              </div>

              {/* İpuçları */}
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

              {/* Örnek Gözlem */}
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  📝 Örnek Gözlem (2026)
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 italic text-sm">
                    "15 Ocak 2026 tarihinde ayı gözlemledim. Ay Dolunay evresindeydi ve inanılmaz parlaktı. Gökyüzü tamamen açıktı, yıldızlar da net görünüyordu..."
                  </p>
                </div>
              </div>

              {/* Ay Evreleri Bilgisi */}
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  🌘 2026 Ay Evreleri
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="mb-1">
                    <p className="text-xs text-gray-400 mb-1">BÜYÜME EVRESİ</p>
                    <p><span className="text-xl">🌑</span> <strong>Yeni Ay:</strong> Ay görünmez</p>
                    <p><span className="text-xl">🌘</span> <strong>Hilal (İnce):</strong> İnce hilal</p>
                    <p><span className="text-xl">🌒</span> <strong>Hilal (Şişkin):</strong> Büyüyen hilal</p>
                    <p><span className="text-xl">🌓</span> <strong>İlk Dördün:</strong> Yarım ay</p>
                    <p><span className="text-xl">🌔</span> <strong>Şişkin Ay:</strong> Dolunay'a yakın</p>
                    <p><span className="text-xl">🌕</span> <strong>Dolunay:</strong> Tam daire</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">KÜÇÜLME EVRESİ</p>
                    <p><span className="text-xl">🌖</span> <strong>Küçülen Dolunay:</strong> Dolunay'dan sonra</p>
                    <p><span className="text-xl">🌗</span> <strong>Son Dördün:</strong> Yarım ay</p>
                    <p><span className="text-xl">🌘</span> <strong>Hilal (Küçülen):</strong> Küçülen hilal</p>
                  </div>
                </div>
              </div>

              {/* Kaydetme İşlemi */}
              <div className="bg-red-900/30 rounded-xl p-6 border border-red-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  💾 Kaydetme İşlemi
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>1️⃣ Tarih seç (2026)</p>
                  <p>2️⃣ Ay evresi seç</p>
                  <p>3️⃣ Gözlem yaz (min. 50 karakter)</p>
                  <p>4️⃣ Foto ekle (isteğe bağlı)</p>
                  <p>5️⃣ Kaydet butonuna tıkla</p>
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
          <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-600">
            <span>📅 Tarih: {formatDisplayDate(formData.tarih)}</span>
            <span>|</span>
            <span>🌕 Ay Evresi: {formData.ayEvresi ? ayEvreleri.find(e => e.deger === formData.ayEvresi)?.ad : 'Seçilmedi'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default YeniGunluk;