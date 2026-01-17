import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function TempPasswordPanel() {
  const [yil, setYil] = useState("2026-2027");
  const [no, setNo] = useState("");
  const [tempPass, setTempPass] = useState("");

  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const trim = (s) => (s || "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const y = trim(yil);
    const n = onlyDigits(no);
    const p = trim(tempPass);

    if (!y || !n || !p) {
      alert("Eğitim yılı / öğrenci no / geçici şifre zorunlu.");
      return;
    }
    if (p.length < 6) {
      alert("Geçici şifre en az 6 karakter olmalı.");
      return;
    }

    const studentId = `${y}_${n}`;
    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Bu öğrenci bulunamadı.");
      return;
    }

    await setDoc(
      ref,
      {
        tempPassword: p,
        mustChangePassword: true,
        tempPasswordSetAt: new Date().toISOString(),
      },
      { merge: true }
    );

    alert("Geçici şifre kaydedildi. Öğrenci bu şifreyle giriş yapacak.");
    setNo("");
    setTempPass("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3"
    >
      <h3 className="text-white font-bold">🔁 Geçici Şifre Ver</h3>

      <select
        value={yil}
        onChange={(e) => setYil(e.target.value)}
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
      >
        <option value="2025-2026">2025-2026</option>
        <option value="2026-2027">2026-2027</option>
        <option value="2027-2028">2027-2028</option>
      </select>

      <input
        value={no}
        onChange={(e) => setNo(e.target.value)}
        placeholder="Öğrenci No"
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
      />

      <input
        value={tempPass}
        onChange={(e) => setTempPass(e.target.value)}
        placeholder="Geçici Şifre (min 6)"
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
      />

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
      >
        Geçici Şifre Ata
      </button>
    </form>
  );
}
