// src/pages/AyTakvimi.js

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

function AyTakvimi() {
  const navigate = useNavigate();

  // ✅ Takvim aralığı: 2026-01 .. 2028-12
  const MIN_YEAR = 2026;
  const MAX_YEAR = 2028;

  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(0); // 0=Ocak

  const [gunlukMap, setGunlukMap] = useState({}); // { "YYYY-MM-DD": firestoreDocId }
  const [loading, setLoading] = useState(true);

  const monthTitleTR = useMemo(() => {
    const dt = new Date(year, monthIndex, 1);
    return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(dt);
  }, [year, monthIndex]);

  const daysInMonth = useMemo(() => {
    return new Date(year, monthIndex + 1, 0).getDate();
  }, [year, monthIndex]);

  // ✅ TR'de hafta Pazartesi başlar
  const weekDaysTR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // JS getDay(): 0=Pazar..6=Cumartesi
  // Biz Pazartesi=0..Pazar=6 istiyoruz:
  // (jsDay + 6) % 7
  const leadingBlanks = useMemo(() => {
    const jsDay = new Date(year, monthIndex, 1).getDay();
    return (jsDay + 6) % 7;
  }, [year, monthIndex]);

  const monthKey = useMemo(() => {
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  }, [year, monthIndex]);

  // ✅ Firestore’dan bu öğrencinin tüm günlüklerini çek (tarih -> docId)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const studentId = localStorage.getItem("activeStudentId");
        if (!studentId) {
          setGunlukMap({});
          return;
        }

        const snap = await getDocs(collection(db, "gunlukler", studentId, "items"));
        const map = {};

        snap.forEach((d) => {
          const data = d.data() || {};
          const ds = (data.tarihISO || data.dateString || "").toString();
          if (ds) map[ds] = d.id;
        });

        setGunlukMap(map);
      } catch (err) {
        console.error("AyTakvimi yükleme hatası:", err);
        setGunlukMap({});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const canGoPrev = useMemo(() => {
    if (year > MIN_YEAR) return true;
    return year === MIN_YEAR && monthIndex > 0;
  }, [year, monthIndex]);

  const canGoNext = useMemo(() => {
    if (year < MAX_YEAR) return true;
    return year === MAX_YEAR && monthIndex < 11;
  }, [year, monthIndex]);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (monthIndex === 0) {
      setYear((y) => y - 1);
      setMonthIndex(11);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (monthIndex === 11) {
      setYear((y) => y + 1);
      setMonthIndex(0);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  const handleDayClick = (dateISO) => {
    const hasJournal = Boolean(gunlukMap[dateISO]);

    if (hasJournal) {
      // ✅ Günlük varsa: direkt detaya (Gunlukler modal otomatik açacak)
      navigate(`/Gunlukler?date=${encodeURIComponent(dateISO)}`);
    } else {
      // ✅ Günlük yoksa: yeni günlük
      navigate(`/YeniGunluk?date=${encodeURIComponent(dateISO)}`);
    }
  };

  const isActiveStudentMissing = !localStorage.getItem("activeStudentId");

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
              <div>
                <h1 className="text-2xl font-bold text-white">Ay Takvimi</h1>
                <p className="text-gray-300 text-sm">
                  {monthTitleTR} <span className="text-gray-500">({MIN_YEAR}–{MAX_YEAR})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                disabled={!canGoPrev}
                className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                  canGoPrev
                    ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                    : "border-gray-800 text-gray-600 cursor-not-allowed"
                }`}
                type="button"
                title="Önceki ay"
              >
                <FaChevronLeft className="mr-1" />
                Önceki
              </button>

              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                  canGoNext
                    ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                    : "border-gray-800 text-gray-600 cursor-not-allowed"
                }`}
                type="button"
                title="Sonraki ay"
              >
                Sonraki
                <FaChevronRight className="ml-1" />
              </button>

              <button
                onClick={() => navigate("/OgrenciDashboard")}
                className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
                type="button"
              >
                <FaArrowLeft className="mr-2" />
                Dashboard&apos;a Dön
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">2026–2028 Ay Takvimi</h2>
                <p className="text-gray-300 text-sm">
                  ✅ Günlük olan günler yeşil görünür. <strong>Yeşil güne tıklarsan direkt kayıtlı günlüğün açılır.</strong>
                  Günlük yoksa o güne tıklayınca yeni günlük yazarsın.
                </p>
              </div>

              <div className="text-sm text-gray-300">
                <span className="inline-flex items-center mr-4">
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block mr-2" />
                  Günlük var
                </span>
                <span className="inline-flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-500 inline-block mr-2" />
                  Günlük yok
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-300">⏳ Yükleniyor...</div>
            ) : (
              <>
                {/* Haftanın günleri */}
                <div className="grid grid-cols-7 gap-3 mb-3">
                  {weekDaysTR.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Günler */}
                <div className="grid grid-cols-7 gap-3">
                  {/* Ayın ilk gününden önce boş kutular */}
                  {Array.from({ length: leadingBlanks }).map((_, i) => (
                    <div
                      key={`blank-${monthKey}-${i}`}
                      className="rounded-xl border border-transparent"
                    />
                  ))}

                  {/* Ayın günleri */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateISO = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const hasJournal = Boolean(gunlukMap[dateISO]);

                    return (
                      <button
                        key={dateISO}
                        onClick={() => handleDayClick(dateISO)}
                        className={`relative rounded-xl border text-center py-3 transition-all hover:scale-[1.02] active:scale-95
                          ${
                            hasJournal
                              ? "bg-green-500/15 border-green-400/40 hover:border-green-300/60"
                              : "bg-gray-900/40 border-gray-700 hover:border-gray-500"
                          }`}
                        title={
                          hasJournal
                            ? "Bu günde günlük var (tıkla: aç)"
                            : "Bu güne günlük ekle (tıkla: yeni günlük)"
                        }
                        type="button"
                      >
                        <div className="text-lg font-bold">{day}</div>

                        {hasJournal ? (
                          <div className="mt-1 text-[11px] text-green-300 font-semibold flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                            Aç
                          </div>
                        ) : (
                          <div className="mt-1 text-[11px] text-gray-400 font-semibold flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                            Yaz
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {isActiveStudentMissing && (
              <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-700/40 text-red-200">
                ❌ Öğrenci oturumu bulunamadı. Lütfen tekrar giriş yap.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026–2028 Ay Günlüğü - Ay Takvimi</p>
<p className="text-gray-400 text-sm mt-2 font-medium">Created by Candemir Yurdagül</p>        </div>
      </footer>
    </div>
  );
}

export default AyTakvimi;
