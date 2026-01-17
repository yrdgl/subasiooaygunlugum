import "./lib/firebase";
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Ana sayfaları import et
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals';
import OgrenciKayit from './pages/OgrenciKayit';
import OgrenciGiris from './pages/OgrenciGiris';
import OgrenciDashboard from './pages/OgrenciDashboard';
import YeniGunluk from './pages/YeniGunluk';
import Gunlukler from './pages/Gunlukler';
import OgretmenDashboard from './pages/OgretmenDashboard';
import OgretmenGiris from './pages/OgretmenGiris';

// ✅ Yeni: Şifre Yenile (custom reset page)
let SifreYenile;
try {
  SifreYenile = require('./pages/SifreYenile').default;
} catch (e) {
  SifreYenile = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-3">Şifre Yenile</h1>
        <p className="text-gray-300">
          Bu sayfa henüz eklenmemiş. (src/pages/SifreYenile.js)
        </p>
        <a
          href="/OgrenciGiris"
          className="inline-block mt-4 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg"
        >
          Giriş’e Dön
        </a>
      </div>
    </div>
  );
}

// ✅ SifreDegistir: varsa kullan, yoksa placeholder ile uygulama çökmesin
let SifreDegistir;
try {
  SifreDegistir = require('./pages/SifreDegistir').default;
} catch (e) {
  SifreDegistir = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-3">Şifre Değiştir</h1>
        <p className="text-gray-300">
          Bu sayfa henüz eklenmemiş. (src/pages/SifreDegistir.js)
        </p>
        <a
          href="/OgrenciDashboard"
          className="inline-block mt-4 px5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg"
        >
          Dashboard’a Dön
        </a>
      </div>
    </div>
  );
}

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

// GunlukDetay için placeholder
const GunlukDetay = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📖 GÜNLÜK DETAY</h1>
      <div className="bg-purple-900/30 p-6 rounded-xl mb-6">
        <p className="text-purple-200">Bu sayfa yakında eklenecek!</p>
        <p className="text-gray-300 mt-2">Günlük detay sayfası şu anda geliştirme aşamasındadır.</p>
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
  const currentYear = 2026;
  const appVersion = "1.0.0";

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* ANA SAYFA VE AUTH */}
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} />

          {/* ✅ AUTH (BÜYÜK HARF) */}
          <Route path="/OgrenciKayit" element={<OgrenciKayit />} />
          <Route path="/OgrenciGiris" element={<OgrenciGiris />} />
          <Route path="/OgretmenGiris" element={<OgretmenGiris />} />

          {/* ✅ AUTH (küçük harf kopyaları: 404'ü bitirir) */}
          <Route path="/ogrencikayit" element={<OgrenciKayit />} />
          <Route path="/ogrencigiris" element={<OgrenciGiris />} />
          <Route path="/ogretmengiris" element={<OgretmenGiris />} />

          {/* ✅ Şifre Yenile route'u (büyük + küçük) */}
          <Route path="/SifreYenile" element={<SifreYenile />} />
          <Route path="/sifreyenile" element={<SifreYenile />} />

          {/* ÖĞRENCİ PANELİ */}
          <Route path="/OgrenciDashboard" element={<OgrenciDashboard />} />
          <Route path="/YeniGunluk" element={<YeniGunluk />} />
          <Route path="/gunlukler" element={<Gunlukler />} />
          <Route path="/Gunlukler" element={<Gunlukler />} />
          <Route path="/AyTakvimi" element={<AyTakvimi />} />
          <Route path="/GunlukDetay/:id" element={<GunlukDetay />} />

          {/* ✅ Öğrenci panel küçük harf kopyaları */}
          <Route path="/ogrencidashboard" element={<OgrenciDashboard />} />
          <Route path="/yenigunluk" element={<YeniGunluk />} />
          <Route path="/aytakvimi" element={<AyTakvimi />} />

          {/* ✅ Şifre Değiştir route'u (büyük + küçük) */}
          <Route path="/SifreDegistir" element={<SifreDegistir />} />
          <Route path="/sifredegistir" element={<SifreDegistir />} />

          {/* ÖĞRETMEN PANELİ */}
          <Route path="/OgretmenDashboard" element={<OgretmenDashboard />} />
          <Route path="/ogretmendashboard" element={<OgretmenDashboard />} />

          {/* 404 SAYFASI */}
          <Route path="*" element={
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
              <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 max-w-md w-full">
                <div className="text-7xl mb-6 animate-pulse">🌑</div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  404
                </h1>
                <div className="mb-6">
                  <p className="text-xl text-gray-300 mb-2">Sayfa bulunamadı</p>
                  <p className="text-gray-400">{currentYear} yılında bu sayfayı aramış olabilirsiniz.</p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">📍 Hızlı Yönlendirmeler:</p>
                  <div className="flex flex-col gap-2">
                    <a href="/OgretmenGiris" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white">
                      👨‍🏫 Öğretmen Girişi
                    </a>
                    <a href="/OgrenciGiris" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white">
                      👤 Öğrenci Girişi
                    </a>
                    <a href="/Gunlukler" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white">
                      📝 Günlüklerim
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <a href="/" className="inline-block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold">
                    🏠 Ana Sayfaya Dön
                  </a>

                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                    <p>Ay Günlüğü © {currentYear} - v{appVersion}</p>
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
