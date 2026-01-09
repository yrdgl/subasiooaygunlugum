import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals';
import OgrenciKayit from './pages/OgrenciKayit'; // YENİ EKLENDİ

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} />
          <Route path="/OgrenciKayit" element={<OgrenciKayit />} /> {/* YENİ EKLENDİ */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;