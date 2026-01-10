import React, { useState, useEffect } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaArrowLeft, 
  FaChevronLeft, FaChevronRight, FaInfoCircle
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function AyTakvimi() {
  const navigate = useNavigate();
  
  // 2026 yılı için ay takvimi verileri
  const [selectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentDate, setCurrentDate] = useState(new Date(2026, selectedMonth, 1));
  
  // Kullanıcının yazdığı günlük tarihleri (ÖRNEK - Firebase'den gelecek)
  const [yazilanGunler] = useState([
    '2026-01-10',
    '2026-01-15',
    '2026-01-18',
    '2026-02-08',
    '2026-02-17',
    '2026-03-10',
    '2026-03-18',
  ]);
  
  // Ay evreleri bilgisi - 2026 yılı için
  const ayEvreleri2026 = {
    // Ocak 2026
    '2026-01-02': { evre: '🌑 Yeni Ay', aciklama: 'Ay görünmüyor' },
    '2026-01-10': { evre: '🌓 İlk Dördün', aciklama: 'Ayın sağ yarısı görünüyor' },
    '2026-01-18': { evre: '🌕 Dolunay', aciklama: 'Tam daire şeklinde' },
    '2026-01-26': { evre: '🌗 Son Dördün', aciklama: 'Ayın sol yarısı görünüyor' },
    
    // Şubat 2026
    '2026-02-01': { evre: '🌑 Yeni Ay', aciklama: 'Ay görünmüyor' },
    '2026-02-08': { evre: '🌓 İlk Dördün', aciklama: 'Ayın sağ yarısı görünüyor' },
    '2026-02-17': { evre: '🌕 Dolunay', aciklama: 'Tam daire şeklinde' },
    '2026-02-24': { evre: '🌗 Son Dördün', aciklama: 'Ayın sol yarısı görünüyor' },
    
    // Mart 2026
    '2026-03-03': { evre: '🌑 Yeni Ay', aciklama: 'Ay görünmüyor' },
    '2026-03-10': { evre: '🌓 İlk Dördün', aciklama: 'Ayın sağ yarısı görünüyor' },
    '2026-03-18': { evre: '🌕 Dolunay', aciklama: 'Tam daire şeklinde' },
    '2026-03-25': { evre: '🌗 Son Dördün', aciklama: 'Ayın sol yarısı görünüyor' },
  };

  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const gunler = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Takvim günlerini hesapla
  const getTakvimGunleri = () => {
    const year = selectedYear;
    const month = selectedMonth;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Pazar
    
    const days = [];
    
    // Önceki ayın son günleri
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false,
        isToday: false,
        ayEvresi: null,
        dateString: null,
        günlükVar: false
      });
    }
    
    // Bu ayın günleri
    const today = new Date();
    const isCurrentYear = today.getFullYear() === 2026;
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const günlükVar = yazilanGunler.includes(dateString);
      
      days.push({
        date,
        currentMonth: true,
        isToday: isCurrentYear && date.getDate() === today.getDate() && date.getMonth() === today.getMonth(),
        ayEvresi: ayEvreleri2026[dateString] || null,
        dateString,
        günlükVar
      });
    }
    
    // Sonraki ayın ilk günleri
    const totalCells = 42; // 6 hafta * 7 gün
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        isToday: false,
        ayEvresi: null,
        dateString: null,
        günlükVar: false
      });
    }
    
    return days;
  };

  const [takvimGunleri, setTakvimGunleri] = useState(getTakvimGunleri());

  useEffect(() => {
    setTakvimGunleri(getTakvimGunleri());
  }, [selectedMonth]);

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1));
    setCurrentDate(new Date(selectedYear, selectedMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1));
    setCurrentDate(new Date(selectedYear, selectedMonth + 1, 1));
  };

  const handleBuguneGit = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    if (currentYear === 2026) {
      setSelectedMonth(currentMonth);
      setCurrentDate(new Date(2026, currentMonth, 1));
    } else {
      setSelectedMonth(0); // Ocak ayına git
      setCurrentDate(new Date(2026, 0, 1));
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
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
        <div className="max-w-6xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🌕 2026 Yılı Ay Takvimi
            </h1>
            <p className="text-gray-300">
              Ayın evrelerini takip et ve gözlem günlerini planla
            </p>
          </div>

          {/* Takvim Kontrolleri */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePreviousMonth}
                  className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaChevronLeft className="text-white" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">
                    {aylar[selectedMonth]} {selectedYear}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Ay evrelerini görmek için tarihlere tıklayın
                  </p>
                </div>
                
                <button
                  onClick={handleNextMonth}
                  className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaChevronRight className="text-white" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleBuguneGit}
                  className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 font-semibold rounded-lg hover:from-blue-900/70 hover:to-purple-900/70 transition-colors"
                >
                  📅 Bugüne Git
                </button>
                <button
                  onClick={() => navigate('/YeniGunluk')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
                >
                  🌙 Yeni Günlük
                </button>
              </div>
            </div>
          </div>

          {/* Takvim */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            {/* Gün başlıkları */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {gunler.map((gun) => (
                <div key={gun} className="text-center p-2">
                  <div className="text-gray-400 font-semibold">{gun}</div>
                </div>
              ))}
            </div>
            
            {/* Takvim günleri */}
            <div className="grid grid-cols-7 gap-2">
              {takvimGunleri.map((gun, index) => {
                // Tarih string'ini güvenli şekilde oluştur
                const tarih = gun.date;
                let dateString = gun.dateString;
                
                if (!dateString && gun.currentMonth) {
                  dateString = `${tarih.getFullYear()}-${(tarih.getMonth() + 1).toString().padStart(2, '0')}-${tarih.getDate().toString().padStart(2, '0')}`;
                }
                
                const handleClick = () => {
                  if (gun.currentMonth && dateString) {
                    console.log("Tıklanan tarih:", dateString);
                    navigate(`/YeniGunluk?date=${dateString}`);
                  }
                };
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-24 p-2 rounded-lg border transition-all 
                      ${gun.currentMonth ? 'bg-gray-900/50 border-gray-700 cursor-pointer hover:border-blue-500 hover:bg-blue-900/20' : 'bg-gray-900/20 border-gray-800/50 cursor-default'}
                      ${gun.isToday ? 'border-yellow-500 bg-yellow-500/10' : ''}
                      ${gun.ayEvresi ? 'hover:border-blue-500 hover:bg-blue-900/20' : ''}
                      ${gun.günlükVar ? 'hover:border-green-500 hover:bg-green-900/20' : ''}
                      ${!gun.currentMonth ? 'opacity-50' : ''}
                    `}
                    onClick={handleClick}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className={`
                        w-8 h-8 flex items-center justify-center rounded-full relative
                        ${gun.isToday ? 'bg-yellow-500 text-white' : 'text-gray-300'}
                        ${!gun.currentMonth ? 'text-gray-500' : ''}
                      `}>
                        {tarih.getDate()}
                        
                        {/* Günlük yazılmışsa yeşil nokta */}
                        {gun.günlükVar && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-800"></div>
                        )}
                      </div>
                      
                      {gun.ayEvresi && (
                        <div className="text-lg">
                          {gun.ayEvresi.evre.split(' ')[0]}
                        </div>
                      )}
                    </div>
                    
                    {gun.ayEvresi && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-400 truncate">
                          {gun.ayEvresi.evre.split(' ')[1]}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {gun.ayEvresi.aciklama}
                        </div>
                      </div>
                    )}
                    
                    {/* Günlük var yazısı */}
                    {gun.günlükVar && (
                      <div className="text-xs text-green-400 mt-2 font-semibold">
                        📝 Günlük Var
                      </div>
                    )}
                    
                    {gun.isToday && !gun.günlükVar && (
                      <div className="text-xs text-yellow-400 mt-2 font-semibold">
                        🔸 Bugün
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Açıklama Kutusu */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Günlük Yazılmış</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Bugün</span>
                </div>
                <div className="flex items-center">
                  <div className="text-blue-400 mr-2">🌓</div>
                  <span className="text-gray-300">Ay Evresi Var</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ay Evreleri Açıklamaları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Ay Evreleri Bilgisi */}
            <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-2xl text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Ay Evreleri Nedir?</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌑</span>
                  <div>
                    <h4 className="font-semibold text-white">Yeni Ay</h4>
                    <p className="text-gray-300 text-sm">Ay, Dünya ile Güneş arasında. Görünmez.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌓</span>
                  <div>
                    <h4 className="font-semibold text-white">İlk Dördün</h4>
                    <p className="text-gray-300 text-sm">Ayın sağ yarısı aydınlık.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌕</span>
                  <div>
                    <h4 className="font-semibold text-white">Dolunay</h4>
                    <p className="text-gray-300 text-sm">Tam daire şeklinde görünür.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌗</span>
                  <div>
                    <h4 className="font-semibold text-white">Son Dördün</h4>
                    <p className="text-gray-300 text-sm">Ayın sol yarısı aydınlık.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2026 Yılı Önemli Tarihler */}
            <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
              <h3 className="text-xl font-bold text-white mb-4">📅 2026 Yılı Önemli Tarihler</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">🌕 Süper Dolunay</p>
                    <p className="text-gray-400 text-sm">Ay en parlak haliyle</p>
                  </div>
                  <span className="text-yellow-300">17 Şubat</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">🌑 Tam Güneş Tutulması</p>
                    <p className="text-gray-400 text-sm">Ay Güneş'i tamamen kapatır</p>
                  </div>
                  <span className="text-yellow-300">12 Ağustos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">🌕 Mavi Ay</p>
                    <p className="text-gray-400 text-sm">Ayda 2. dolunay</p>
                  </div>
                  <span className="text-yellow-300">31 Mayıs</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">🌠 Perseid Meteor Yağmuru</p>
                    <p className="text-gray-400 text-sm">En iyi ay gözlem zamanı</p>
                  </div>
                  <span className="text-yellow-300">12-13 Ağustos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gözlem İpuçları */}
          <div className="bg-green-900/30 rounded-xl p-6 border border-green-700/50 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🔭 Ay Gözlem İpuçları (2026)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="text-3xl mb-2">🌙</div>
                <h4 className="font-semibold text-white mb-2">En İyi Zaman</h4>
                <p className="text-gray-300 text-sm">Dolunay ve çevresi: 17-19 Şubat 2026</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-semibold text-white mb-2">Gözlem Saatleri</h4>
                <p className="text-gray-300 text-sm">20:00 - 23:00 arası ideal</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="text-3xl mb-2">📸</div>
                <h4 className="font-semibold text-white mb-2">Fotoğraf Çekimi</h4>
                <p className="text-gray-300 text-sm">Tripod kullan, uzun pozlama yap</p>
              </div>
            </div>
          </div>

          {/* Demo Mod Bilgisi */}
          <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                🎯 2026 Yılı Ay Takvimi - Demo
              </h3>
              <span className="ml-3 px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded">
                TAKVİM VERİLERİ
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Bu takvim 2026 yılına özel olarak hazırlanmıştır. Gerçek ay evreleri astronomik verilerle güncellenecektir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>📅 Yıl:</strong> 2026
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>📍 Konum:</strong> Türkiye (GMT+3)
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>🌕 Evreler:</strong> Yaklaşık tarihler
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
            © 2026 Ay Günlüğü - Ay Takvimi
          </p>
          <p className="text-gray-500 text-sm mt-2">
            2026 yılında ayın evrelerini takip etmek için hazırlanmıştır.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600">
            <span>🌑 Yeni Ay</span>
            <span>🌓 İlk Dördün</span>
            <span>🌕 Dolunay</span>
            <span>🌗 Son Dördün</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AyTakvimi;