// src/pages/OgrenciDashboard.js - DEMO TEMİZLENMİŞ + FIRESTORE'DAN OKUYAN HAL

import React, { useEffect, useState } from 'react';
import {
  FaMoon, FaCalendarAlt,
  FaUserCircle, FaArrowRight, FaPlus, FaHistory,
  FaStar, FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { auth, db } from "../lib/firebase";

function OgrenciDashboard() {
  const navigate = useNavigate();

  // Bugünün tarihini al
  const getTodayDate = () => {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('tr-TR', options).format(today);
  };

  // ✅ Gerçek öğrenci bilgisi (Firestore'dan)
  const [ogrenci, setOgrenci] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Öğretmen yıldız toplamı (günlüklerden)
  const [toplamOgretmenYildizi, setToplamOgretmenYildizi] = useState(0);

  // ✅ Firestore'dan öğrenciyi çek + günlüklerden yıldızları topla
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const studentId = localStorage.getItem("activeStudentId");
        if (!studentId) {
          setLoading(false);
          navigate("/OgrenciGiris");
          return;
        }

        // 1) Öğrenci dokümanı
        const snap = await getDoc(doc(db, "students", studentId));
        if (!snap.exists()) {
          setLoading(false);
          alert("Öğrenci kaydı bulunamadı. Lütfen tekrar giriş yap.");
          navigate("/OgrenciGiris");
          return;
        }
        setOgrenci(snap.data());

        // 2) Günlüklerden öğretmen yıldızlarını topla
        let toplam = 0;
        try {
          const jSnap = await getDocs(collection(db, "gunlukler", studentId, "items"));
          jSnap.forEach((d) => {
            const data = d.data() || {};
            const y = Number(data.ogretmenYildizi || 0);
            if (!Number.isNaN(y)) toplam += y;
          });
        } catch (e) {
          console.error("Günlük yıldızları okunamadı:", e);
          // yıldızlar okunamazsa dashboard yine açılsın
        }
        setToplamOgretmenYildizi(toplam);

        setLoading(false);
      } catch (e) {
        console.error("Öğrenci verisi okunamadı:", e);
        setLoading(false);
        alert("Öğrenci bilgisi yüklenemedi.");
      }
    };

    loadStudent();
  }, [navigate]);

  const handleCikis = async () => {
    try { await signOut(auth); } catch (_) {}
    localStorage.removeItem("activeStudentId");
    localStorage.removeItem("activeUid");
    navigate('/');
  };

  const handleKaydimiSil = async () => {
    const ok = window.confirm("Hesabını ve tüm kayıtlarını silmek istediğine emin misin?");
    if (!ok) return;

    const studentId = localStorage.getItem("activeStudentId");
    const user = auth.currentUser;

    try {
      if (studentId) {
        await deleteDoc(doc(db, "students", studentId));
      }

      if (user) {
        await deleteUser(user);
      }

      localStorage.removeItem("activeStudentId");
      localStorage.removeItem("activeUid");
      alert("Kaydın silindi.");
      navigate('/');
    } catch (err) {
      console.error("Kayıt silme hatası:", err);
      const code = err?.code || "";

      if (code.includes("auth/requires-recent-login")) {
        alert("Güvenlik için tekrar giriş yapman gerekiyor. Lütfen çıkış yapıp yeniden giriş yaptıktan sonra tekrar dene.");
      } else {
        alert("Kayıt silinemedi.");
      }
    }
  };

  const handleYeniGunluk = () => {
    navigate('/YeniGunluk');
  };

  const handleGecmisGunlukler = () => {
    navigate('/Gunlukler');
  };

  const handleAyTakvimi = () => {
    navigate('/AyTakvimi');
  };

  // ✅ Güvenli alanlar (farklı isimlendirmelere karşı fallback)
  const ad = ogrenci?.ad || ogrenci?.isim || "";
  const soyad = ogrenci?.soyad || "";
  const sinif = ogrenci?.sinif || "";
  const sube = ogrenci?.sube || "";

  // ✅ Artık toplam puan = öğretmenin verdiği yıldızların toplamı
  const toplamPuan = Number(toplamOgretmenYildizi || 0);

  // ✅ Öğretmen yıldız vermediyse yıldız bölümünü göstermeyelim
  const teacherStarsVisible = toplamPuan > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-gray-300">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Ay Günlüğü
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaUserCircle className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">
                    {ad} {soyad}
                  </p>
                  <p className="text-sm text-gray-400">
                    {sinif}{sube ? `-${sube}` : ""}
                  </p>
                </div>
              </div>

              <button
                onClick={handleKaydimiSil}
                className="flex items-center text-gray-300 hover:text-white transition-colors ml-4 px-3 py-2 hover:bg-gray-800 rounded-lg"
              >
                Kaydımı Sil
              </button>

              <button
                onClick={handleCikis}
                className="flex items-center text-gray-300 hover:text-white transition-colors ml-4 px-3 py-2 hover:bg-gray-800 rounded-lg"
              >
                <FaSignOutAlt className="mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hoşgeldin Bölümü */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              🌙 Merhaba{ad ? `, ${ad}!` : "!"}
            </h1>
            <p className="text-gray-300">
              Ay gözlem günlüğüne hoş geldin. Bugün ayı gözlemledin mi?
            </p>
          </div>

          {/* Toplam Puan (öğretmen yıldız vermediyse hiç gösterme) */}
          {teacherStarsVisible && (
            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-2xl p-6 mb-8 border border-yellow-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">⭐</div>
                  <div>
                    <h3 className="text-xl font-bold">Toplam Puan: {toplamPuan}</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      Öğretmeninden aldığın toplam yıldız puanı
                    </p>
                    <div className="flex items-center mt-3">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="text-gray-300">
                        Harika! Yıldızların öğretmenin verdikçe burada görünecek.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl mb-1">🏆</div>
                  <p className="text-gray-400 text-sm">Başarı</p>
                </div>
              </div>
            </div>
          )}

          {/* Hızlı Eylemler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={handleYeniGunluk}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <FaPlus className="text-2xl text-blue-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Yeni Günlük Yaz</h3>
              <p className="text-gray-300 mb-4">
                Bugünkü ay gözlemini kaydet
              </p>
              <div className="w-full py-2 bg-blue-900/50 text-blue-300 rounded-lg text-center">
                Hemen Başla
              </div>
            </button>

            <button
              onClick={handleGecmisGunlukler}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center">
                  <FaHistory className="text-2xl text-purple-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tüm Günlüklerim</h3>
              <p className="text-gray-300 mb-4">
                Önceki gözlemlerini incele
              </p>
              <div className="w-full py-2 bg-purple-900/50 text-purple-300 rounded-lg text-center">
                Görüntüle
              </div>
            </button>

            <button
              onClick={handleAyTakvimi}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:scale-[1.02] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-green-400" />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ay Takvimi</h3>
              <p className="text-gray-300 mb-4">
                Ayın evrelerini takip et
              </p>
              <div className="w-full py-2 bg-green-900/50 text-green-300 rounded-lg text-center">
                Takvimi Aç
              </div>
            </button>
          </div>

          {/* Bugünün Bilgisi */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 mb-8 border border-blue-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-6xl">🌙</div>
                <div>
                  <h3 className="text-2xl font-bold">Bugün: {getTodayDate()}</h3>
                  <p className="text-gray-300">
                    Yeni bir günlük yazarak öğretmeninden yıldız kazanabilirsin!
                  </p>
                </div>
              </div>

              <button
                onClick={handleYeniGunluk}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center"
              >
                <FaPlus className="mr-2" />
                Yeni Günlük Yaz
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - Öğrenci Dashboard
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Öğretmen yıldızları ile motivasyonunu artır!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciDashboard;
