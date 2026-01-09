import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
// JournalPage import'u SİLİNDİ

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* JournalPage route'u SİLİNDİ */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;