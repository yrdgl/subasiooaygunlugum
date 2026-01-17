import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../lib/firebase";

function OgretmenGiris() {
  const [ogretmenKodu, setOgretmenKodu] = useState("");
  const [sifre, setSifre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const TEACHER_CODE = process.env.REACT_APP_TEACHER_CODE;
    const TEACHER_PASS = process.env.REACT_APP_TEACHER_PASS;

    if (ogretmenKodu === TEACHER_CODE && sifre === TEACHER_PASS) {
      // ✅ Firebase Auth oturumu aç (Firestore izinleri için)
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.log("Anon auth hata:", err);
      }

      localStorage.setItem("isTeacher", "yes");
      navigate("/OgretmenDashboard");
      return;
    }

    alert("Öğretmen kodu veya şifre hatalı!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">👨‍🏫 Öğretmen Girişi</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={ogretmenKodu}
            onChange={(e) => setOgretmenKodu(e.target.value)}
            placeholder="Öğretmen Kodu"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            placeholder="Şifre"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg"
          >
            Giriş Yap
          </button>
        </form>

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
