import React, { useState } from 'react';
import { FaIdCard, FaLock, FaArrowLeft, FaMoon, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

function OgrenciGiris() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    ogrenciNo: '',
    sifre: '',
    egitimYili: '2026-2027' // YENİ EKLENDİ
  });

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
    
    if (!formData.ogrenciNo.trim()) {
      toast({
        title: "Hata",
        description: "Öğrenci numarası gerekli!",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.sifre.length < 4) {
      toast({
        title: "Hata",
        description: "Şifre en az 4 karakter olmalıdır!",
        variant: "destructive"
      });
      return;
    }
    
    // Demo giriş kontrolü - Öğrenci No: 12345, Şifre: 1234
    if (formData.ogrenciNo === '12345' && formData.sifre === '1234') {
      toast({
        title: "Giriş Başarılı",
        description: `${formData.egitimYili} eğitim yılına giriş yapılıyor...`,
      });
      
      // 1 saniye sonra otomatik yönlendir
      setTimeout(() => {
        navigate('/OgrenciDashboard');
      }, 1000);
    } else {
      toast({
        title: "Demo Giriş Bilgileri",
        description: "Öğrenci No: 12345, Şifre: 1234",
        variant: "destructive"
      });
    }
  };

  const handleDemoGiris = () => {
    setFormData({
      ogrenciNo: '12345',
      sifre: '1234',
      egitimYili: '2026-2027'
    });
    
    toast({
      title: "Demo Bilgileri Yüklendi",
      description: "Giriş yapmak için 'GİRİŞ YAP' butonuna tıklayın.",
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🌙 Öğrenci Girişi
            </h1>
            <p className="text-gray-300">
              Öğrenci numaran ve şifren ile giriş yap
            </p>
          </div>

          {/* Giriş Formu */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Hangi yılın öğrencisisiniz?
                </p>
              </div>

              {/* Öğrenci Numarası */}
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
                  placeholder="12345"
                  required
                  pattern="\d+"
                  title="Sadece rakam giriniz"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Öğretmeninin verdiği öğrenci numaran
                </p>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  ŞİFRE * (min 4 karakter)
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

              {/* Demo Giriş Butonu */}
              <div>
                <button
                  type="button"
                  onClick={handleDemoGiris}
                  className="w-full py-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 text-green-300 font-semibold rounded-lg hover:from-green-900/70 hover:to-blue-900/70 transition-colors border border-green-700/50 mb-4"
                >
                  📋 Demo Giriş Bilgilerini Doldur
                </button>
              </div>

              {/* Giriş Butonu */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95"
              >
                🔓 GİRİŞ YAP
              </button>
            </form>

            {/* Ekstra Linkler */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-gray-400">
                Hesabın yok mu?{' '}
                <Link 
                  to="/OgrenciKayit" 
                  className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                >
                  Kayıt Ol
                </Link>
              </p>
              
              <p className="text-gray-400">
                Öğretmen misin?{' '}
                <Link 
                  to="/OgretmenGiris" 
                  className="text-blue-400 hover:text-blue-300 font-semibold underline"
                >
                  Öğretmen Girişi
                </Link>
              </p>
              
              <p className="text-gray-400 text-sm">
                Şifreni mi unuttun?{' '}
                <button
                  onClick={() => toast({
                    title: "Şifre Sıfırlama",
                    description: "Öğretmeninize başvurun!",
                  })}
                  className="text-gray-300 hover:text-white underline"
                >
                  Öğretmenine sor
                </button>
              </p>
            </div>
          </div>

          {/* Demo Bilgisi */}
          <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-3">
              🎯 Demo Modu
            </h3>
            <p className="text-gray-300">
              Firebase eklenince gerçek giriş çalışacak. Şimdilik demo girişi kullanabilirsiniz.
            </p>
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong>Demo giriş bilgileri:</strong><br />
                Eğitim Yılı: <span className="text-blue-300">2026-2027</span><br />
                Öğrenci No: <span className="text-yellow-300">12345</span><br />
                Şifre: <span className="text-yellow-300">1234</span>
              </p>
            </div>
          </div>
          
          {/* Eğitim Yılı Açıklaması - YENİ EKLENDİ */}
          <div className="mt-6 bg-purple-900/30 rounded-xl p-4 border border-purple-700/50">
            <h4 className="text-white font-bold mb-2">📅 Eğitim Yılı Nedir?</h4>
            <p className="text-gray-300 text-sm">
              <strong>Her yıl yenilenir:</strong> 2026-2027 öğrencileri sadece kendi yılında giriş yapar.<br/>
              <strong>Arşiv:</strong> Eski yıl öğrencileri sadece öğretmen tarafından görülebilir.
            </p>
          </div>

          {/* Önemli Not */}
          <div className="mt-6 bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/50">
            <p className="text-gray-300 text-sm">
              <strong>📌 Not:</strong> Öğrenci numaranı ve şifreni unutma!<br />
              Şifreni sadece öğretmenin sıfırlayabilir.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - 5. Sınıflar Platformu
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciGiris;