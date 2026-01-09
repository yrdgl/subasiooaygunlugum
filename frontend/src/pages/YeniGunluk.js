import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaCamera, 
  FaArrowLeft, FaSave, FaImage 
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function YeniGunluk() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split('T')[0],
    ayEvresi: '',
    gozlem: '',
    havaDurumu: 'gunesli',
    notlar: ''
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

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
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    
    if (!formData.ayEvresi) {
      alert('Lütfen ayın evresini seçin!');
      return;
    }
    
    if (!formData.gozlem.trim()) {
      alert('Lütfen gözlem notlarınızı yazın!');
      return;
    }
    
    console.log('Günlük verisi:', formData);
    console.log('Fotoğraf:', foto ? foto.name : 'Yok');
    
    alert('Günlük kaydedildi! Dashboard\'a yönlendiriliyorsunuz...');
    
    setTimeout(() => {
      navigate('/OgrenciDashboard');
    }, 1500);
  };

  const handleDemoDoldur = () => {
    setFormData({
      tarih: new Date().toISOString().split('T')[0],
      ayEvresi: 'dolunay',
      gozlem: 'Bu akşam ay çok parlaktı. Gökyüzü açıktı ve yıldızlar da görünüyordu. Ayın etrafında hafif bir hale vardı.',
      havaDurumu: 'gunesli',
      notlar: 'Ayı izlerken yanımda teleskop vardı. Kraterleri net görebildim.'
    });
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
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🌙 Yeni Ay Gözlemi
            </h1>
            <p className="text-gray-300">
              Bu akşam ayı nasıl gördün? Gözlemlerini kaydet.
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
                      Gözlem Tarihi
                    </label>
                    <input
                      type="date"
                      name="tarih"
                      value={formData.tarih}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      required
                    />
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
                          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.ayEvresi === evre.deger ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'}`}
                        >
                          <span className="text-3xl mb-2">{evre.emoji}</span>
                          <span className="text-sm text-gray-300">{evre.ad}</span>
                        </button>
                      ))}
                    </div>
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
                          className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.havaDurumu === hava.deger ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'}`}
                        >
                          <span className="text-2xl mb-1">{hava.emoji}</span>
                          <span className="text-xs text-gray-300">{hava.ad}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gözlem */}
                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">
                      📝 Gözlem Notların
                    </label>
                    <textarea
                      name="gozlem"
                      value={formData.gozlem}
                      onChange={handleChange}
                      className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder="Ayı nasıl gördün? Parlak mıydı? Bulutlu muydu? Hissettiklerini yaz..."
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      En az 50 karakter yazmalısın.
                    </p>
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
                      placeholder="Eklemek istediğin başka şeyler var mı? Teleskop kullandın mı? vs..."
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
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
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
                          <label className="inline-block px-6 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-300 font-semibold rounded-lg hover:from-purple-900/70 hover:to-blue-900/70 transition-colors border border-purple-700/50 cursor-pointer">
                            <FaCamera className="inline mr-2" />
                            Fotoğraf Seç
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

                  {/* Demo Butonu */}
                  <div>
                    <button
                      type="button"
                      onClick={handleDemoDoldur}
                      className="w-full py-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 text-green-300 font-semibold rounded-lg hover:from-green-900/70 hover:to-blue-900/70 transition-colors border border-green-700/50 mb-4"
                    >
                      📋 Demo Bilgileri Doldur
                    </button>
                  </div>

                  {/* Kaydet Butonu */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95 text-lg"
                    >
                      <FaSave className="inline mr-2" />
                      🌙 GÜNLÜĞÜ KAYDET
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Yardım ve Bilgi */}
            <div className="space-y-6">
              {/* İpuçları */}
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  💡 İpuçları
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span>Ayı net görebildin mi?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span>Parlaklığı nasıldı?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span>Bulutlar görüşü engelledi mi?</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span>Hangi renkte göründü?</span>
                  </li>
                </ul>
              </div>

              {/* Örnek Gözlem */}
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  📝 Örnek Gözlem
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 italic">
                    "Bu akşam ay çok parlaktı. Gökyüzü açıktı, hafif rüzgar vardı. Ayın sol tarafı biraz karanlıktı. Yakınında parlak bir yıldız vardı."
                  </p>
                </div>
              </div>

              {/* Demo Mod */}
              <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  🎯 Demo Modu
                </h3>
                <p className="text-gray-300 text-sm">
                  Firebase eklenince gerçek kayıt çalışacak.
                </p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-gray-400 text-xs">
                    Demo günlük kaydedince dashboard'a yönlendirileceksin.
                  </p>
                </div>
              </div>

              {/* Ay Evreleri Bilgisi */}
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  🌘 Ay Evreleri
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>🌑 Yeni Ay:</strong> Ay görünmez</p>
                  <p><strong>🌓 İlk Dördün:</strong> Yarım ay (sağ yarısı)</p>
                  <p><strong>🌕 Dolunay:</strong> Tam daire</p>
                  <p><strong>🌗 Son Dördün:</strong> Yarım ay (sol yarısı)</p>
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
            © {new Date().getFullYear()} Ay Günlüğü - Yeni Gözlem
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Her akşam gökyüzüne bak ve ayın güzelliğini kaydet!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default YeniGunluk;