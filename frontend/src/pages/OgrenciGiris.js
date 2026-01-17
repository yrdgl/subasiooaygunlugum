import React, { useState } from 'react';
import { FaIdCard, FaLock, FaArrowLeft, FaMoon, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";

function OgrenciGiris() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ogrenciNo: '', // ✅ tasarım bozulmasın diye adı aynı kaldı (bu alana e-posta girilecek)
    sifre: '',
    egitimYili: '2026-2027'
  });

  // ✅ Şifremi Unuttum modal state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // ✅ Toast (alert yerine)
  const [toast, setToast] = useState({
    open: false,
    type: "info", // "success" | "error" | "info"
    title: "",
    message: ""
  });

  // ✅ Toast süresi: 2500ms (senin istediğin)
  const showToast = (type, title, message, durationMs = 2500) => {
    setToast({ open: true, type, title, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }));
    }, durationMs);
  };

  const egitimYillari = ['2025-2026', '2026-2027', '2027-2028'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const trim = (s) => (s || "").trim();

  const openResetModal = () => {
    const candidate = trim(formData.ogrenciNo).toLowerCase();
    setResetEmail(candidate);
    setShowReset(true);
  };

  const closeResetModal = () => {
    setShowReset(false);
    setResetLoading(false);
  };

  const handlePasswordReset = async () => {
    const emailCandidate = trim(resetEmail).toLowerCase();
    if (!emailCandidate) {
      showToast("error", "Eksik Bilgi", "E-posta gerekli!");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate);
    if (!emailOk) {
      showToast("error", "Hatalı E-posta", "Geçerli bir e-posta giriniz!");
      return;
    }

    try {
      setResetLoading(true);

      // ✅ Reset sonrası bizim sayfaya "done=1" ile dönsün
      const baseUrl = process.env.REACT_APP_PASSWORD_RESET_URL || "http://localhost:3000/SifreYenile";
      const resetUrl = baseUrl.includes("?") ? `${baseUrl}&done=1` : `${baseUrl}?done=1`;

      const actionCodeSettings = {
        url: resetUrl,
        handleCodeInApp: true,
      };

      // ✅ reset isteyen email’i sakla (SifreYenile sayfasında kullanacağız)
      localStorage.setItem("pendingResetEmail", emailCandidate);

      await sendPasswordResetEmail(auth, emailCandidate, actionCodeSettings);

      showToast(
        "success",
        "Link Gönderildi ✅",
        "Şifre yenileme bağlantısı e-postana gönderildi.",
        2500
      );
      closeResetModal();
    } catch (err) {
      console.log("Password reset hata:", err);
      const code = err?.code || "";

      if (code.includes("auth/user-not-found")) {
        showToast("error", "Kayıt Bulunamadı", "Bu e-posta ile kayıt bulunamadı.");
      } else if (code.includes("auth/invalid-email")) {
        showToast("error", "Hatalı E-posta", "E-posta geçersiz!");
      } else if (code.includes("auth/too-many-requests")) {
        showToast("error", "Çok Fazla Deneme", "Bir süre sonra tekrar deneyin.");
      } else {
        showToast("error", "Hata", "Şifre yenileme sırasında hata oluştu.");
      }
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailCandidate = trim(formData.ogrenciNo).toLowerCase();

    if (!emailCandidate) {
      showToast("error", "Eksik Bilgi", "E-posta gerekli!");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate);
    if (!emailOk) {
      showToast("error", "Hatalı E-posta", "Geçerli bir e-posta giriniz!");
      return;
    }

    if (formData.sifre.length < 6) {
      showToast("error", "Hatalı Şifre", "Şifre en az 6 karakter olmalı!");
      return;
    }

    const y = trim(formData.egitimYili);

    try {
      const cred = await signInWithEmailAndPassword(auth, emailCandidate, formData.sifre);

      const studentsRef = collection(db, "students");
      const q = query(
        studentsRef,
        where("email", "==", emailCandidate),
        where("egitimYili", "==", y),
        limit(1)
      );

      const qs = await getDocs(q);

      if (qs.empty) {
        showToast(
          "error",
          "Kayıt Bulunamadı",
          "Bu e-posta için seçilen eğitim yılında öğrenci kaydı bulunamadı.",
          2500
        );
        return;
      }

      const studentDoc = qs.docs[0];
      const studentId = studentDoc.id;

      localStorage.setItem("activeStudentId", studentId);
      localStorage.setItem("activeUid", cred.user.uid);

      await setDoc(doc(db, "students", studentId), { lastLoginAt: serverTimestamp() }, { merge: true });

      showToast("success", "Giriş Başarılı ✅", "Öğrenci paneline yönlendiriliyorsun...", 2500);
      setTimeout(() => navigate("/OgrenciDashboard"), 600);
    } catch (err) {
      console.log("Öğrenci giriş hata:", err);
      const code = err?.code || "";

      if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
        showToast("error", "Şifre Hatalı", "Şifreni kontrol edip tekrar dene.");
      } else if (code.includes("auth/user-not-found")) {
        showToast("error", "Kayıt Bulunamadı", "Bu e-posta ile kayıt bulunamadı.");
      } else if (code.includes("auth/too-many-requests")) {
        showToast("error", "Çok Fazla Deneme", "Bir süre sonra tekrar deneyin.");
      } else if (code.includes("permission-denied")) {
        showToast("error", "İzin Hatası", "Firestore izni yok (rules).", 2500);
      } else if (code.includes("auth/invalid-email")) {
        showToast("error", "Hatalı E-posta", "E-posta geçersiz!");
      } else {
        showToast("error", "Hata", "Giriş sırasında hata oluştu.");
      }
    }
  };

  const toastTheme = {
    success: {
      ring: "border-yellow-500/40",
      badge: "bg-yellow-500",
      title: "text-white",
      msg: "text-gray-200"
    },
    error: {
      ring: "border-red-500/40",
      badge: "bg-red-500",
      title: "text-white",
      msg: "text-gray-200"
    },
    info: {
      ring: "border-blue-500/40",
      badge: "bg-blue-500",
      title: "text-white",
      msg: "text-gray-200"
    }
  };

  const t = toastTheme[toast.type] || toastTheme.info;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* ✅ TOAST */}
      {toast.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <div className={`bg-gray-900/90 backdrop-blur-md border ${t.ring} rounded-2xl shadow-xl px-5 py-4`}>
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-2 ${t.badge}`} />
              <div className="flex-1">
                <div className={`font-bold ${t.title}`}>{toast.title}</div>
                {toast.message && (
                  <div className={`text-sm mt-1 ${t.msg}`}>{toast.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🌙 Öğrenci Girişi</h1>
            <p className="text-gray-300">E-posta ve şifren ile giriş yap</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-blue-400" />
                  EĞİTİM YILI *
                </label>
                <select
                  name="egitimYili"
                  value={formData.egitimYili}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-blue-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                >
                  {egitimYillari.map(yil => (
                    <option key={yil} value={yil}>{yil} Eğitim Yılı</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <FaIdCard className="inline mr-2 text-yellow-400" />
                  E-POSTA *
                </label>
                <input
                  type="email"
                  name="ogrenciNo"
                  value={formData.ogrenciNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-yellow-500/50 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-lg font-bold"
                  placeholder="ornek@eposta.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  ŞİFRE * (min 6 karakter)
                </label>
                <input
                  type="password"
                  name="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95"
              >
                🔐 GİRİŞ YAP
              </button>
            </form>

            <div className="mt-8 space-y-4 text-center">
              <p className="text-gray-400">
                Hesabın yok mu?{' '}
                <Link to="/OgrenciKayit" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
                  Kayıt Ol
                </Link>
              </p>

              <p className="text-gray-400 text-sm">
                Şifreni mi unuttun?{' '}
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                >
                  Şifremi Unuttum
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Ay Günlüğü</p>
        </div>
      </footer>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeResetModal} />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-2">🔐 Şifre Yenileme</h3>
            <p className="text-gray-300 mb-5">
              E-postanı yaz. Şifre yenileme bağlantısı gönderelim.
            </p>

            <label className="block text-gray-300 mb-2">E-POSTA *</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="ornek@eposta.com"
              required
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeResetModal}
                className="w-1/2 py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-all"
                disabled={resetLoading}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-1/2 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                disabled={resetLoading}
              >
                {resetLoading ? "Gönderiliyor..." : "Link Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OgrenciGiris;
