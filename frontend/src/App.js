import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JournalPage from './pages/DailyJournals'; // BU SATIRI GERİ EKLE

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candemirin-ay-gunlugu" element={<JournalPage />} /> {/* BU SATIRI GERİ EKLE */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;