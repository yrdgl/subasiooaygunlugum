import React, { useState } from 'react';
import {
  FaUser, FaLock, FaIdCard,
  FaSchool, FaMoon, FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase"; // yol farklıysa sadece bunu düzelt: "../lib/firebase"

function OgrenciKayit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    sinif: '5',
    sube: 'A',
    ogrenciNo: '',
    egitimYili: '2026-2027',
    sifre: '',
    sifreTekrar: '',
    okulKayitKodu: '' // ✅ Okul kayıt kodu
  });

  const siniflar = ['5']; // SADECE 5. SINIF
  const subeler = ['A', 'B'];
  const egitimYillari = ['2025-2026', '2026-2027', '2027-2028'];

  // ✅ Toast state (alert yerine)
  const [toast, setToast] = useState({
    open: false,
    type: "info", // "success" | "error" | "info"
    title: "",
    message: ""
  });

  const showToast = (type, title, message, durationMs = 2200) => {
    setToast({ open: true, type, title, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }));
    }, durationMs);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const trim = (s) => (s || "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (trim(formData.ad) === '' || trim(formData.soyad) === '') {
      showToast("error", "Eksik Bilgi", "Ad ve soyad alanları zorunludur!");
      return;
    }

    if (!trim(formData.email)) {
      showToast("error", "Eksik Bilgi", "E-posta zorunludur!");
      return;
    }

    const emailCandidate = trim(formData.email).toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate);
    if (!emailOk) {
      showToast("error", "Hatalı E-posta", "Geçerli bir e-posta giriniz!");
      return;
    }

    // ✅ Okul kayıt kodu kontrolü (front-end)
    const expectedCode = trim(process.env.REACT_APP_SCHOOL_REGISTER_CODE || "");
    const enteredCode = trim(formData.okulKayitKodu);

    if (!expectedCode) {
      showToast("error", "Sistem Hatası", "Okul kayıt kodu tanımlı değil (.env).");
      return;
    }
    if (!enteredCode) {
      showToast("error", "Eksik Bilgi", "Okul Kayıt Kodu zorunludur!");
      return;
    }
    if (enteredCode !== expectedCode) {
      showToast("error", "Kod Hatalı", "Okul Kayıt Kodu yanlış!");
      return;
    }

    if (!trim(formData.ogrenciNo)) {
      showToast("error", "Eksik Bilgi", "Öğrenci numarası zorunludur!");
      return;
    }

    if (!/^\d+$/.test(trim(formData.ogrenciNo))) {
      showToast("error", "Hatalı Bilgi", "Öğrenci numarası sadece rakamlardan oluşmalıdır!");
      return;
    }

    if (formData.sifre.length < 6) {
      showToast("error", "Hatalı Şifre", "Şifre en az 6 karakter olmalıdır!");
      return;
    }

    if (formData.sifre !== formData.sifreTekrar) {
      showToast("error", "Şifre Uyuşmuyor", "Şifreler eşleşmiyor!");
      return;
    }

    try {
      // ✅ Öğrenci ID: egitimYili + ogrenciNo
      const y = trim(formData.egitimYili);
      const no = onlyDigits(formData.ogrenciNo);
      const studentId = `${y}_${no}`;

      // ✅ Auth: GERÇEK e-posta
      const realEmail = emailCandidate;

      // ✅ Auth kullanıcı oluştur
      const cred = await createUserWithEmailAndPassword(auth, realEmail, formData.sifre);

      // ✅ Firestore öğrenci belgesi oluştur (studentId ile)
      const studentRef = doc(db, "students", studentId);

      await setDoc(studentRef, {
        uid: cred.user.uid,
        studentId,
        ad: trim(formData.ad),
        soyad: trim(formData.soyad),
        email: realEmail,
        sinif: formData.sinif,
        sube: formData.sube,
        ogrenciNo: no,
        egitimYili: y,
        role: "student",
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("activeStudentId", studentId);

      // ✅ Alert yok: toast + otomatik yönlendirme
      showToast("success", "Kayıt Başarılı ✅", "Öğrenci paneline yönlendiriliyorsun...", 1800);

      setTimeout(() => {
        navigate('/OgrenciDashboard');
      }, 650);

    } catch (err) {
      const code = err?.code || "";
      if (code.includes("permission-denied")) {
        showToast("error", "Kayıt Başarısız", "Firestore izni yok (rules).");
      } else if (code.includes("email-already-in-use")) {
        showToast("error", "Bu E-posta Kullanılıyor", "Bu e-posta ile daha önce kayıt olunmuş!");
      } else if (code.includes("weak-password")) {
        showToast("error", "Şifre Zayıf", "Şifre çok zayıf (en az 6 karakter).");
      } else if (code.includes("auth/invalid-email")) {
        showToast("error", "E-posta Geçersiz", "E-posta geçersiz!");
      } else {
        showToast("error", "Kayıt Başarısız", "Kayıt başarısız! Lütfen tekrar deneyin.");
      }
      console.error(err);
    }
  };

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

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌙 Öğrenci Kayıt Formu
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ay gözlem günlüğüne katılmak için bilgilerini gir.
              Öğrenci numaran ile giriş yapabileceksin.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sol: Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaUser className="mr-3 text-yellow-400" />
                  Öğrenci Bilgileri
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ad Soyad */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Ad *
                      </label>
                      <input
                        type="text"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Ad"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Soyad *
                      </label>
                      <input
                        type="text"
                        name="soyad"
                        value={formData.soyad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Soyad"
                        required
                      />
                    </div>
                  </div>

                  {/* Sınıf/Şube */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Sınıf *
                      </label>
                      <select
                        name="sinif"
                        value={formData.sinif}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        required
                        disabled
                      >
                        {siniflar.map(sinif => (
                          <option key={sinif} value={sinif}>
                            {sinif}. Sınıf
                          </option>
                        ))}
                      </select>
                      <p className="text-gray-400 text-sm mt-1">
                        Bu site sadece 5. sınıflar için
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaSchool className="inline mr-2" />
                        Şube *
                      </label>
                      <select
                        name="sube"
                        value={formData.sube}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        required
                      >
                        {subeler.map(sub => (
                          <option key={sub} value={sub}>
                            {sub} Şubesi
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Eğitim Yılı */}
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
                        <option key={yil} value={yil}>
                          {yil} Eğitim Yılı
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-400 text-sm mt-1">
                      Hangi yılın 5. sınıf öğrencisisiniz?
                    </p>
                  </div>

                  {/* ✅ Okul Kayıt Kodu */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaSchool className="inline mr-2 text-purple-400" />
                      OKUL KAYIT KODU *
                    </label>
                    <input
                      type="text"
                      name="okulKayitKodu"
                      value={formData.okulKayitKodu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Öğretmeninden al"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      <span className="text-purple-300">🏫 Güvenlik:</span> Sadece okul kodunu bilenler kayıt olabilir.
                    </p>
                  </div>

                  {/* E-posta */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-2 text-green-400" />
                      E-POSTA *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="ornek@eposta.com"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      <span className="text-green-300">🔐 Şifre hatırlama:</span> Şifreni unutursan bu e-postaya link gönderilecek.
                    </p>
                  </div>

                  {/* Öğrenci No */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <FaIdCard className="inline mr-2 text-yellow-400" />
                      ÖĞRENCİ NUMARASI *
                    </label>
                    <input
                      type="text"
                      name="ogrenciNo"
                      value={formData.ogrenciNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-yellow-500/50 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-lg font-bold"
                      placeholder="(sadece rakam)"
                      required
                      pattern="\d+"
                      title="Sadece rakam giriniz"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      <span className="text-yellow-300">⚠️ Önemli:</span> Bu numara ile giriş yapacaksın. Öğretmeninden al!
                    </p>
                  </div>

                  {/* Şifre */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre * (min 6 karakter)
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

                    <div>
                      <label className="block text-gray-300 mb-2">
                        <FaLock className="inline mr-2" />
                        Şifre Tekrar *
                      </label>
                      <input
                        type="password"
                        name="sifreTekrar"
                        value={formData.sifreTekrar}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Kayıt Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                      🌙 KAYIT OL VE AY GÜNLÜĞÜNE BAŞLA
                    </button>
                  </div>

                  {/* Zaten hesabın varsa */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Zaten hesabın var mı?{' '}
                      <Link
                        to="/OgrenciGiris"
                        className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                      >
                        Giriş Yap
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sağ: Bilgilendirme */}
            <div className="space-y-6">
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-3">🔐 Giriş Sistemi</h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-yellow-400 mr-2 mt-1">🔢</span>
                    <span><strong>Öğrenci No + Şifre:</strong> Giriş yapmak için</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">📅</span>
                    <span><strong>Eğitim Yılı:</strong> Her yıl yeni kayıt</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span><strong>Öğretmeninden al:</strong> Özel öğrenci numarası</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-3">📅 Eğitim Yılı Sistemi</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center"><span className="text-blue-400 mr-2">🎯</span>Sadece 5. sınıflar kullanır</p>
                  <p className="flex items-center"><span className="text-blue-400 mr-2">🔄</span>Her yıl yeni öğrenciler kayıt olur</p>
                  <p className="flex items-center"><span className="text-blue-400 mr-2">📚</span>Eski kayıtlar arşivlenir</p>
                  <p className="flex items-center"><span className="text-blue-400 mr-2">👨‍🏫</span>Öğretmen tüm yılları görür</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Ay Günlüğü - 5. Sınıflar Özel
          </p>
<p className="text-gray-400 text-sm mt-2 font-medium">Created by Candemir Yurdagül</p>
          <p className="text-gray-500 text-sm mt-2">
            Bu platform 5. sınıf öğrencilerinin astronomi gözlemlerini kaydetmesi için tasarlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OgrenciKayit;
