// src/pages/Gunlukler.js - RESPONSIVE MOBILE-FIRST VERSION

import React, { useState, useEffect } from 'react';
import {
  FaMoon, FaSearch, FaFilter, FaArrowLeft, FaEdit, FaTrash, FaEye,
  FaTimes, FaCheck, FaStar, FaBars, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

function Gunlukler() {
  const [gunlukler, setGunlukler] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const [filtre, setFiltre] = useState({
    arama: '',
    ayEvresi: 'tum',
    siralama: 'yeniden-eskive'
  });

  const [modalDurumu, setModalDurumu] = useState({
    goster: false,
    mod: 'detay',
    seciliGunluk: null
  });

  const [duzenlemeVerisi, setDuzenlemeVerisi] = useState(null);

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

  const getAyEvresiAdFromEmoji = (emoji) => {
    const ayEvreleri = [
      { emoji: '🌑', ad: 'Yeni Ay' },
      { emoji: '🌒', ad: 'Hilal' },
      { emoji: '🌓', ad: 'İlk Dördün' },
      { emoji: '🌔', ad: 'Şişkin Ay' },
      { emoji: '🌕', ad: 'Dolunay' },
      { emoji: '🌖', ad: 'Şişkin Ay' },
      { emoji: '🌗', ad: 'Son Dördün' },
      { emoji: '🌘', ad: 'Hilal' }
    ];

    const bulunan = ayEvreleri.find(evre => evre.emoji === emoji);
    return bulunan ? bulunan.ad : 'Bilinmeyen Evre';
  };

  const ayEvreleri = [
    { emoji: '🌑', ad: 'Yeni Ay' },
    { emoji: '🌒', ad: 'Hilal' },
    { emoji: '🌓', ad: 'İlk Dördün' },
    { emoji: '🌔', ad: 'Şişkin Ay' },
    { emoji: '🌕', ad: 'Dolunay' },
    { emoji: '🌖', ad: 'Şişkin Ay' },
    { emoji: '🌗', ad: 'Son Dördün' },
    { emoji: '🌘', ad: 'Hilal' }
  ];

  const formatDisplayDateTR = (dateISO) => {
    try {
      const d = new Date(dateISO);
      return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch {
      return dateISO || '';
    }
  };

  // ✅ SİLME KİLİDİ: Öğretmen yıldız verdiğinde silme engeli
  const isGunlukKilitli = (gunluk) => {
    const yildiz = Number(gunluk.ogretmenYildizi || 0);
    return yildiz > 0;
  };

  useEffect(() => {
    const loadJournals = async () => {
      const studentId = localStorage.getItem("activeStudentId") || "";
      if (!studentId) {
        setGunlukler([]);
        showToast("error", "Oturum Bulunamadı", "Lütfen tekrar giriş yapın.");
        return;
      }

      try {
        const q = query(
          collection(db, "gunlukler", studentId, "items"),
          orderBy("dateString", "desc")
        );

        const snap = await getDocs(q);

        const list = snap.docs.map((d) => {
          const data = d.data() || {};
          const tarihISO = data.tarihISO || data.dateString || "";

          const ayEvresiEmoji =
            data.ayEvresi ||
            data.moonPhase ||
            '🌑';

          const ayEvresiAd =
            data.ayEvresiAd ||
            data.moonPhaseName ||
            getAyEvresiAdFromEmoji(ayEvresiEmoji);

          const tamIcerik = (
            data.gozlem ??
            data.observation ??
            data.tamIcerik ??
            ""
          ).toString();

          const icerik =
            tamIcerik && tamIcerik.length > 100
              ? tamIcerik.substring(0, 100) + '...'
              : (tamIcerik || 'Gözlem notu eklenmedi');

          const numericId = tarihISO
            ? Number(new Date(tarihISO).getTime())
            : Number(new Date().getTime());

          return {
            id: numericId,
            firestoreId: d.id,
            tarihISO,
            tarih: data.tarih || (tarihISO ? formatDisplayDateTR(tarihISO) : ''),
            ayEvresi: ayEvresiEmoji,
            ayEvresiAd,
            icerik,
            tamIcerik,
            goruntulenme: 0,
            duzenlemeTarihi: data.duzenlemeTarihi || null,
            ogretmenYildizi: Number(data.ogretmenYildizi || 0) || null,
            ogretmenYorumu: data.ogretmenYorumu || null,
            yildizVerilmeTarihi: data.yildizVerilmeTarihi || null
          };
        });

        setGunlukler(list);
        if (list.length > 0) {
          showToast("success", "Günlükler Yüklendi", `${list.length} günlük bulundu.`);
        }
      } catch (err) {
        console.error("Günlükler okunamadı:", err);
        showToast("error", "Yükleme Hatası", "Günlükler yüklenemedi.");
      }
    };

    loadJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderYildizlar = (sayi) => {
    if (!sayi) return null;

    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-sm lg:text-base ${index < sayi ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  const filtrelenmisGunlukler = gunlukler
    .filter(gunluk => {
      if (filtre.arama && !(gunluk.tamIcerik || '').toLowerCase().includes(filtre.arama.toLowerCase())) {
        return false;
      }
      if (filtre.ayEvresi !== 'tum' && !(gunluk.ayEvresi || '').includes(filtre.ayEvresi)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filtre.siralama === 'yeniden-eskive') return b.id - a.id;
      return a.id - b.id;
    });

  const handleFiltreTemizle = () => {
    setFiltre({
      arama: '',
      ayEvresi: 'tum',
      siralama: 'yeniden-eskive'
    });
    setMobileFiltersOpen(false);
    showToast("info", "Filtre Temizlendi", "Tüm filtreler sıfırlandı.");
  };

  const handleGunlukSil = async (id) => {
    const studentId = localStorage.getItem("activeStudentId") || "";
    const silinecek = gunlukler.find(g => g.id === id);

    if (!studentId || !silinecek?.firestoreId) {
      showToast("error", "Hata", "Öğrenci oturumu / günlük bulunamadı.");
      return;
    }

    if (isGunlukKilitli(silinecek)) {
      showToast(
        "error",
        "Silinemez ⚠️",
        `Bu günlük öğretmen tarafından yıldız verildiği için silinemez. (${silinecek.ogretmenYildizi} yıldız)`
      );
      return;
    }

    showToast(
      "info",
      "Silme Onayı",
      `"${silinecek.tarih}" tarihli günlüğü silmek için tekrar Sil butonuna tıklayın.`,
      2500
    );

    const handleConfirmedDelete = async () => {
      try {
        await deleteDoc(doc(db, "gunlukler", studentId, "items", silinecek.firestoreId));

        const yeniGunlukler = gunlukler.filter(gunluk => gunluk.id !== id);
        setGunlukler(yeniGunlukler);
        setModalDurumu({ goster: false, mod: 'detay', seciliGunluk: null });

        showToast("success", "Silindi ✅", `"${silinecek.tarih}" tarihli günlük silindi.`);
      } catch (err) {
        console.error("Günlük silme hatası:", err);
        showToast("error", "Silme Hatası ❌", "Silme sırasında hata oluştu: " + (err?.message || "Bilinmeyen hata"));
      }
    };

    return handleConfirmedDelete();
  };

  const handleDetayGoster = (gunluk) => {
    const guncellenmisGunlukler = gunlukler.map(g =>
      g.id === gunluk.id ? { ...g, goruntulenme: (g.goruntulenme || 0) + 1 } : g
    );
    setGunlukler(guncellenmisGunlukler);

    setModalDurumu({
      goster: true,
      mod: 'detay',
      seciliGunluk: { ...gunluk, goruntulenme: (gunluk.goruntulenme || 0) + 1 }
    });
  };

  const handleDuzenlemeyeBasla = (gunluk) => {
    setDuzenlemeVerisi({ ...gunluk });
    setModalDurumu({
      goster: true,
      mod: 'duzenle',
      seciliGunluk: gunluk
    });
  };

  const handleDuzenlemeKaydet = async () => {
    const studentId = localStorage.getItem("activeStudentId") || "";
    if (!studentId || !duzenlemeVerisi?.firestoreId) {
      showToast("error", "Hata", "Öğrenci oturumu / günlük bulunamadı.");
      return;
    }

    const yeniTamIcerik = (duzenlemeVerisi.tamIcerik || '').toString();
    const yeniIcerik =
      yeniTamIcerik && yeniTamIcerik.length > 100
        ? yeniTamIcerik.substring(0, 100) + '...'
        : (yeniTamIcerik || 'Gözlem notu eklenmedi');

    try {
      const ref = doc(db, "gunlukler", studentId, "items", duzenlemeVerisi.firestoreId);

      await setDoc(ref, {
        ayEvresi: duzenlemeVerisi.ayEvresi,
        ayEvresiAd: duzenlemeVerisi.ayEvresiAd || getAyEvresiAdFromEmoji(duzenlemeVerisi.ayEvresi),
        gozlem: yeniTamIcerik,
        duzenlemeTarihi: new Date().toLocaleString('tr-TR'),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const guncellenmisGunlukler = gunlukler.map(gunluk =>
        gunluk.id === duzenlemeVerisi.id
          ? {
              ...gunluk,
              ...duzenlemeVerisi,
              duzenlemeTarihi: new Date().toLocaleString('tr-TR'),
              icerik: yeniIcerik,
              ayEvresiAd: duzenlemeVerisi.ayEvresiAd || getAyEvresiAdFromEmoji(duzenlemeVerisi.ayEvresi)
            }
          : gunluk
      );

      setGunlukler(guncellenmisGunlukler);
      setModalDurumu({ goster: false, mod: 'detay', seciliGunluk: null });
      setDuzenlemeVerisi(null);

      showToast("success", "Güncellendi ✅", `"${duzenlemeVerisi.tarih}" tarihli günlük güncellendi.`);
    } catch (err) {
      console.error("Günlük güncelleme hatası:", err);
      showToast("error", "Güncelleme Hatası ❌", "Güncelleme sırasında hata oluştu: " + (err?.message || "Bilinmeyen hata"));
    }
  };

  const handleModalKapat = () => {
    setModalDurumu({
      goster: false,
      mod: 'detay',
      seciliGunluk: null
    });
    setDuzenlemeVerisi(null);
  };

  const renderDuzenlemeModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 lg:p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border border-gray-700 mx-2">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-lg lg:text-2xl font-bold">
            ✏️ Günlük Düzenle - {duzenlemeVerisi?.tarih}
          </h3>
          <button
            onClick={handleModalKapat}
            className="text-gray-400 hover:text-white text-xl lg:text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-gray-300 mb-1 lg:mb-2 font-semibold text-sm lg:text-base">Tarih</label>
            <input
              type="text"
              value={duzenlemeVerisi?.tarih || ''}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-yellow-500 text-sm lg:text-base"
              disabled
              title="Tarih değiştirme kapalı"
            />
            <p className="text-xs text-gray-500 mt-1 lg:mt-2">
              ⓘ Tarih değiştirme kapalı. (Takvim/Firestore tutarlılığı için)
            </p>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 lg:mb-2 font-semibold text-sm lg:text-base">Ay Evresi</label>
            <div className="grid grid-cols-4 gap-2 lg:gap-3">
              {ayEvreleri.map((evre, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDuzenlemeVerisi({
                    ...duzenlemeVerisi,
                    ayEvresi: evre.emoji,
                    ayEvresiAd: evre.ad
                  })}
                  className={`p-2 lg:p-3 rounded-lg flex flex-col items-center justify-center transition-all min-h-[70px] lg:min-h-[80px] ${
                    duzenlemeVerisi?.ayEvresi === evre.emoji
                      ? 'bg-yellow-500/30 border-2 border-yellow-500 scale-105'
                      : 'bg-gray-900 hover:bg-gray-800 border border-gray-700'
                  }`}
                  title={evre.ad}
                >
                  <span className="text-xl lg:text-2xl mb-1">{evre.emoji}</span>
                  <span className="text-xs text-gray-300 text-center leading-tight">{evre.ad}</span>
                </button>
              ))}
            </div>
            {duzenlemeVerisi?.ayEvresi && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-300 text-sm">
                  Seçilen: <span className="text-yellow-300 font-semibold">
                    {duzenlemeVerisi.ayEvresi} {duzenlemeVerisi.ayEvresiAd || getAyEvresiAdFromEmoji(duzenlemeVerisi.ayEvresi)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1 lg:mb-2 font-semibold text-sm lg:text-base">Gözlem İçeriği</label>
            <textarea
              value={duzenlemeVerisi?.tamIcerik || ''}
              onChange={(e) => setDuzenlemeVerisi({
                ...duzenlemeVerisi,
                tamIcerik: e.target.value
              })}
              className="w-full h-48 lg:h-64 bg-gray-900 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-yellow-500 resize-none text-sm lg:text-base"
              placeholder="Ay gözleminizi buraya yazın..."
            />
            <p className="text-gray-400 text-xs lg:text-sm mt-1">
              Karakter sayısı: {(duzenlemeVerisi?.tamIcerik || '').length}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-end space-y-2 lg:space-y-0 lg:space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleModalKapat}
              className="px-4 lg:px-6 py-2 lg:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center text-sm lg:text-base min-h-[44px]"
            >
              <FaTimes className="mr-2" />
              İptal
            </button>
            <button
              onClick={handleDuzenlemeKaydet}
              className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center justify-center text-sm lg:text-base min-h-[44px]"
            >
              <FaCheck className="mr-2" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetayModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 lg:p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border border-gray-700 mx-2">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-lg lg:text-2xl font-bold">
            {modalDurumu.seciliGunluk.ayEvresi} {modalDurumu.seciliGunluk.ayEvresiAd || getAyEvresiAdFromEmoji(modalDurumu.seciliGunluk.ayEvresi)} Gözlemi
          </h3>
          <button
            onClick={handleModalKapat}
            className="text-gray-400 hover:text-white text-xl lg:text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-400">
            <span className="bg-gray-900/50 px-2 py-1 rounded">{modalDurumu.seciliGunluk.tarih}</span>
            <span className="bg-gray-900/50 px-2 py-1 rounded">ID: {modalDurumu.seciliGunluk.firestoreId}</span>
            <span className="bg-green-900/50 px-2 py-1 rounded text-green-400">✅ Kayıtlı</span>
            <span className="bg-blue-900/50 px-2 py-1 rounded">👁️ {modalDurumu.seciliGunluk.goruntulenme}</span>
          </div>

          {modalDurumu.seciliGunluk.ogretmenYildizi ? (
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 rounded-xl p-3 lg:p-4 border border-yellow-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
                <div className="flex items-center mb-2 lg:mb-0">
                  <FaStar className="text-yellow-400 mr-3 text-lg lg:text-xl" />
                  <h4 className="font-bold text-yellow-300 text-sm lg:text-base">Öğretmen Değerlendirmesi</h4>
                </div>
                <div className="flex items-center">
                  {renderYildizlar(modalDurumu.seciliGunluk.ogretmenYildizi)}
                  <span className="ml-2 text-yellow-300 font-bold text-sm lg:text-base">
                    {modalDurumu.seciliGunluk.ogretmenYildizi}/5
                  </span>
                </div>
              </div>

              {modalDurumu.seciliGunluk.ogretmenYorumu && (
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-gray-300 italic text-sm lg:text-base">
                    "{modalDurumu.seciliGunluk.ogretmenYorumu}"
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    📅 {modalDurumu.seciliGunluk.yildizVerilmeTarihi}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-xl p-3 lg:p-4 border border-gray-700">
              <div className="flex items-center">
                <FaStar className="text-gray-500 mr-3 text-lg lg:text-xl" />
                <div>
                  <h4 className="font-bold text-gray-400 text-sm lg:text-base">Henüz Değerlendirilmedi</h4>
                  <p className="text-gray-500 text-xs lg:text-sm">
                    Öğretmeniniz bu günlüğü henüz değerlendirmedi.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900/50 rounded-xl p-3 lg:p-4">
            <h4 className="font-bold mb-2 text-sm lg:text-base">Gözlem İçeriği</h4>
            <p className="text-gray-300 whitespace-pre-wrap break-words text-sm lg:text-base overflow-y-auto max-h-60 lg:max-h-80">
              {modalDurumu.seciliGunluk.tamIcerik || 'Gözlem notu eklenmemiş.'}
            </p>
          </div>

          {modalDurumu.seciliGunluk.duzenlemeTarihi && (
            <div className="bg-blue-900/30 rounded-xl p-3 lg:p-4">
              <h4 className="font-bold mb-2 text-blue-300 text-sm lg:text-base">✏️ Son Düzenleme</h4>
              <p className="text-gray-300 text-sm lg:text-base">{modalDurumu.seciliGunluk.duzenlemeTarihi}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-end gap-2 lg:gap-3 pt-4">
            <button
              onClick={() => {
                if (isGunlukKilitli(modalDurumu.seciliGunluk)) {
                  showToast(
                    "error",
                    "Silinemez ⚠️",
                    `Bu günlük ${modalDurumu.seciliGunluk.ogretmenYildizi} yıldız aldığı için silinemez.`
                  );
                  return;
                }
                handleGunlukSil(modalDurumu.seciliGunluk.id);
              }}
              className={`px-3 lg:px-4 py-2 lg:py-2 rounded-lg transition-all flex items-center justify-center min-h-[44px] text-sm lg:text-base ${
                isGunlukKilitli(modalDurumu.seciliGunluk)
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
              disabled={isGunlukKilitli(modalDurumu.seciliGunluk)}
              title={isGunlukKilitli(modalDurumu.seciliGunluk) ? "Öğretmen yıldız verdiği için silinemez" : "Bu günlüğü sil"}
            >
              <FaTrash className="mr-2 text-sm lg:text-base" />
              {isGunlukKilitli(modalDurumu.seciliGunluk) ? "Kilitli 🔒" : "Sil"}
            </button>

            <button
              onClick={() => handleDuzenlemeyeBasla(modalDurumu.seciliGunluk)}
              className="px-3 lg:px-4 py-2 lg:py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all flex items-center justify-center min-h-[44px] text-sm lg:text-base"
            >
              <FaEdit className="mr-2 text-sm lg:text-base" />
              Düzenle
            </button>
            <button
              onClick={handleModalKapat}
              className="px-3 lg:px-4 py-2 lg:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center min-h-[44px] text-sm lg:text-base"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

  // MOBİL KART GÖRÜNÜMÜ
  const renderMobileCard = (gunluk) => (
    <div
      key={gunluk.id}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{gunluk.ayEvresi}</span>
            <div>
              <h4 className="font-bold text-sm">{gunluk.ayEvresiAd || getAyEvresiAdFromEmoji(gunluk.ayEvresi)}</h4>
              <p className="text-xs text-gray-400">{gunluk.tarih}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs bg-gray-900/70 px-2 py-1 rounded">✅ Kayıtlı</span>
            <span className="text-xs bg-blue-900/70 px-2 py-1 rounded">👁️ {gunluk.goruntulenme}</span>
            {isGunlukKilitli(gunluk) && (
              <span className="text-xs bg-yellow-900/70 px-2 py-1 rounded text-yellow-300">🔒 Kilitli</span>
            )}
            {gunluk.ogretmenYildizi && (
              <span className="text-xs bg-yellow-900/70 px-2 py-1 rounded">
                ⭐ {gunluk.ogretmenYildizi} yıldız
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setExpandedCard(expandedCard === gunluk.id ? null : gunluk.id)}
          className="text-gray-400 ml-2"
        >
          {expandedCard === gunluk.id ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <div className={`${expandedCard === gunluk.id ? 'block' : 'hidden'} space-y-3`}>
        <div className="border-t border-gray-700 pt-3">
          <p className="text-gray-300 text-sm mb-3">
            {gunluk.tamIcerik || gunluk.icerik}
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDetayGoster(gunluk)}
              className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-xs min-h-[44px]"
            >
              <FaEye className="mr-1 text-xs" />
              Detay
            </button>
            <button
              onClick={() => handleDuzenlemeyeBasla(gunluk)}
              className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all text-xs min-h-[44px]"
            >
              <FaEdit className="mr-1 text-xs" />
              Düzenle
            </button>
            <button
              onClick={() => {
                if (isGunlukKilitli(gunluk)) {
                  showToast(
                    "error",
                    "Silinemez ⚠️",
                    `Bu günlük ${gunluk.ogretmenYildizi} yıldız aldığı için silinemez.`
                  );
                  return;
                }
                handleGunlukSil(gunluk.id);
              }}
              className={`flex items-center justify-center px-2 py-2 rounded-lg transition-all text-xs min-h-[44px] ${
                isGunlukKilitli(gunluk)
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
              disabled={isGunlukKilitli(gunluk)}
            >
              <FaTrash className="mr-1 text-xs" />
              {isGunlukKilitli(gunluk) ? "Kilitli" : "Sil"}
            </button>
          </div>
        </div>
      </div>

      {/* Butonlar - collapsed state için */}
      <div className={`${expandedCard === gunluk.id ? 'hidden' : 'flex'} justify-between mt-3`}>
        <button
          onClick={() => setExpandedCard(gunluk.id)}
          className="text-blue-400 text-xs flex items-center"
        >
          <FaChevronDown className="mr-1" />
          Detaylar
        </button>
        <span className="text-xs text-gray-500 text-right">
          ID: {gunluk.firestoreId?.substring(0, 8)}...
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* ✅ TOAST */}
      {toast.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <div className={`bg-gray-900/90 backdrop-blur-md border ${t.ring} rounded-2xl shadow-xl px-4 lg:px-5 py-3 lg:py-4`}>
            <div className="flex items-start gap-3">
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

      {/* HEADER */}
      <header className="py-4 lg:py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-lg lg:text-xl" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Geçmiş Günlüklerim
              </h1>
            </div>

            <Link
              to="/OgrenciDashboard"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-3 lg:px-4 py-2 hover:bg-gray-800 rounded-lg text-sm lg:text-base"
            >
              <FaArrowLeft className="mr-1 lg:mr-2 text-sm lg:text-base" />
              <span className="hidden lg:inline">Dashboard'a Dön</span>
              <span className="lg:hidden">Geri</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 lg:px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* SUMMARY CARD */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700 mb-4 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-3 lg:mb-0">
                <h2 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">Tüm Günlükleriniz</h2>
                <p className="text-gray-300 text-sm lg:text-base">
                  Toplam <span className="text-yellow-300 font-bold">{gunlukler.length}</span> günlük kaydınız bulunuyor.
                </p>
              </div>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-2 text-sm lg:text-base" />
                <span className="text-gray-300 text-xs lg:text-sm">
                  Öğretmen yıldızlarını görmek için tıklayın
                </span>
              </div>
            </div>
          </div>

          {/* FILTERS CARD */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700 mb-4 lg:mb-8">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-bold">Filtreler</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <FaFilter className="text-lg" />
                </button>
                <button
                  onClick={handleFiltreTemizle}
                  className="text-xs lg:text-sm text-gray-400 hover:text-white px-2 lg:px-3 py-1 hover:bg-gray-700 rounded"
                >
                  Temizle
                </button>
              </div>
            </div>

            {/* MOBILE FILTERS */}
            <div className={`lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'} space-y-3 mb-4`}>
              <div className="space-y-2">
                <label className="flex items-center text-gray-300 text-sm">
                  <FaSearch className="mr-2" />
                  Ara
                </label>
                <input
                  type="text"
                  placeholder="Gözlem içeriğinde ara..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  value={filtre.arama}
                  onChange={(e) => setFiltre({ ...filtre, arama: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-300 text-sm">
                  <FaFilter className="mr-2" />
                  Ay Evresi
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  value={filtre.ayEvresi}
                  onChange={(e) => setFiltre({ ...filtre, ayEvresi: e.target.value })}
                >
                  <option value="tum">Tüm Ay Evreleri</option>
                  <option value="🌑">Yeni Ay</option>
                  <option value="🌒">Hilal</option>
                  <option value="🌓">İlk Dördün</option>
                  <option value="🌔">Şişkin Ay</option>
                  <option value="🌕">Dolunay</option>
                  <option value="🌖">Şişkin Ay</option>
                  <option value="🌗">Son Dördün</option>
                  <option value="🌘">Hilal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-300 text-sm">
                  <FaFilter className="mr-2" />
                  Sıralama
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  value={filtre.siralama}
                  onChange={(e) => setFiltre({ ...filtre, siralama: e.target.value })}
                >
                  <option value="yeniden-eskive">Yeniden Eskiye</option>
                  <option value="eskiden-yeniye">Eskiden Yeniye</option>
                </select>
              </div>
            </div>

            {/* DESKTOP FILTERS */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaSearch className="mr-2" />
                  Gözlem içeriğinde ara
                </label>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.arama}
                  onChange={(e) => setFiltre({ ...filtre, arama: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaFilter className="mr-2" />
                  Ay Evresi
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.ayEvresi}
                  onChange={(e) => setFiltre({ ...filtre, ayEvresi: e.target.value })}
                >
                  <option value="tum">Tüm Ay Evreleri</option>
                  <option value="🌑">Yeni Ay</option>
                  <option value="🌒">Hilal</option>
                  <option value="🌓">İlk Dördün</option>
                  <option value="🌔">Şişkin Ay</option>
                  <option value="🌕">Dolunay</option>
                  <option value="🌖">Şişkin Ay</option>
                  <option value="🌗">Son Dördün</option>
                  <option value="🌘">Hilal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <FaFilter className="mr-2" />
                  Sıralama
                </label>
                <select
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={filtre.siralama}
                  onChange={(e) => setFiltre({ ...filtre, siralama: e.target.value })}
                >
                  <option value="yeniden-eskive">Yeniden Eskiye</option>
                  <option value="eskiden-yeniye">Eskiden Yeniye</option>
                </select>
              </div>
            </div>
          </div>

          {/* RESULTS HEADER */}
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-lg lg:text-xl font-bold">
              Kayıtlı Günlükler ({filtrelenmisGunlukler.length})
            </h3>
            <div className="text-xs lg:text-sm text-gray-400">
              <span className="text-green-400">Detayda öğretmen yıldızını görün</span>
            </div>
          </div>

          {/* EMPTY STATE */}
          {filtrelenmisGunlukler.length === 0 ? (
            <div className="text-center py-8 lg:py-12 bg-gray-800/30 rounded-xl lg:rounded-2xl border border-gray-700">
              <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">📝</div>
              <h3 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">Günlük Bulunamadı</h3>
              <p className="text-gray-400 text-sm lg:text-base">Filtrelerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW - CARDS */}
              <div className="lg:hidden space-y-3">
                {filtrelenmisGunlukler.map((gunluk) => renderMobileCard(gunluk))}
              </div>

              {/* DESKTOP VIEW - CARDS */}
              <div className="hidden lg:grid gap-4">
                {filtrelenmisGunlukler.map((gunluk) => (
                  <div
                    key={gunluk.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-700/50 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-xl font-bold mb-1">
                              {gunluk.ayEvresi} {gunluk.ayEvresiAd || getAyEvresiAdFromEmoji(gunluk.ayEvresi)} - {gunluk.tarih}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{gunluk.tarih}</span>
                              <span>ID: {gunluk.firestoreId}</span>
                              <span className="text-green-400">✅ Kayıtlı</span>
                              <span className="text-blue-400">👁️ {gunluk.goruntulenme} görüntülenme</span>
                              {isGunlukKilitli(gunluk) && (
                                <span className="text-yellow-400">🔒 Kilitli</span>
                              )}
                            </div>
                          </div>
                          <span className="text-3xl">{gunluk.ayEvresi}</span>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-300 line-clamp-2">
                            {gunluk.icerik}
                          </p>
                        </div>

                        {gunluk.ogretmenYildizi && (
                          <div className="flex items-center text-sm">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-yellow-300 mr-2">
                              {gunluk.ogretmenYildizi} yıldız
                            </span>
                            <span className="text-gray-500 text-xs">
                              (detay için tıklayın)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleDetayGoster(gunluk)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          <FaEye className="mr-2" />
                          Detay
                        </button>
                        <button
                          onClick={() => handleDuzenlemeyeBasla(gunluk)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all"
                        >
                          <FaEdit className="mr-2" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (isGunlukKilitli(gunluk)) {
                              showToast(
                                "error",
                                "Silinemez ⚠️",
                                `Bu günlük ${gunluk.ogretmenYildizi} yıldız aldığı için silinemez.`
                              );
                              return;
                            }
                            handleGunlukSil(gunluk.id);
                          }}
                          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                            isGunlukKilitli(gunluk)
                              ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-60'
                              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                          }`}
                          disabled={isGunlukKilitli(gunluk)}
                          title={isGunlukKilitli(gunluk) ? "Öğretmen yıldız verdiği için silinemez" : "Bu günlüğü sil"}
                        >
                          <FaTrash className="mr-2" />
                          {isGunlukKilitli(gunluk) ? "Kilitli 🔒" : "Sil"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MODALS */}
          {modalDurumu.goster && (
            modalDurumu.mod === 'duzenle'
              ? renderDuzenlemeModal()
              : renderDetayModal()
          )}
        </div>
      </main>

      <footer className="py-4 lg:py-8 border-t border-gray-800 mt-6 lg:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm lg:text-base">
            © 2026 Ay Günlüğü - Günlük Yönetimi-Candemir Yurdagül
          </p>
          <p className="text-gray-500 text-xs lg:text-sm mt-1 lg:mt-2">
            Öğretmen yıldızlarını görmek için günlüklere tıklayın
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Gunlukler;