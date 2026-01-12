import React, { useState } from 'react';
import { 
  FaUser, FaLock, FaIdCard, 
  FaSchool, FaMoon, FaArrowLeft,
  FaCalendarAlt // YENİ EKLENDİ
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function OgrenciKayit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    sinif: '5',
    sube: 'A',
    ogrenciNo: '',
    egitimYili: '2026-2027', // YENİ EKLENDİ
    sifre: '',
    sifreTekrar: ''
  });

  const siniflar = ['5']; // SADECE 5. SINIF
  const subeler = ['A', 'B'];
  const egitimYillari = ['2025-2026', '2026-2027', '2027-2028']; // YENİ EKLENDİ

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validasyonları
    if (formData.ad.trim() === '' || formData.soyad.trim() === '') {
      alert('Ad ve soyad alanları zorunludur!');
      return;
    }
    
    if (!formData.ogrenciNo.trim()) {
      alert('Öğrenci numarası zorunludur!');
      return;
    }
    
    // Öğrenci numarası sadece sayı mı kontrolü
    if (!/^\d+$/.test(formData.ogrenciNo)) {
      alert('Öğrenci numarası sadece rakamlardan oluşmalıdır!');
      return;
    }
    
    if (formData.sifre.length < 4) {
      alert('Şifre en az 4 karakter olmalıdır!');
      return;
    }
    
    if (formData.sifre !== formData.sifreTekrar) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    
    console.log('Kayıt verisi:', formData);
    alert('Kayıt başarılı! Öğrenci paneline yönlendiriliyorsunuz...');
    
    // Demo modda kayıt olunca dashboard'a yönlendir
    setTimeout(() => {
      navigate('/OgrenciDashboard');
    }, 1500);
  };

  const handleDemoKayit = () => {
    setFormData({
      ad: 'Ali',
      soyad: 'Yılmaz',
      sinif: '5',
      sube: 'A',
      ogrenciNo: '12345',
      egitimYili: '2026-2027',
      sifre: '1234',
      sifreTekrar: '1234'
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
            <Link 
              to="/" 
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌙 Öğrenci Kayıt Formu
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ay gözlem günlüğüne katılmak için bilgilerini gir. 
              Öğrenci numaran ile giriş yapabileceksin.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sol: Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaUser className="mr-3 text-yellow-400" />
                  Öğrenci Bilgileri
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ad Soyad */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Ad *
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
                        Soyad *
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

                  {/* Sınıf/Şube - SADECE 5. SINIF */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Sınıf *
                      </label>
                      <select
                        name="sinif"
                        value={formData.sinif}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        required
                        disabled // Sadece 5. sınıf seçilebilir
                      >
                        {siniflar.map(sinif => (
                          <option key={sinif} value={sinif}>
                            {sinif}. Sınıf
                          </option>
                        ))}
                      </select>
                      <p className="text-gray-400 text-sm mt-1">
                        Bu site sadece 5. sınıflar için
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Şube *
                      </label>
                      <select
                        name="sube"
                        value={formData.sube}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        required
                      >
                        {subeler.map(sub => (
                          <option key={sub} value={sub}>
                            {sub} Şubesi
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* EĞİTİM YILI - YENİ EKLENDİ */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-blue-400" />
                      EĞİTİM YILI *
                    </label>
                    <select
                      name="egitimYili"
                      value={formData.egitimYili}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-blue-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      {egitimYillari.map(yil => (
                        <option key={yil} value={yil}>
                          {yil} Eğitim Yılı
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-400 text-sm mt-1">
                      Hangi yılın 5. sınıf öğrencisisiniz?
                    </p>
                  </div>

                  {/* Öğrenci No */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaIdCard className="inline mr-2 text-yellow-400" />
                      ÖĞRENCİ NUMARASI *
                    </label>
                    <input
                      type="text"
                      name="ogrenciNo"
                      value={formData.ogrenciNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-yellow-500/50 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-lg font-bold"
                      placeholder="12345 (sadece rakam)"
                      required
                      pattern="\d+"
                      title="Sadece rakam giriniz"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      <span className="text-yellow-300">⚠️ Önemli:</span> Bu numara ile giriş yapacaksın. Öğretmeninden al!
                    </p>
                  </div>
                  
                  {/* Şifre */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre * (min 4 karakter)
                      </label>
                      <input
                        type="password"
                        name="sifre"
                        value={formData.sifre}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="••••"
                        required
                        minLength="4"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre Tekrar *
                      </label>
                      <input
                        type="password"
                        name="sifreTekrar"
                        value={formData.sifreTekrar}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="••••"
                        required
                        minLength="4"
                      />
                    </div>
                  </div>

                  {/* Demo Kayıt Butonu */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleDemoKayit}
                      className="w-full py-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 text-green-300 font-semibold rounded-lg hover:from-green-900/70 hover:to-blue-900/70 transition-colors border border-green-700/50 mb-4"
                    >
                      📋 Demo Bilgilerini Doldur
                    </button>
                  </div>

                  {/* Kayıt Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                      🌙 KAYIT OL VE AY GÜNLÜĞÜNE BAŞLA
                    </button>
                  </div>

                  {/* Zaten hesabın varsa */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Zaten hesabın var mı?{' '}
                      <Link 
                        to="/OgrenciGiris" 
                        className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                      >
                        Giriş Yap
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Bilgilendirme */}
            <div className="space-y-6">
              {/* Giriş Sistemi Açıklama */}
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  🔐 Giriş Sistemi
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-yellow-400 mr-2 mt-1">🔢</span>
                    <span><strong>Öğrenci No + Şifre:</strong> Giriş yapmak için</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">📅</span>
                    <span><strong>Eğitim Yılı:</strong> Her yıl yeni kayıt</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-purple-400 mr-2 mt-1">👨‍🏫</span>
                    <span><strong>Öğretmeninden al:</strong> Özel öğrenci numarası</span>
                  </li>
                </ul>
              </div>

              {/* Eğitim Yılı Açıklama */}
              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  📅 Eğitim Yılı Sistemi
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center">
                    <span className="text-blue-400 mr-2">🎯</span>
                    Sadece 5. sınıflar kullanır
                  </p>
                  <p className="flex items-center">
                    <span className="text-blue-400 mr-2">🔄</span>
                    Her yıl yeni öğrenciler kayıt olur
                  </p>
                  <p className="flex items-center">
                    <span className="text-blue-400 mr-2">📚</span>
                    Eski kayıtlar arşivlenir
                  </p>
                  <p className="flex items-center">
                    <span className="text-blue-400 mr-2">👨‍🏫</span>
                    Öğretmen tüm yılları görür
                  </p>
                </div>
              </div>

              {/* Demo Mod Bilgisi */}
              <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  🎯 Demo Modu
                </h3>
                <p className="text-gray-300 text-sm">
                  Şu an demo moddasın. Gerçek kayıt için Firebase eklenecek.
                </p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-gray-400 text-xs">
                    Firebase eklenince: Öğrenci No + Şifre ile giriş
                  </p>
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
            © {new Date().getFullYear()} Ay Günlüğü - 5. Sınıflar Özel
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Bu platform 5. sınıf öğrencilerinin astronomi gözlemlerini kaydetmesi için tasarlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciKayit;