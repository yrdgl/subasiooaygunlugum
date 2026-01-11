import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster'; // BU SATIRI EKLEYİN

// Ana sayfaları import et
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals';
import OgrenciKayit from './pages/OgrenciKayit';
import OgrenciGiris from './pages/OgrenciGiris';
import OgrenciDashboard from './pages/OgrenciDashboard';
import YeniGunluk from './pages/YeniGunluk';
import Gunlukler from './pages/Gunlukler';

// AyTakvimi.js dosyası var mı kontrol et - yoksa placeholder kullan
let AyTakvimi;
try {
  AyTakvimi = require('./pages/AyTakvimi').default;
} catch (error) {
  AyTakvimi = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🌕 AY TAKVİMİ (2026)</h1>
        <div className="bg-yellow-900/30 p-6 rounded-xl mb-6">
          <p className="text-yellow-200 mb-2">ℹ️ AyTakvimi.js dosyası yüklenemedi</p>
          <p className="text-gray-300">
            Lütfen <code>src/pages/AyTakvimi.js</code> dosyasının oluşturulduğundan emin olun.
          </p>
        </div>
        <a 
          href="/OgrenciDashboard" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600"
        >
          Dashboard'a Dön
        </a>
      </div>
    </div>
  );
}

// OgretmenDashboard için placeholder (henüz oluşturulmadı)
const OgretmenDashboard = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">👨‍🏫 ÖĞRETMEN DASHBOARD</h1>
      <div className="bg-blue-900/30 p-6 rounded-xl mb-6">
        <p className="text-blue-200">Bu sayfa yakında eklenecek!</p>
        <p className="text-gray-300 mt-2">
          Öğretmen paneli şu anda geliştirme aşamasındadır.
        </p>
      </div>
      <a 
        href="/" 
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  </div>
);

// GunlukDetay için placeholder
const GunlukDetay = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📖 GÜNLÜK DETAY</h1>
      <div className="bg-purple-900/30 p-6 rounded-xl mb-6">
        <p className="text-purple-200">Bu sayfa yakında eklenecek!</p>
        <p className="text-gray-300 mt-2">
          Günlük detay sayfası şu anda geliştirme aşamasındadır.
        </p>
      </div>
      <a 
        href="/Gunlukler" 
        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
      >
        Geçmiş Günlüklere Dön
      </a>
    </div>
  </div>
);

function App() {
  // 2026 yılı bilgisi - tüm uygulama için
  const currentYear = 2026;
  const appVersion = "1.0.0";

  return (
    <div className="App">
      {/* Toast bildirimleri için Toaster bileşeni - BU SATIRI EKLEYİN */}
      <Toaster />

      {/* Uygulama Bilgi Notu - Sadece geliştirme modunda göster */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-900/80 text-yellow-200 text-center py-1 text-sm z-50 backdrop-blur-sm">
          🚀 Demo Modu - {currentYear} Yılı - v{appVersion} - Tüm tarihler {currentYear} yılına ayarlanmıştır
        </div>
      )}

      <BrowserRouter>
        <Routes>
          {/* ANA SAYFA VE AUTH */}
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} />
          <Route path="/OgrenciKayit" element={<OgrenciKayit />} />
          <Route path="/OgrenciGiris" element={<OgrenciGiris />} />
          
          {/* ÖĞRENCİ PANELİ - ÇALIŞAN SAYFALAR */}
          <Route path="/OgrenciDashboard" element={<OgrenciDashboard />} />
          <Route path="/YeniGunluk" element={<YeniGunluk />} />
          <Route path="/Gunlukler" element={<Gunlukler />} />
          <Route path="/AyTakvimi" element={<AyTakvimi />} />
          <Route path="/GunlukDetay/:id" element={<GunlukDetay />} />
          
          {/* ÖĞRETMEN PANELİ - YAKINDA */}
          <Route path="/OgretmenDashboard" element={<OgretmenDashboard />} />
          <Route path="/OgretmenGunlukler" element={
            <div className="min-h-screen bg-gray-900 text-white p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">📚 Öğretmen Günlükler Sayfası</h1>
                <p className="text-gray-300 mb-6">Bu sayfa yakında eklenecek!</p>
                <a href="/" className="text-blue-400 hover:text-blue-300">Ana Sayfa</a>
              </div>
            </div>
          } />
          
          <Route path="/SinifYonetimi" element={
            <div className="min-h-screen bg-gray-900 text-white p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">👥 Sınıf Yönetimi</h1>
                <p className="text-gray-300 mb-6">Bu sayfa yakında eklenecek!</p>
                <a href="/" className="text-blue-400 hover:text-blue-300">Ana Sayfa</a>
              </div>
            </div>
          } />
          
          {/* Sayfa bulunamadı - 404 (2026 yılına uygun güncellendi) */}
          <Route path="*" element={
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
              <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 max-w-md w-full">
                <div className="text-7xl mb-6 animate-pulse">🌑</div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  404
                </h1>
                <div className="mb-6">
                  <p className="text-xl text-gray-300 mb-2">Sayfa bulunamadı</p>
                  <p className="text-gray-400">
                    {currentYear} yılında bu sayfayı aramış olabilirsiniz.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">📍 Hızlı Yönlendirmeler:</p>
                  <div className="flex flex-col gap-2">
                    <a 
                      href="/OgrenciDashboard" 
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
                    >
                      📊 Öğrenci Dashboard
                    </a>
                    <a 
                      href="/Gunlukler" 
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
                    >
                      📚 Geçmiş Günlükler
                    </a>
                    <a 
                      href="/AyTakvimi" 
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
                    >
                      🌕 Ay Takvimi
                    </a>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href="/" 
                    className="inline-block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold hover:scale-105 transform transition-transform"
                  >
                    🏠 Ana Sayfaya Dön
                  </a>
                  
                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                    <p>Ay Günlüğü © {currentYear} - v{appVersion}</p>
                    <p className="mt-1">Tüm hakları saklıdır</p>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;