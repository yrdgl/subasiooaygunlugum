// frontend/src/pages/OgrenciKayit.js
import React, { useState } from 'react';
import { 
  FaUser, FaLock, FaEnvelope, FaIdCard, 
  FaSchool, FaMoon, FaArrowLeft 
} from 'react-icons/fa';

function OgrenciKayit() {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    sinif: '5',
    sube: 'A',
    ogrenciNo: '',
    email: '',
    sifre: '',
    sifreTekrar: ''
  });

  const siniflar = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const subeler = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Kayıt verisi:', formData);
    alert('Kayıt başarılı! (Firebase ekleyince çalışacak)');
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
            <a 
              href="/" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌙 Öğrenci Kayıt Formu
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ay gözlem günlüğüne katılmak için bilgilerini gir. 
              Her akşam ayın durumunu kaydedebileceksin!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sol: Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaUser className="mr-3 text-yellow-400" />
                  Kişisel Bilgiler
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ad Soyad */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Adınız
                      </label>
                      <input
                        type="text"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ali"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Soyadınız
                      </label>
                      <input
                        type="text"
                        name="soyad"
                        value={formData.soyad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Yılmaz"
                        required
                      />
                    </div>
                  </div>

                  {/* Sınıf/Şube */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Sınıf
                      </label>
                      <select
                        name="sinif"
                        value={formData.sinif}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      >
                        {siniflar.map(sinif => (
                          <option key={sinif} value={sinif}>
                            {sinif}. Sınıf
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Şube
                      </label>
                      <select
                        name="sube"
                        value={formData.sube}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      >
                        {subeler.map(sub => (
                          <option key={sub} value={sub}>
                            {sub} Şubesi
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Öğrenci No */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaIdCard className="inline mr-2" />
                      Öğrenci Numarası (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      name="ogrenciNo"
                      value={formData.ogrenciNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="12345"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="ali@okul.edu.tr"
                      required
                    />
                  </div>

                  {/* Şifre */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre
                      </label>
                      <input
                        type="password"
                        name="sifre"
                        value={formData.sifre}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="••••••••"
                        required
                        minLength="6"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre Tekrar
                      </label>
                      <input
                        type="password"
                        name="sifreTekrar"
                        value={formData.sifreTekrar}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="••••••••"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  {/* Kayıt Butonu */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02]"
                    >
                      🌙 KAYIT OL VE AY GÜNLÜĞÜNE BAŞLA
                    </button>
                  </div>

                  {/* Zaten hesabın varsa */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Zaten hesabın var mı?{' '}
                      <a 
                        href="#" 
                        className="text-yellow-400 hover:text-yellow-300 font-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Giriş sayfası yakında eklenecek!');
                        }}
                      >
                        Giriş Yap
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Bilgilendirme */}
            <div className="space-y-6">
              {/* Bilgi Kartı 1 */}
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <FaMoon className="mr-2" />
                  Nasıl Çalışır?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Kayıt olduktan sonra giriş yap",
                    "Her akşam ay gözlemini yaz",
                    "Fotoğraf ekleyebilirsin",
                    "Öğretmenin yorum yapabilir"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <span className="text-green-400 mr-2 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bilgi Kartı 2 */}
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  📅 Günlük Rutin
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>1. Akşam gökyüzüne bak</p>
                  <p>2. Ayın şeklini seç</p>
                  <p>3. Gözlemlerini yaz</p>
                  <p>4. Kaydet ve paylaş!</p>
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
            © {new Date().getFullYear()} Ay Günlüğü - Öğrenci Platformu
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Bu platform öğrencilerin astronomi gözlemlerini kaydetmesi için tasarlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciKayit;