import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals';
import OgrenciKayit from './pages/OgrenciKayit';
import OgrenciGiris from './pages/OgrenciGiris';
import OgrenciDashboard from './pages/OgrenciDashboard';
import YeniGunluk from './pages/YeniGunluk';
import Gunlukler from './pages/Gunlukler';  // BU SATIRI EKLEYİN

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} />
          <Route path="/OgrenciKayit" element={<OgrenciKayit />} />
          <Route path="/OgrenciGiris" element={<OgrenciGiris />} />
          <Route path="/OgrenciDashboard" element={<OgrenciDashboard />} />
          <Route path="/YeniGunluk" element={<YeniGunluk />} />
          <Route path="/Gunlukler" element={<Gunlukler />} />  {/* BU SATIRI EKLEYİN */}
          
          {/* Sayfa bulunamadı - 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
              <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <div className="text-5xl mb-6">🌑</div>
                <p className="text-xl text-gray-300 mb-6">Sayfa bulunamadı</p>
                <p className="text-gray-400 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
                <a 
                  href="/" 
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold"
                >
                  Ana Sayfaya Dön
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;