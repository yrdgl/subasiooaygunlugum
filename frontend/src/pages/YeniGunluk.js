// src/pages/YeniGunluk.js - TAM DÜZENLENMİŞ HAMBURGER MENÜLÜ VERSİYON
import React, { useState, useEffect } from 'react';
import {
  FaMoon, FaCalendarAlt,
  FaArrowLeft, FaSave, FaLock, FaBars, FaTimes,
  FaHome, FaInfoCircle, FaStar, FaCalendarDay
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  doc,
  updateDoc
} from "firebase/firestore";

function YeniGunluk() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUrlDate = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('date');
  };

  const getTodayDate = () => {
    const urlDate = getUrlDate();
    if (urlDate) return urlDate;
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  };

  const [formData, setFormData] = useState({
    tarih: getTodayDate(),
    ayEvresi: '',
    gozlem: ''
  });

  const [karakterSayisi, setKarakterSayisi] = useState(0);
  const [saving, setSaving] = useState(false);
  const [existingDocId, setExistingDocId] = useState(null);
  const [tarihKilitli, setTarihKilitli] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: ""
  });

  const showToast = (type, title, message, durationMs = 1800) => {
    setToast({ open: true, type, title, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }));
    }, durationMs);
  };

  useEffect(() => {
    const urlDate = getUrlDate();
    if (urlDate) {
      setFormData(prev => ({ ...prev, tarih: urlDate }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const ayEvreleri = [
    { emoji: '🌑', ad: 'Yeni Ay', deger: 'yeni' },
    { emoji: '🌒', ad: 'Hilal', deger: 'hilal' },
    { emoji: '🌓', ad: 'İlk Dördün', deger: 'ilk-dordun' },
    { emoji: '🌔', ad: 'Şişkin Ay', deger: 'siskin' },
    { emoji: '🌕', ad: 'Dolunay', deger: 'dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay', deger: 'siskin-son' },
    { emoji: '🌗', ad: 'Son Dördün', deger: 'son-dordun' },
    { emoji: '🌘', ad: 'Hilal', deger: 'hilal-son' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'gozlem') setKarakterSayisi(value.length);
  };

  const getStudentId = () => {
    return (
      localStorage.getItem("activeStudentId") ||
      localStorage.getItem("studentId") ||
      localStorage.getItem("activeStudent") ||
      ""
    );
  };

  useEffect(() => {
    const loadExistingForDate = async () => {
      const studentId = getStudentId();
      if (!studentId) return;
      const tarihISO = formData.tarih;
      try {
        const colRef = collection(db, "gunlukler", studentId, "items");
        const qRef = query(colRef, where("dateString", "==", tarihISO), limit(1));
        const snap = await getDocs(qRef);
        if (snap.empty) {
          setExistingDocId(null);
          setTarihKilitli(false);
          setFormData(prev => ({ ...prev, ayEvresi: '', gozlem: '' }));
          setKarakterSayisi(0);
          return;
        }
        const d = snap.docs[0];
        const data = d.data();
        setExistingDocId(d.id);
        const yildiz = Number(data.ogretmenYildizi || 0);
        const kilitli = yildiz > 0;
        setTarihKilitli(kilitli);
        if (kilitli) {
          showToast(
            "error",
            "Tarih Kilitli 🔒",
            `Bu tarihte ${yildiz} yıldızlı günlük var. Yeni günlük yazamazsınız, ancak mevcut günlüğü düzenleyebilirsiniz.`,
            4000
          );
        }
        setFormData(prev => ({
          ...prev,
          ayEvresi: data?.ayEvresiDeger || prev.ayEvresi || "",
          gozlem: data?.gozlem || ""
        }));
        setKarakterSayisi((data?.gozlem || "").length);
      } catch (e) {
        console.log("Mevcut günlük yüklenemedi:", e);
        setTarihKilitli(false);
      }
    };
    loadExistingForDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.tarih]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tarihKilitli) {
      showToast(
        "error",
        "Kayıt Engellendi 🔒",
        "Bu tarihte öğretmen tarafından yıldız verilmiş bir günlük var. Yeni günlük yazamazsınız."
      );
      return;
    }
    if (!formData.ayEvresi) {
      showToast("error", "Eksik Bilgi", "Lütfen ayın evresini seçin!");
      return;
    }
    const studentId = getStudentId();
    if (!studentId) {
      showToast("error", "Oturum Bulunamadı", "Lütfen tekrar giriş yap.");
      setTimeout(() => navigate("/OgrenciGiris"), 900);
      return;
    }
    const secilenAyEvresi = ayEvreleri.find(ev => ev.deger === formData.ayEvresi);
    const tarihISO = formData.tarih;
    const gunlukDoc = {
      studentId,
      tarihISO,
      dateString: tarihISO,
      tarih: formatDisplayDate(tarihISO),
      ayEvresiDeger: formData.ayEvresi,
      ayEvresi: secilenAyEvresi?.emoji || '🌑',
      ayEvresiAd: secilenAyEvresi?.ad || 'Yeni Ay',
      gozlem: (formData.gozlem || '').trim(),
      updatedAt: serverTimestamp(),
      ogretmenYildizi: 0,
      ogretmenYorumu: "",
      yildizVerilmeTarihi: null
    };
    try {
      setSaving(true);
      const colRef = collection(db, "gunlukler", studentId, "items");
      const qRef = query(colRef, where("dateString", "==", tarihISO), limit(1));
      const snap = await getDocs(qRef);
      if (!snap.empty) {
        const existingData = snap.docs[0].data() || {};
        const existingYildiz = Number(existingData.ogretmenYildizi || 0);
        if (existingYildiz > 0) {
          showToast(
            "info",
            "Güncelleme Modu",
            "Bu günlük yıldız aldığı için güncelleniyor. Yıldız bilgisi korunacak."
          );
        }
        const existingId = snap.docs[0].id;
        const prevData = existingData;
        await updateDoc(doc(db, "gunlukler", studentId, "items", existingId), {
          ...gunlukDoc,
          createdAt: prevData.createdAt || serverTimestamp(),
          ogretmenYildizi: prevData.ogretmenYildizi ?? 0,
          ogretmenYorumu: prevData.ogretmenYorumu ?? "",
          yildizVerilmeTarihi: prevData.yildizVerilmeTarihi ?? null
        });
        setExistingDocId(existingId);
        showToast(
          "success",
          "Günlük Güncellendi ✅",
          `Tarih: ${formatDisplayDate(tarihISO)} • Ay: ${secilenAyEvresi?.ad || ""}`,
          3000
        );
      } else {
        if (tarihKilitli) {
          showToast(
            "error",
            "Kayıt Engellendi 🔒",
            "Bu tarihte yıldızlı günlük olduğu için yeni kayıt yapılamaz."
          );
          setSaving(false);
          return;
        }
        await addDoc(colRef, {
          ...gunlukDoc,
          createdAt: serverTimestamp()
        });
        setExistingDocId(null);
        showToast(
          "success",
          "Günlük Kaydedildi ✅",
          `Tarih: ${formatDisplayDate(tarihISO)} • Ay: ${secilenAyEvresi?.ad || ""}`,
          3000
        );
      }
      setTimeout(() => { navigate('/OgrenciDashboard'); }, 1500);
    } catch (err) {
      console.log("Günlük kaydedilemedi:", err);
      showToast("error", "Kayıt Başarısız ❌", "Günlük kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const toastTheme = {
    success: { ring: "border-yellow-500/40", badge: "bg-yellow-500", title: "text-white", msg: "text-gray-200" },
    error: { ring: "border-red-500/40", badge: "bg-red-500", title: "text-white", msg: "text-gray-200" },
    info: { ring: "border-blue-500/40", badge: "bg-blue-500", title: "text-white", msg: "text-gray-200" }
  };
  const t = toastTheme[toast.type] || toastTheme.info;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* ✅ MOBİL MENÜ BUTONU (3 ÇİZGİ) - SAĞ ÜSTTE */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-blue-900/80 backdrop-blur-sm flex items-center justify-center border border-blue-700 shadow-lg"
        aria-label="Menüyü aç/kapat"
      >
        {mobileMenuOpen ? <FaTimes className="text-xl text-white" /> : <FaBars className="text-xl text-white" />}
      </button>

      {/* ✅ MOBİL MENÜ OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <FaMoon className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Ay Günlüğü</h2>
                  <p className="text-gray-400 text-sm">Menü</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-2">
              <Link to="/OgrenciDashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/70">
                <FaHome className="text-yellow-400 text-lg" />
                <div className="flex-1">
                  <div className="text-white font-semibold">Dashboard'a Dön</div>
                  <div className="text-gray-400 text-sm">Ana sayfaya git</div>
                </div>
                <FaArrowLeft className="text-gray-400" />
              </Link>
              <button onClick={() => { setMobileMenuOpen(false); setMobileInfoOpen(true); }}
                className="flex items-center space-x-3 w-full p-4 bg-blue-900/30 rounded-xl border border-blue-700/50 hover:bg-blue-800/40">
                <FaInfoCircle className="text-blue-400 text-lg" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">İpuçları</div>
                  <div className="text-gray-400 text-sm">Yardım ve bilgiler</div>
                </div>
              </button>
              <Link to="/AyTakvimi" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-4 bg-purple-900/30 rounded-xl border border-purple-700/50 hover:bg-purple-800/40">
                <FaCalendarDay className="text-purple-400 text-lg" />
                <div className="flex-1">
                  <div className="text-white font-semibold">Ay Takvimi</div>
                  <div className="text-gray-400 text-sm">Tüm gözlemler</div>
                </div>
              </Link>
              <div className="flex items-center space-x-3 p-4 bg-yellow-900/30 rounded-xl border border-yellow-700/50">
                <FaStar className="text-yellow-400 text-lg" />
                <div className="flex-1">
                  <div className="text-white font-semibold">Yıldızlarım</div>
                  <div className="text-gray-400 text-sm">Öğretmen değerlendirmeleri</div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400 text-sm">⭐</span>))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-gray-800 rounded-lg text-white font-semibold">
                Menüyü Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TOAST */}
      {toast.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <div className={`bg-gray-900/90 backdrop-blur-md border ${t.ring} rounded-xl lg:rounded-2xl shadow-xl px-4 lg:px-5 py-3 lg:py-4`}>
            <div className="flex items-start gap-2 lg:gap-3">
              <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full mt-1 lg:mt-2 ${t.badge}`} />
              <div className="flex-1">
                <div className={`font-bold text-sm lg:text-base ${t.title}`}>{toast.title}</div>
                {toast.message && (<div className={`text-xs lg:text-sm mt-1 ${t.msg}`}>{toast.message}</div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ HEADER */}
      <header className="py-4 lg:py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-lg lg:text-xl" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">Ay Günlüğü</h1>
            </div>
            <div className="hidden lg:flex items-center">
              <Link to="/OgrenciDashboard" className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                <FaArrowLeft className="mr-2" /> Dashboard'a Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ ANA İÇERİK */}
      <main className="container mx-auto px-3 lg:px-4 py-4 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block mb-3 lg:mb-4"><div className="text-5xl lg:text-6xl animate-pulse">🌙</div></div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Yeni Ay Gözlemi</h1>
            <p className="text-gray-300 text-sm lg:text-base">
              Tarih: <span className="text-yellow-300 font-semibold">{formatDisplayDate(formData.tarih)}</span>
              {tarihKilitli && (<span className="ml-2 lg:ml-3 inline-flex items-center px-2 lg:px-3 py-1 rounded-full bg-red-900/40 text-red-300 text-xs lg:text-sm"><FaLock className="mr-1" size={10} /> Kilitli</span>)}
            </p>
          </div>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                  <div>
                    <label className="block text-gray-300 mb-2 lg:mb-3 text-base lg:text-lg font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-yellow-400 text-sm lg:text-base" /> Gözlem Tarihi
                      {tarihKilitli && (<span className="ml-2 inline-flex items-center px-1 lg:px-2 py-0.5 lg:py-1 rounded-full bg-red-900/40 text-red-300 text-xs"><FaLock className="mr-1" size={8} /> Kilitli</span>)}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <input type="date" name="tarih" value={formData.tarih} onChange={handleChange}
                        className={`w-full sm:flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-gray-900 border rounded-lg text-white focus:outline-none transition-colors text-sm lg:text-base ${
                          tarihKilitli ? 'border-red-700/60 cursor-not-allowed bg-gray-800/60' : 'border-gray-700 focus:border-yellow-500'
                        }`} required disabled={saving || tarihKilitli}
                        title={tarihKilitli ? "Bu tarihte yıldızlı günlük var. Yeni günlük yazamazsınız." : ""} />
                      <div className={`text-xs lg:text-sm px-3 py-2 rounded-lg whitespace-nowrap ${
                        tarihKilitli ? 'bg-red-900/30 text-red-300' : 'bg-gray-900/50 text-gray-400'
                      }`}>{tarihKilitli ? '🔒 Kilitli Tarih' : '📅 Tarih Seç'}</div>
                    </div>
                    <p className="text-gray-400 text-xs lg:text-sm mt-1 lg:mt-2">
                      Seçili tarih: <span className="text-yellow-300">{formatDisplayDate(formData.tarih)}</span>
                      {tarihKilitli && (<span className="ml-2 lg:ml-3 text-red-400 text-xs lg:text-sm">⚠️ Bu tarihte yıldızlı günlük var</span>)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 lg:mb-3 text-base lg:text-lg font-semibold">🌕 Ayın Evresi</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3">
                      {ayEvreleri.map((evre) => (<button key={evre.deger} type="button"
                        onClick={() => !saving && setFormData(prev => ({ ...prev, ayEvresi: evre.deger }))}
                        className={`p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 flex flex-col items-center justify-center transition-all min-h-[80px] lg:min-h-[100px] ${
                          formData.ayEvresi === evre.deger ? 'border-yellow-500 bg-yellow-500/10 scale-105' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'
                        } ${tarihKilitli && !existingDocId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={saving || (tarihKilitli && !existingDocId)}
                        title={tarihKilitli && !existingDocId ? "Bu tarih kilitli, yeni günlük yazamazsınız" : ""}>
                        <span className="text-2xl lg:text-3xl mb-1 lg:mb-2">{evre.emoji}</span>
                        <span className="text-xs text-gray-300 text-center leading-tight">{evre.ad}</span>
                      </button>))}
                    </div>
                    {formData.ayEvresi && (<div className="mt-3 p-2 lg:p-3 bg-gray-900/50 rounded-lg lg:rounded-lg border-l-4 border-yellow-500">
                      <p className="text-gray-300 text-sm lg:text-base">Seçilen: <span className="text-yellow-300 font-semibold">
                        {ayEvreleri.find(e => e.deger === formData.ayEvresi)?.emoji} {ayEvreleri.find(e => e.deger === formData.ayEvresi)?.ad}
                      </span></p>
                    </div>)}
                    {tarihKilitli && !existingDocId && (<div className="mt-3 p-2 lg:p-3 bg-red-900/20 rounded-lg lg:rounded-lg border-l-4 border-red-600">
                      <p className="text-red-300 text-xs lg:text-sm"><FaLock className="inline mr-1" size={10} />
                        Bu tarih kilitli. Mevcut günlüğü düzenleyebilirsiniz, ancak yeni günlük yazamazsınız.</p>
                    </div>)}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <label className="text-gray-300 text-base lg:text-lg font-semibold flex items-center">📝 Gözlem Notların (Opsiyonel)</label>
                      <div className={`text-xs lg:text-sm ${karakterSayisi > 0 ? 'text-blue-400' : 'text-gray-400'}`}>{karakterSayisi} karakter</div>
                    </div>
                    <textarea name="gozlem" value={formData.gozlem} onChange={handleChange}
                      className={`w-full h-40 lg:h-48 px-3 lg:px-4 py-2 lg:py-3 bg-gray-900 border rounded-lg text-white focus:outline-none transition-colors resize-none text-sm lg:text-base ${
                        tarihKilitli && !existingDocId ? 'border-gray-600 cursor-not-allowed bg-gray-800/60' : 'border-gray-700 focus:border-yellow-500'
                      }`} placeholder={tarihKilitli && !existingDocId 
                        ? "Bu tarih kilitli. Yeni günlük yazamazsınız." 
                        : "Gözlem notlarınızı yazın (zorunlu değil)..."
                      } disabled={saving || (tarihKilitli && !existingDocId)} />
                    <div className="flex flex-col sm:flex-row justify-between mt-2">
                      <p className="text-gray-400 text-xs lg:text-sm mb-1 sm:mb-0">Not yazmak istemezseniz boş bırakabilirsiniz</p>
                      <button type="button" onClick={() => {
                          if (saving || (tarihKilitli && !existingDocId)) return;
                          setFormData(prev => ({ ...prev, gozlem: '' }));
                          setKarakterSayisi(0);
                          showToast("info", "Temizlendi", "Gözlem notları temizlendi.");
                        }} className={`text-xs lg:text-sm ${tarihKilitli && !existingDocId ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                        disabled={saving || (tarihKilitli && !existingDocId)}>Temizle</button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" disabled={!formData.ayEvresi || saving || (tarihKilitli && !existingDocId)}
                      className={`w-full py-3 lg:py-4 text-white font-bold rounded-lg transition-all text-base lg:text-lg min-h-[50px] lg:min-h-[60px] ${
                        (!formData.ayEvresi || saving || (tarihKilitli && !existingDocId))
                          ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                      }`} title={tarihKilitli && !existingDocId ? "Bu tarih kilitli. Yeni günlük yazamazsınız." : ""}>
                      <FaSave className="inline mr-2 text-sm lg:text-base" />
                      {saving ? '⏳ Kaydediliyor...' : (tarihKilitli && !existingDocId
                        ? '🔒 TARİH KİLİTLİ' : (!formData.ayEvresi
                          ? '❌ Ay Evresi Seçilmedi' : (existingDocId ? '✅ GÜNLÜĞÜ GÜNCELLE' : '✅ GÜNLÜĞÜ KAYDET')
                        )
                      )}
                    </button>
                    {tarihKilitli && !existingDocId && (<p className="text-red-400 text-xs lg:text-sm mt-2 text-center">
                      <FaLock className="inline mr-1" /> Bu tarihte {existingDocId ? 'mevcut' : 'yıldızlı'} günlük var. Yeni günlük yazamazsınız.</p>)}
                  </div>
                </form>
              </div>
            </div>
            <div className={`lg:block ${mobileInfoOpen ? 'fixed inset-0 z-30 bg-gray-900/95 backdrop-blur-sm' : 'hidden'}`}>
              <div className={`lg:relative lg:bg-transparent lg:backdrop-blur-none ${mobileInfoOpen ? 'h-full overflow-y-auto p-4' : ''}`}>
                {mobileInfoOpen && (<button onClick={() => setMobileInfoOpen(false)} className="lg:hidden absolute top-4 right-4 text-white text-xl">✕</button>)}
                <div className={`space-y-4 lg:space-y-6 ${mobileInfoOpen ? 'pt-10' : ''}`}>
                  <div className="bg-blue-900/30 rounded-xl p-4 lg:p-6 border border-blue-700/50">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-3">💡 İpuçları</h3>
                    <ul className="space-y-2 lg:space-y-3">
                      <li className="flex items-start text-gray-300"><span className="text-green-400 mr-2 mt-0.5 lg:mt-1 text-xs lg:text-sm">✓</span><span className="text-xs lg:text-sm">Ayı net görebildin mi?</span></li>
                      <li className="flex items-start text-gray-300"><span className="text-green-400 mr-2 mt-0.5 lg:mt-1 text-xs lg:text-sm">✓</span><span className="text-xs lg:text-sm">Parlaklığı nasıldı?</span></li>
                      <li className="flex items-start text-gray-300"><span className="text-green-400 mr-2 mt-0.5 lg:mt-1 text-xs lg:text-sm">✓</span><span className="text-xs lg:text-sm">Bulutlar görüşü engelledi mi?</span></li>
                      <li className="flex items-start text-gray-300"><span className="text-green-400 mr-2 mt-0.5 lg:mt-1 text-xs lg:text-sm">✓</span><span className="text-xs lg:text-sm">Hangi renkte göründü?</span></li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/30 rounded-xl p-4 lg:p-6 border border-yellow-700/50">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-3">⭐ Yıldız Kazanma</h3>
                    <p className="text-gray-300 text-xs lg:text-sm mb-2 lg:mb-3">Günlüğünü kaydettikten sonra öğretmenin günlüğünü okuyacak ve yıldız verecek.</p>
                    <div className="text-center"><div className="inline-flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400 text-xl lg:text-2xl">⭐</span>))}
                    </div><p className="text-gray-400 text-xs mt-1 lg:mt-2">1-5 arası yıldız alabilirsin</p></div>
                    {tarihKilitli && (<div className="mt-3 p-2 lg:p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                      <p className="text-red-300 text-xs lg:text-sm"><FaLock className="inline mr-1" size={10} />
                        <strong>Kilitli Tarih:</strong> Bu tarihte yıldızlı günlük var. Yeni günlük yazamazsınız, ancak mevcut günlüğü düzenleyebilirsiniz.</p>
                    </div>)}
                  </div>
                  {mobileInfoOpen && (<div className="bg-green-900/30 rounded-xl p-4 border border-green-700/50">
                    <h3 className="text-lg font-bold text-white mb-2">📱 Mobil Kullanım</h3>
                    <p className="text-gray-300 text-xs mb-2">• Ay evresini kolayca seçmek için butonlara tıklayın</p>
                    <p className="text-gray-300 text-xs mb-2">• Klavyeyi kapatmak için dokunmatik ekranın boş bir alanına dokunun</p>
                    <p className="text-gray-300 text-xs">• Formu doldurduktan sonra en alttaki büyük butona tıklayın</p>
                  </div>)}
                </div>
                {mobileInfoOpen && (<button onClick={() => setMobileInfoOpen(false)} className="lg:hidden w-full mt-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-white font-semibold">Forma Dön</button>)}
              </div>
            </div>
            <div className="lg:hidden mt-4">
              <button onClick={() => setMobileInfoOpen(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white font-semibold flex items-center justify-center">
                💡 İpuçları ve Bilgileri Göster
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ FOOTER */}
      <footer className="py-4 lg:py-8 border-t border-gray-800 mt-6 lg:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm lg:text-base">
            © 2026 Ay Günlüğü - Yeni Gözlem Kaydı          </p>
<p className="text-gray-400 text-sm mt-2 font-medium">Created by Candemir Yurdagül</p>
          <p className="text-gray-500 text-xs lg:text-sm mt-1 lg:mt-2">
            Her akşam gökyüzüne bak ve ay gözlemlerini kaydet!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default YeniGunluk;