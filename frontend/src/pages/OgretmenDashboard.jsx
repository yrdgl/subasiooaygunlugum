import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Firebase imports
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";

function OgretmenDashboard() {
  const navigate = useNavigate();

  // ✅ KİLİT: Öğretmen giriş kontrolü
  useEffect(() => {
    const checkTeacherAuth = async () => {
      try {
        // Firebase auth durumunu kontrol et
        const user = auth.currentUser;
        const teacherEmail = localStorage.getItem("teacherEmail");
        
        if (!user || !teacherEmail || user.email !== teacherEmail) {
          navigate('/OgretmenGiris');
          return;
        }
        
        // Firestore'dan öğretmen kontrolü
        const teacherDoc = await getDoc(doc(db, "teachers", user.email));
        
        if (!teacherDoc.exists() || teacherDoc.data().role !== "teacher") {
          await auth.signOut();
          localStorage.clear();
          navigate('/OgretmenGiris');
          return;
        }
        
      } catch (err) {
        console.error("Auth kontrol hatası:", err);
        navigate('/OgretmenGiris');
      }
    };
    
    checkTeacherAuth();
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Çıkış hatası:", err);
    }
    localStorage.removeItem('isTeacher');
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('teacherLoginTime');
    navigate('/OgretmenGiris');
  };

  // ✅ Firestore'dan dolacak
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);

  const [seciliSinif, setSeciliSinif] = useState('Tümü');
  const [seciliEgitimYili, setSeciliEgitimYili] = useState('2025-2026');
  const [seciliOgrenci, setSeciliOgrenci] = useState(null);

  // 🔥 Seçili öğrencinin günlükleri
  const [gunlukler, setGunlukler] = useState([]);

  // ✅ Toast state (alert yerine)
  const [toast, setToast] = useState({
    open: false,
    type: "info", // "success" | "error" | "info"
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

  const egitimYillari = ['Tümü', '2025-2026', '2026-2027', '2027-2028'];
  const siniflar = ['Tümü', '5-A', '5-B'];
  const currentEgitimYili = "2025-2026";

  // ✅ Students çek
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "students"));

        const list = snap.docs.map((d) => {
          const data = d.data() || {};
          const id = d.id;

          // id formatı bazen "2025-2026_12345" olabilir, bazen uid olabilir.
          // Biz yine de adı/soyadı/sınıfı data içinden gösteriyoruz.
          const parts = (id || "").split("_");
          const egitimYili = data.egitimYili || parts[0] || "";
          const ogrenciNo = data.ogrenciNo || parts[1] || "";

          const ad = (data.ad || data.isim || "").trim();
          const soyad = (data.soyad || "").trim();
          const fullName = `${ad} ${soyad}`.trim() || "-";

          const sinif = (data.sinif || "").toString().trim();
          const sube = (data.sube || "").toString().trim();
          const sinifGosterim =
            (sinif && sube) ? `${sinif}-${sube}` :
            (sinif ? `${sinif}` : (data.sinifGosterim || "-"));

          const durum = egitimYili === currentEgitimYili ? "Aktif" : "Gelecek";

          return {
            id,
            ad: fullName,
            sinif: sinifGosterim,
            egitimYili: egitimYili || "-",
            ogrenciNo: ogrenciNo || "-",
            durum,
            avatar: data.avatar || "👤",

            // ⚠️ Bu alan güncel olmayabilir; bu yüzden BUTON KİLİDİNDE KULLANMIYORUZ
            gunlukSayisi: Number(data.gunlukSayisi || 0),
          };
        });

        setOgrenciler(list);
      } catch (err) {
        console.log("Öğrenciler okunamadı:", err);
        showToast("error", "Yükleme Hatası", "Öğrenci listesi yüklenemedi. (Firestore izinleri / rules)");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrelenmisOgrenciler = useMemo(() => {
    return ogrenciler.filter(ogrenci => {
      const sinifUygun = seciliSinif === 'Tümü' || ogrenci.sinif === seciliSinif;
      const yilUygun = seciliEgitimYili === 'Tümü' || ogrenci.egitimYili === seciliEgitimYili;
      return sinifUygun && yilUygun;
    });
  }, [ogrenciler, seciliSinif, seciliEgitimYili]);

  // ✅ Seçili öğrenci değişince: günlükleri Firestore'dan çek
  useEffect(() => {
    const loadJournalsOfStudent = async () => {
      if (!seciliOgrenci?.id) {
        setGunlukler([]);
        return;
      }

      try {
        // 🔥 Sizin gerçek path: gunlukler/{studentId}/items
        // Tarih sıralaması: tarihISO varsa onunla; yoksa dateString ile de çalışır.
        // orderBy field yoksa hata alırsak düz getDocs'e düşeceğiz.
        let snap;
        try {
          const q = query(
            collection(db, "gunlukler", seciliOgrenci.id, "items"),
            orderBy("tarihISO", "desc")
          );
          snap = await getDocs(q);
        } catch (e) {
          // bazı projelerde orderBy yüzünden hata/izin olabiliyor; o yüzden fallback
          snap = await getDocs(collection(db, "gunlukler", seciliOgrenci.id, "items"));
        }

        const list = snap.docs.map((d) => {
          const data = d.data() || {};

          const ayEmoji = data.ayEvresi || '🌑';
          const ayAd = data.ayEvresiAd || 'Yeni Ay';

          const tarihStr = data.tarih || "";
          const tarihISO = data.tarihISO || data.dateString || "";

          const ogretmenYildizi = Number(data.ogretmenYildizi || 0);

          return {
            id: d.id,
            ogrenciId: seciliOgrenci.id,

            baslik: `${ayEmoji} ${ayAd} Gözlemi`,
            tarih: tarihStr || tarihISO || "-",
            ayFazi: `${ayEmoji} ${ayAd}`,
            icerik: (data.gozlem || "").toString() || "Gözlem notu eklenmedi",

            // Ekranda kullanılan yıldız (öğrenci yıldızı gibi görünüyordu)
            // Biz öğretmen yıldızını gösteriyoruz:
            yildiz: ogretmenYildizi,

            ogretmenYildizi,
            ogretmenYildizVerildi: ogretmenYildizi > 0,

            ogretmenYorumu: data.ogretmenYorumu || "",
            yildizVerilmeTarihi: data.yildizVerilmeTarihi || null,
            tarihISO,
          };
        });

        setGunlukler(list);
      } catch (err) {
        console.log("Günlükler okunamadı:", err);
        showToast("error", "Yükleme Hatası", "Günlükler yüklenemedi. (Firestore izinleri / rules)");
        setGunlukler([]);
      }
    };

    loadJournalsOfStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seciliOgrenci]);

  const ogrenciGunlukleri = seciliOgrenci
    ? gunlukler.filter(g => g.ogrenciId === seciliOgrenci.id)
    : [];

  const toplamOgrenci = filtrelenmisOgrenciler.length;
  const aktifOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Aktif').length;
  const gelecekOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Gelecek').length;

  // ✅ Öğretmen yıldızı Firestore'a yaz (öğrenci görecek)
  const handleYildizVer = async (gunlukId, yeniYildiz) => {
    if (!seciliOgrenci?.id) return;

    try {
      // ✅ Mevcut günlüğü bul
      const mevcutGunluk = gunlukler.find(g => g.id === gunlukId);
      if (!mevcutGunluk) {
        showToast("error", "Hata", "Günlük bulunamadı.");
        return;
      }

      const eskiYildiz = Number(mevcutGunluk.ogretmenYildizi || 0);
      const yildiz = Number(yeniYildiz || 0);

      // ✅ KURAL: Yıldız SADECE ARTIRILABİLİR (A modeli)
      if (eskiYildiz > 0 && yildiz < eskiYildiz) {
        showToast(
          "error",
          "Yıldız Azaltılamaz ⚠️",
          `Bu günlük zaten ${eskiYildiz} yıldız aldı. Yıldızı sadece artırabilirsiniz. (${eskiYildiz} → ${yildiz} değil)`
        );
        return;
      }

      // ✅ Aynı yıldız tekrar veriliyorsa bilgi ver
      if (eskiYildiz === yildiz && yildiz > 0) {
        showToast("info", "Yıldız Zaten Verildi", `Bu günlük zaten ${yildiz} yıldız aldı.`);
        return;
      }

      const ref = doc(db, "gunlukler", seciliOgrenci.id, "items", gunlukId);

      await updateDoc(ref, {
        ogretmenYildizi: yildiz,
        yildizVerilmeTarihi: yildiz > 0 ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      });

      // UI hemen güncellensin
      setGunlukler(prev => prev.map(g => (
        g.id === gunlukId
          ? {
              ...g,
              ogretmenYildizi: yildiz,
              ogretmenYildizVerildi: yildiz > 0,
              yildiz: yildiz,
            }
          : g
      )));

      if (yildiz > 0) {
        if (eskiYildiz === 0) {
          // ✅ İLK YILDIZ: Kilit oluştu
          showToast(
            "success",
            "Yıldız Verildi & Kilitlendi ✅",
            `⭐ ${yildiz} yıldız verildi! Günlük kilitlendi (öğrenci artık silemez).`
          );
        } else if (yildiz > eskiYildiz) {
          // ✅ YILDIZ ARTIRILDI
          showToast(
            "success",
            "Yıldız Artırıldı 📈",
            `Yıldız ${eskiYildiz} → ${yildiz} olarak güncellendi. Kilit devam ediyor.`
          );
        } else {
          // ✅ Aynı yıldız (0'a çekme veya aynı)
          showToast("success", "Yıldız Güncellendi", `Yıldız ${yildiz} olarak ayarlandı.`);
        }
      } else {
        // ✅ Yıldız kaldırıldı (0)
        showToast("info", "Yıldız Kaldırıldı", "Yıldız değerlendirmesi kaldırıldı. Kilit kalktı.");
      }
    } catch (err) {
      console.log("Yıldız kaydedilemedi:", err);
      showToast("error", "Kayıt Hatası ❌", "Yıldız kaydedilemedi. (Firestore rules / izin)");
    }
  };

  const handleOgrenciSec = (ogrenci) => {
    setSeciliOgrenci(ogrenci);
  };

  const handleGeriDon = () => {
    setSeciliOgrenci(null);
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white p-3 sm:p-4">
      {/* ✅ TOAST */}
      {toast.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <div className={`bg-gray-900/90 backdrop-blur-md border ${t.ring} rounded-2xl shadow-xl px-4 sm:px-5 py-3 sm:py-4`}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-2 ${t.badge}`} />
              <div className="flex-1">
                <div className={`font-bold text-sm sm:text-base ${t.title}`}>{toast.title}</div>
                {toast.message && (
                  <div className={`text-xs sm:text-sm mt-1 ${t.msg}`}>{toast.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_moontracker-5/artifacts/zksvk4wp_AY%20ARKAPLAN.jpg)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER - MOBİL UYUMLU */}
        <header className="mb-6 sm:mb-8 pt-4 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="order-2 sm:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">👨‍🏫 Öğretmen Paneli</h1>
              <p className="text-gray-300 text-sm sm:text-base">5. Sınıf Öğrencilerinin Ay Günlüklerini Takip Edin</p>
            </div>
            <div className="order-1 sm:order-2 text-xs sm:text-sm bg-gradient-to-r from-green-900/50 to-emerald-900/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-green-700/50 backdrop-blur-sm w-full sm:w-auto">
              <span className="text-yellow-300">🎯</span> Mevcut 5. Sınıf: {currentEgitimYili}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
              ← Ana Sayfa
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        {/* STATS CARDS - MOBİLDE DİKEY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl border border-blue-700/30 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-300 text-sm sm:text-base">Filtrelenmiş Öğrenci</h3>
              <div className="text-xl sm:text-2xl">👥</div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? "…" : toplamOgrenci}</p>
            <p className="text-xs sm:text-sm text-blue-300 mt-1 sm:mt-2">
              {seciliEgitimYili === 'Tümü' ? 'Tüm yıllar' : seciliEgitimYili}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl border border-green-700/30 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-300 text-sm sm:text-base">Aktif Öğrenci</h3>
              <div className="text-xl sm:text-2xl">⭐</div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? "…" : aktifOgrenci}</p>
            <p className="text-xs sm:text-sm text-green-300 mt-1 sm:mt-2">5. sınıf ({currentEgitimYili})</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-300 text-sm sm:text-base">Gelecek Öğrenci</h3>
              <div className="text-xl sm:text-2xl">🔮</div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loading ? "…" : gelecekOgrenci}</p>
            <p className="text-xs sm:text-sm text-purple-300 mt-1 sm:mt-2">2026-2027 (5. sınıf olacak)</p>
          </div>
        </div>

        {/* FİLTRELEME BÖLÜMÜ */}
        <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">🌌 Filtreleme Seçenekleri</h2>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-300 flex items-center gap-2">
                <span>📅</span> Eğitim Yılı
              </h3>
              <div className="flex flex-wrap gap-2">
                {egitimYillari.map(yil => (
                  <button
                    key={yil}
                    onClick={() => setSeciliEgitimYili(yil)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                      seciliEgitimYili === yil
                        ? yil === currentEgitimYili
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                          : yil === '2026-2027'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {yil === 'Tümü' ? 'Tüm Yıllar' : yil}
                    {yil === currentEgitimYili && ' (M)'}
                    {yil === '2026-2027' && ' (G)'}
                  </button>
                ))}
              </div>
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
                <p className="text-green-400 mb-1">✅ <strong>2025-2026:</strong> Mevcut 5. sınıf</p>
                <p className="text-purple-400">🔮 <strong>2026-2027:</strong> Gelecek yıl</p>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-300 flex items-center gap-2">
                <span>🏫</span> Sınıf
              </h3>
              <div className="flex flex-wrap gap-2">
                {siniflar.map(sinif => (
                  <button
                    key={sinif}
                    onClick={() => setSeciliSinif(sinif)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                      seciliSinif === sinif
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {sinif === 'Tümü' ? 'Tüm Sınıflar' : sinif}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                Sadece 5. sınıf öğrencileri (5-A ve 5-B)
              </p>
            </div>
          </div>
        </div>

        {/* ÖĞRENCİ DETAY BÖLÜMÜ */}
        {seciliOgrenci ? (
          <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-6 sm:mb-8">
            {/* ÖĞRENCİ HEADER - MOBİL UYUMLU */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleGeriDon}
                    className="text-gray-400 hover:text-white transition-colors text-base sm:text-lg"
                  >
                    ← Geri
                  </button>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl md:text-5xl">{seciliOgrenci.avatar || "👤"}</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                        {seciliOgrenci.ad}
                      </h2>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {seciliOgrenci.sinif} • {seciliOgrenci.egitimYili} • No: {seciliOgrenci.ogrenciNo}
                      </p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium self-start sm:self-center ${
                  seciliOgrenci.durum === 'Aktif'
                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50'
                    : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-700/50'
                }`}>
                  {seciliOgrenci.durum}
                  {seciliOgrenci.durum === 'Gelecek' && ' (5. olacak)'}
                </span>
              </div>
            </div>

            {/* GÜNLÜK LİSTESİ */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <span>📖</span> Günlük Kayıtları ({ogrenciGunlukleri.length})
                </h3>
                <div className="text-xs sm:text-sm bg-yellow-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-yellow-700/50 w-fit">
                  <span className="text-yellow-300">⭐</span> Öğrenciler yıldızlarını görecek
                </div>
              </div>

              {ogrenciGunlukleri.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {ogrenciGunlukleri.map(gunluk => (
                    <div key={gunluk.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                      {/* GÜNLÜK BAŞLIK - MOBİLDE DİKEY */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-base sm:text-lg md:text-xl mb-1 sm:mb-2 break-words">{gunluk.baslik}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-300 text-xs sm:text-sm">
                            <span className="flex items-center gap-1">
                              <span>📅</span> {gunluk.tarih}
                            </span>
                            <span className="flex items-center gap-1">
                              {gunluk.ayFazi}
                            </span>
                            {gunluk.ogretmenYildizi > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-300 text-xs mt-1 sm:mt-0">
                                🔒 Kilitli ({gunluk.ogretmenYildizi} yıldız)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end">
                          <div className="text-yellow-400 text-lg sm:text-xl md:text-2xl">
                            {'★'.repeat(Math.floor(Number(gunluk.yildiz || 0)))}
                            {'☆'.repeat(5 - Math.floor(Number(gunluk.yildiz || 0)))}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-400 mt-1">Öğretmen: {gunluk.yildiz} / 5</span>
                        </div>
                      </div>

                      {/* GÜNLÜK İÇERİK */}
                      <div className="bg-gray-900/30 rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 border border-gray-800/50">
                        <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base max-h-40 overflow-y-auto">{gunluk.icerik}</p>

                        {/* YILDIZ VERME BÖLÜMÜ - MOBİLDE DİKEY */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800/50">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                            <div className="flex-1">
                              <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-yellow-400">👨‍🏫</span>
                                Öğretmen Değerlendirmesi
                              </h5>
                              {gunluk.ogretmenYildizVerildi ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <div className="text-yellow-400 text-xl sm:text-2xl">
                                    {'★'.repeat(gunluk.ogretmenYildizi)}
                                    {'☆'.repeat(5 - gunluk.ogretmenYildizi)}
                                  </div>
                                  <span className="text-white font-bold text-sm sm:text-base">{gunluk.ogretmenYildizi} / 5</span>
                                  <div className="text-xs sm:text-sm text-gray-400">
                                    {gunluk.ogretmenYildizi === 5 ? "📈 Maksimum" : "📈 Artırılabilir"}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-400 text-xs sm:text-sm">Henüz değerlendirilmemiş</p>
                              )}
                            </div>

                            {/* YILDIZ BUTONLARI - MOBİL İÇİN ÖZEL */}
                            <div className="lg:text-right">
                              <p className="text-gray-400 text-xs sm:text-sm mb-2">Yıldız Ver:</p>
                              <div className="flex flex-wrap gap-1 justify-start lg:justify-end">
                                {[1, 2, 3, 4, 5].map(yildiz => (
                                  <button
                                    key={yildiz}
                                    onClick={() => handleYildizVer(gunluk.id, yildiz)}
                                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all text-xs sm:text-sm min-w-[44px] min-h-[44px] ${
                                      gunluk.ogretmenYildizi === yildiz
                                        ? 'bg-yellow-600 text-white'
                                        : gunluk.ogretmenYildizi > 0 && yildiz < gunluk.ogretmenYildizi
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                                    disabled={gunluk.ogretmenYildizi > 0 && yildiz < gunluk.ogretmenYildizi}
                                    title={gunluk.ogretmenYildizi > 0 && yildiz < gunluk.ogretmenYildizi 
                                      ? `Yıldız azaltılamaz (${gunluk.ogretmenYildizi} → ${yildiz})`
                                      : "Yıldız ver"
                                    }
                                  >
                                    <span className="hidden sm:inline">{yildiz} ★</span>
                                    <span className="sm:hidden">{yildiz}★</span>
                                    {gunluk.ogretmenYildizi > 0 && yildiz < gunluk.ogretmenYildizi && (
                                      <span className="hidden sm:inline"> ⬇️</span>
                                    )}
                                    {gunluk.ogretmenYildizi > 0 && yildiz > gunluk.ogretmenYildizi && (
                                      <span className="hidden sm:inline"> ⬆️</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 text-left lg:text-right">
                                {gunluk.ogretmenYildizi > 0 ? "📈 Sadece artırılabilir" : "✅ İlk yıldız"}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 sm:mt-3 text-xs text-gray-500">
                            ⓘ Öğrenci bu yıldızı günlüklerinde görecek • Yıldız verilince günlük kilitlenir
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 opacity-50">📭</div>
                  <p className="text-base sm:text-xl text-gray-400">Bu öğrencinin henüz günlüğü yok.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ÖĞRENCİ LİSTESİ TABLOSU */
          <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {/* TABLO HEADER */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">👥 5. Sınıf Öğrenci Listesi</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {seciliEgitimYili === 'Tümü' ? 'Tüm eğitim yılları' : seciliEgitimYili} •
                    {seciliSinif === 'Tümü' ? ' 5-A ve 5-B sınıfları' : ` ${seciliSinif}`} •
                    Toplam {loading ? "…" : filtrelenmisOgrenciler.length} öğrenci
                  </p>
                </div>
                <div className="text-xs sm:text-sm bg-gray-900/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-700 w-fit">
                  <span className="text-green-400">✅ Aktif</span> •
                  <span className="text-purple-400 mx-1 sm:mx-2">🔮 Gelecek</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-300">Öğrenciler yükleniyor...</p>
              </div>
            ) : filtrelenmisOgrenciler.length > 0 ? (
              <>
                {/* MOBİL GÖRÜNÜM - KARTLAR */}
                <div className="block sm:hidden p-4 space-y-4">
                  {filtrelenmisOgrenciler.map(ogrenci => (
                    <div key={ogrenci.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{ogrenci.avatar || "👤"}</div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{ogrenci.ad}</div>
                          <div className="text-xs text-gray-400">
                            No: {ogrenci.ogrenciNo} • {ogrenci.sinif}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-1">Eğitim Yılı</div>
                          <div className={`text-sm font-medium ${
                            ogrenci.egitimYili === currentEgitimYili ? "text-green-400" : "text-purple-400"
                          }`}>
                            {ogrenci.egitimYili}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-1">Durum</div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            ogrenci.durum === 'Aktif'
                              ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50'
                              : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-700/50'
                          }`}>
                            {ogrenci.durum}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl ${(ogrenci.gunlukSayisi || 0) > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                            {(ogrenci.gunlukSayisi || 0) > 0 ? '📖' : '📭'}
                          </span>
                          <span className={`font-bold ${(ogrenci.gunlukSayisi || 0) > 0 ? 'text-white' : 'text-gray-500'}`}>
                            {ogrenci.gunlukSayisi || 0} günlük
                          </span>
                        </div>
                        <button
                          onClick={() => handleOgrenciSec(ogrenci)}
                          className="px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm"
                        >
                          👁️ Gör
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP GÖRÜNÜM - TABLO */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">Öğrenci</th>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">Sınıf</th>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">Eğitim Yılı</th>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">Durum</th>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">Günlük</th>
                        <th className="px-4 sm:px-6 md:px-8 py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filtrelenmisOgrenciler.map(ogrenci => (
                        <tr key={ogrenci.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <div className="flex items-center">
                              <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">{ogrenci.avatar || "👤"}</div>
                              <div>
                                <div className="font-bold text-white text-sm sm:text-base md:text-lg">{ogrenci.ad}</div>
                                <div className="text-xs sm:text-sm text-gray-400">
                                  No: {ogrenci.ogrenciNo}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 rounded-xl text-xs sm:text-sm font-medium border border-blue-700/50">
                              {ogrenci.sinif}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span className={
                                ogrenci.egitimYili === currentEgitimYili ? "text-green-400" : "text-purple-400"
                              }>
                                {ogrenci.egitimYili}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium ${
                              ogrenci.durum === 'Aktif'
                                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50'
                                : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-700/50'
                            }`}>
                              {ogrenci.durum}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className={`text-xl sm:text-2xl ${(ogrenci.gunlukSayisi || 0) > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                {(ogrenci.gunlukSayisi || 0) > 0 ? '📖' : '📭'}
                              </span>
                              <span className={`font-bold text-base sm:text-lg md:text-xl ${
                                (ogrenci.gunlukSayisi || 0) > 0 ? 'text-white' : 'text-gray-500'
                              }`}>
                                {ogrenci.gunlukSayisi || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 md:px-8 py-4">
                            <button
                              onClick={() => handleOgrenciSec(ogrenci)}
                              className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base"
                            >
                              👁️ Günlükleri Gör
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 opacity-50">📭</div>
                <p className="text-base sm:text-xl text-gray-400">Henüz öğrenci kaydı yok.</p>
              </div>
            )}

            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 text-center text-gray-300 text-xs sm:text-sm border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-400 text-base sm:text-lg">✅</span>
                  <span><strong>2025-2026:</strong> Mevcut 5. sınıf öğrencileri</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-purple-400 text-base sm:text-lg">🔮</span>
                  <span><strong>2026-2027:</strong> Gelecek yıl 5. sınıf olacak</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>Ay Günlüğü • 5. Sınıf Öğretmen Paneli • {new Date().getFullYear()}</p>
          <p className="text-gray-600 text-xs mt-1">Mevcut Eğitim Yılı: {currentEgitimYili} • Sadece 5. sınıf öğrencileri</p>
        </div>
      </div>
    </div>
  );
}

export default OgretmenDashboard;