import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals';
import OgrenciKayit from './pages/OgrenciKayit';
import OgrenciGiris from './pages/OgrenciGiris';
import OgrenciDashboard from './pages/OgrenciDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} />
          <Route path="/OgrenciKayit" element={<OgrenciKayit />} />
          <Route path="/OgrenciGiris" element={<OgrenciGiris />} />
          <Route path="/OgrenciDashboard" element={<OgrenciDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
