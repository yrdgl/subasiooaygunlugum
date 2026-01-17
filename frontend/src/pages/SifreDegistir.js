import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaArrowLeft, FaMoon } from "react-icons/fa";

import { auth, db } from "../lib/firebase";
import { updatePassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SifreDegistir() {
  const navigate = useNavigate();

  const [yeniSifre, setYeniSifre] = useState("");
  const [yeniSifre2, setYeniSifre2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (yeniSifre.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (yeniSifre !== yeniSifre2) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    const studentId = localStorage.getItem("activeStudentId");
    if (!studentId) {
      alert("Aktif öğrenci bulunamadı. Lütfen tekrar giriş yap.");
      navigate("/OgrenciGiris");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Oturum bulunamadı. Lütfen tekrar giriş yap.");
      navigate("/OgrenciGiris");
      return;
    }

    try {
      setLoading(true);

      // 1) Auth şifre güncelle
      await updatePassword(user, yeniSifre);

      // 2) Firestore'da zorunlu değiştirme bayrağını kapat
      await setDoc(
        doc(db, "students", studentId),
        { mustChangePassword: false, passwordChangedAt: serverTimestamp() },
        { merge: true }
      );

      alert("Şifre güncellendi. Dashboard’a yönlendiriliyorsun.");
      navigate("/OgrenciDashboard");
    } catch (err) {
      console.error(err);
      const code = err?.code || "";
      if (code.includes("auth/requires-recent-login")) {
        alert("Güvenlik nedeniyle tekrar giriş yapman gerekiyor. Lütfen yeniden giriş yap.");
        navigate("/OgrenciGiris");
      } else {
        alert("Şifre değiştirme başarısız.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">Ay Günlüğü</h1>
            </div>
            <Link
              to="/OgrenciDashboard"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Dashboard’a Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🔐 Şifre Değiştir</h1>
            <p className="text-gray-300">İlk girişte şifre değiştirmen gerekiyor.</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <form onSubmit={handleChange} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  Yeni Şifre (min 6)
                </label>
                <input
                  type="password"
                  value={yeniSifre}
                  onChange={(e) => setYeniSifre(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="••••••"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  value={yeniSifre2}
                  onChange={(e) => setYeniSifre2(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="••••••"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-6">
              Not: Şifreyi değiştirdikten sonra girişin kalıcı olur.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
