import React, { useState } from 'react';
import { FaIdCard, FaLock, FaArrowLeft, FaMoon, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";

function OgrenciGiris() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ogrenciNo: '',
    sifre: '',
    egitimYili: '2026-2027'
  });

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: ""
  });

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

      const baseUrl = process.env.REACT_APP_PASSWORD_RESET_URL || "http://localhost:3000/SifreYenile";
      const resetUrl = baseUrl.includes("?") ? `${baseUrl}&done=1` : `${baseUrl}?done=1`;

      const actionCodeSettings = {
        url: resetUrl,
        handleCodeInApp: true,
      };

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
      {/* ✅ TOAST - RESPONSIVE */}
      {toast.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <div className={`bg-gray-900/90 backdrop-blur-md border ${t.ring} rounded-xl lg:rounded-2xl shadow-xl px-4 lg:px-5 py-3 lg:py-4`}>
            <div className="flex items-start gap-2 lg:gap-3">
              <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full mt-1 lg:mt-2 ${t.badge}`} />
              <div className="flex-1">
                <div className={`font-bold text-sm lg:text-base ${t.title}`}>{toast.title}</div>
                {toast.message && (
                  <div className={`text-xs lg:text-sm mt-1 ${t.msg}`}>{toast.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER - RESPONSIVE */}
      <header className="py-4 lg:py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-lg lg:text-xl" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">Ay Günlüğü</h1>
            </div>
            <Link
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-3 lg:px-4 py-2 hover:bg-gray-800 rounded-lg text-sm lg:text-base min-h-[44px]"
            >
              <FaArrowLeft className="mr-1 lg:mr-2 text-sm lg:text-base" />
              <span className="hidden lg:inline">Ana Sayfaya Dön</span>
              <span className="lg:hidden">Ana Sayfa</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - RESPONSIVE */}
      <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">🌙 Öğrenci Girişi</h1>
            <p className="text-gray-300 text-sm lg:text-base">E-posta ve şifren ile giriş yap</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-gray-300 mb-1 lg:mb-2 text-sm lg:text-base">
                  <FaCalendarAlt className="inline mr-1 lg:mr-2 text-blue-400 text-sm lg:text-base" />
                  EĞİTİM YILI *
                </label>
                <select
                  name="egitimYili"
                  value={formData.egitimYili}
                  onChange={handleChange}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-900 border border-blue-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-sm lg:text-base"
                  required
                >
                  {egitimYillari.map(yil => (
                    <option key={yil} value={yil}>{yil} Eğitim Yılı</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 lg:mb-2 text-sm lg:text-base">
                  <FaIdCard className="inline mr-1 lg:mr-2 text-yellow-400 text-sm lg:text-base" />
                  E-POSTA *
                </label>
                <input
                  type="email"
                  name="ogrenciNo"
                  value={formData.ogrenciNo}
                  onChange={handleChange}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-900 border-2 border-yellow-500/50 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm lg:text-base font-bold"
                  placeholder="ornek@eposta.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 lg:mb-2 text-sm lg:text-base">
                  <FaLock className="inline mr-1 lg:mr-2 text-sm lg:text-base" />
                  ŞİFRE * (min 6 karakter)
                </label>
                <input
                  type="password"
                  name="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm lg:text-base"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>

              {/* ✅ GİRİŞ BUTONU - MOBILE FRIENDLY */}
              <button
                type="submit"
                className="w-full py-3 lg:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95 text-sm lg:text-base min-h-[50px] lg:min-h-[60px]"
              >
                🔐 GİRİŞ YAP
              </button>
            </form>

            {/* ✅ BOTTOM LINKS - RESPONSIVE */}
            <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4 text-center">
              <p className="text-gray-400 text-sm lg:text-base">
                Hesabın yok mu?{' '}
                <Link to="/OgrenciKayit" className="text-yellow-400 hover:text-yellow-300 font-semibold underline text-sm lg:text-base">
                  Kayıt Ol
                </Link>
              </p>

              {/* ✅ ŞİFREMİ UNUTTUM BUTONU - FIXED! */}
              <div className="pt-2 border-t border-gray-700">
                <button
                  type="button"
                  onClick={openResetModal}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center text-sm lg:text-base min-h-[44px]"
                  aria-label="Şifremi unuttum"
                >
                  <FaEnvelope className="mr-2 text-sm lg:text-base" />
                  Şifremi Unuttum
                </button>
                <p className="text-gray-500 text-xs mt-1 lg:mt-2">
                  Şifreni mi unuttun? Yukarıdaki butona tıkla
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER - RESPONSIVE */}
      <footer className="py-4 lg:py-8 border-t border-gray-800 mt-6 lg:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm lg:text-base">© {new Date().getFullYear()} Ay Günlüğü</p>
        </div>
      </footer>

      {/* ✅ MODAL - RESPONSIVE */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeResetModal} />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl mx-2">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">🔐 Şifre Yenileme</h3>
            <p className="text-gray-300 text-sm lg:text-base mb-4 lg:mb-5">
              E-postanı yaz. Şifre yenileme bağlantısı gönderelim.
            </p>

            <label className="block text-gray-300 mb-1 lg:mb-2 text-sm lg:text-base">E-POSTA *</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm lg:text-base"
              placeholder="ornek@eposta.com"
              required
            />

            <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row gap-2 lg:gap-3">
              <button
                type="button"
                onClick={closeResetModal}
                className="w-full sm:w-1/2 py-2 lg:py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base min-h-[44px]"
                disabled={resetLoading}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full sm:w-1/2 py-2 lg:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm lg:text-base min-h-[44px]"
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