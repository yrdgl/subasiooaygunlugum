import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OgretmenGiris() {
  const [ogretmenKodu, setOgretmenKodu] = useState('');
  const [sifre, setSifre] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 CRA / CRACO Environment Variables
    const TEACHER_CODE = process.env.REACT_APP_TEACHER_CODE;
    const TEACHER_PASS = process.env.REACT_APP_TEACHER_PASS;

    if (ogretmenKodu === TEACHER_CODE && sifre === TEACHER_PASS) {
      localStorage.setItem('isTeacher', 'yes');
      navigate('/OgretmenDashboard');
    } else {
      alert('Öğretmen kodu veya şifre hatalı');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h1 className="text-3xl font-bold text-white mb-2">Öğretmen Girişi</h1>
          <p className="text-gray-300">Ay Günlüğü Öğretmen Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Öğretmen Kodu</label>
            <input
              type="text"
              value={ogretmenKodu}
              onChange={(e) => setOgretmenKodu(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Sadece yetkili öğretmenler içindir
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Ana Sayfa
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OgretmenGiris;
