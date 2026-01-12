import React, { useState } from 'react';

// DEMO ÖĞRENCİ VERİLERİ - SADECE 5. SINIF (MEVCUT VE GELECEK)
const demoOgrenciler = [
  { 
    id: 1, 
    ad: "Ahmet Yılmaz", 
    sinif: "5-A", 
    egitimYili: "2025-2026", // ✅ MEVCUT 5. SINIF
    sonGunluk: "2026-01-15", 
    durum: "Aktif", 
    ogrenciNo: "1001",
    gunlukSayisi: 3,
    avatar: "👦",
    aciklama: "5. sınıf öğrencisi"
  },
  { 
    id: 2, 
    ad: "Ayşe Demir", 
    sinif: "5-B", 
    egitimYili: "2025-2026", // ✅ MEVCUT 5. SINIF
    sonGunluk: "2026-01-14", 
    durum: "Aktif", 
    ogrenciNo: "1002",
    gunlukSayisi: 5,
    avatar: "👧",
    aciklama: "5. sınıf öğrencisi"
  },
  { 
    id: 3, 
    ad: "Zeynep Arslan", 
    sinif: "5-B", 
    egitimYili: "2026-2027", // ✅ GELECEK 5. SINIF
    sonGunluk: "-", 
    durum: "Gelecek", 
    ogrenciNo: "3001",
    gunlukSayisi: 0,
    avatar: "👧",
    aciklama: "2026-2027'de 5. sınıf olacak"
  },
  { 
    id: 4, 
    ad: "Can Öztürk", 
    sinif: "5-A", 
    egitimYili: "2025-2026", // ✅ MEVCUT 5. SINIF
    sonGunluk: "2026-01-09", 
    durum: "Aktif", 
    ogrenciNo: "1003",
    gunlukSayisi: 4,
    avatar: "👦",
    aciklama: "5. sınıf öğrencisi"
  },
];

// DEMO GÜNLÜK VERİLERİ - TÜM ÖĞRENCİLER İÇİN
const demoGunlukler = [
  {
    id: 1,
    ogrenciId: 1, // Ahmet Yılmaz
    ogrenciAd: "Ahmet Yılmaz",
    tarih: "2026-01-15",
    baslik: "Ayın Hareketleri",
    icerik: "Ay bugün çok parlaktı. Gökyüzünde net görünüyordu.",
    ayFazi: "🌕 Dolunay",
    yildiz: "4.5"
  },
  {
    id: 2,
    ogrenciId: 1, // Ahmet Yılmaz (2. günlük)
    ogrenciAd: "Ahmet Yılmaz",
    tarih: "2026-01-10",
    baslik: "Yeni Ay Gözlemi",
    icerik: "Ay neredeyse görünmüyordu. Sadece ince bir hilal vardı.",
    ayFazi: "🌑 Hilal",
    yildiz: "3.0"
  },
  {
    id: 3,
    ogrenciId: 2, // Ayşe Demir
    ogrenciAd: "Ayşe Demir",
    tarih: "2026-01-14",
    baslik: "Gözlem Notlarım",
    icerik: "Ay'ın sağ tarafı aydınlıktı. Güzel bir manzara.",
    ayFazi: "🌓 Yarımay",
    yildiz: "5.0"
  },
  {
    id: 4,
    ogrenciId: 4, // Can Öztürk
    ogrenciAd: "Can Öztürk",
    tarih: "2026-01-09",
    baslik: "Ay ve Bulutlar",
    icerik: "Bulutlu bir geceydi. Ay bazen görünüyordu.",
    ayFazi: "🌔 Şişkin Ay",
    yildiz: "4.0"
  },
];

function OgretmenDashboard() {
  const [ogrenciler] = useState(demoOgrenciler);
  const [seciliSinif, setSeciliSinif] = useState('Tümü');
  const [seciliEgitimYili, setSeciliEgitimYili] = useState('2025-2026');
  const [seciliOgrenci, setSeciliOgrenci] = useState(null);

  // FİLTRE SEÇENEKLERİ - SADECE MEVCUT VE GELECEK 5. SINIF
  const egitimYillari = ['Tümü', '2025-2026', '2026-2027']; // ❌ 2024-2025 YOK
  const siniflar = ['Tümü', '5-A', '5-B'];

  // MEVCUT EĞİTİM YILI
  const currentEgitimYili = "2025-2026";

  // Filtreleme işlemi
  const filtrelenmisOgrenciler = ogrenciler.filter(ogrenci => {
    const sinifUygun = seciliSinif === 'Tümü' || ogrenci.sinif === seciliSinif;
    const yilUygun = seciliEgitimYili === 'Tümü' || ogrenci.egitimYili === seciliEgitimYili;
    return sinifUygun && yilUygun;
  });

  // Seçili öğrencinin günlüklerini filtrele
  const ogrenciGunlukleri = seciliOgrenci 
    ? demoGunlukler.filter(g => g.ogrenciId === seciliOgrenci.id)
    : [];

  // İstatistikleri hesapla
  const toplamOgrenci = filtrelenmisOgrenciler.length;
  const aktifOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Aktif').length;
  const gelecekOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Gelecek').length;
  const toplamGunluk = filtrelenmisOgrenciler.reduce((toplam, ogrenci) => toplam + ogrenci.gunlukSayisi, 0);

  // Günlükleri Gör butonu
  const handleOgrenciSec = (ogrenci) => {
    console.log('Öğrenci seçildi:', ogrenci.ad, 'ID:', ogrenci.id);
    setSeciliOgrenci(ogrenci);
  };

  const handleGeriDon = () => {
    setSeciliOgrenci(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white p-4">
      <div className="fixed inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_moontracker-5/artifacts/zksvk4wp_AY%20ARKAPLAN.jpg)',
        }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* BAŞLIK */}
        <header className="mb-8 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👨‍🏫 Öğretmen Paneli</h1>
              <p className="text-gray-300">5. Sınıf Öğrencilerinin Ay Günlüklerini Takip Edin</p>
            </div>
            <div className="text-sm bg-gradient-to-r from-green-900/50 to-emerald-900/50 px-4 py-2 rounded-xl border border-green-700/50 backdrop-blur-sm">
              <span className="text-yellow-300">🎯</span> Mevcut 5. Sınıf: {currentEgitimYili}
            </div>
          </div>
          
          <div className="mt-4 flex gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Ana Sayfa
            </a>
            <a href="/OgretmenGiris" className="text-gray-400 hover:text-white transition-colors">
              Çıkış Yap
            </a>
          </div>
        </header>

        {/* İSTATİSTİK KARTLARI - 3 KART (MEZUN YOK) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl border border-blue-700/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Filtrelenmiş Öğrenci</h3>
              <div className="text-2xl">👥</div>
            </div>
            <p className="text-3xl font-bold text-white">{toplamOgrenci}</p>
            <p className="text-sm text-blue-300 mt-2">
              {seciliEgitimYili === 'Tümü' ? 'Tüm yıllar' : seciliEgitimYili}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl border border-green-700/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Aktif Öğrenci</h3>
              <div className="text-2xl">⭐</div>
            </div>
            <p className="text-3xl font-bold text-white">{aktifOgrenci}</p>
            <p className="text-sm text-green-300 mt-2">5. sınıf ({currentEgitimYili})</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Gelecek Öğrenci</h3>
              <div className="text-2xl">🔮</div>
            </div>
            <p className="text-3xl font-bold text-white">{gelecekOgrenci}</p>
            <p className="text-sm text-purple-300 mt-2">2026-2027 (5. sınıf olacak)</p>
          </div>
        </div>

        {/* FİLTRELEME ALANI */}
        <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">🌌 Filtreleme Seçenekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* EĞİTİM YILI FİLTRELEME - SADECE 2 YIL */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-300 flex items-center gap-2">
                <span>📅</span> Eğitim Yılı
              </h3>
              <div className="flex flex-wrap gap-2">
                {egitimYillari.map(yil => (
                  <button 
                    key={yil}
                    onClick={() => setSeciliEgitimYili(yil)}
                    className={`px-4 py-2 rounded-lg transition-all ${
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
                    {yil === currentEgitimYili && ' (Mevcut)'}
                    {yil === '2026-2027' && ' (Gelecek)'}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <p className="text-green-400 mb-1">✅ <strong>2025-2026:</strong> Mevcut 5. sınıf öğrencileri</p>
                <p className="text-purple-400">🔮 <strong>2026-2027:</strong> Gelecek yıl 5. sınıf olacak</p>
              </div>
            </div>

            {/* SINIF FİLTRELEME */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-300 flex items-center gap-2">
                <span>🏫</span> Sınıf
              </h3>
              <div className="flex flex-wrap gap-2">
                {siniflar.map(sinif => (
                  <button 
                    key={sinif}
                    onClick={() => setSeciliSinif(sinif)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      seciliSinif === sinif
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {sinif === 'Tümü' ? 'Tüm Sınıflar' : sinif}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Sadece 5. sınıf öğrencileri (5-A ve 5-B)
              </p>
            </div>
          </div>
        </div>

        {seciliOgrenci ? (
          /* ÖĞRENCİ DETAY SAYFASI */
          <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-8">
            {/* ÖĞRENCİ BİLGİ BAŞLIĞI */}
            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleGeriDon}
                    className="text-gray-400 hover:text-white transition-colors text-lg"
                  >
                    ← Geri Dön
                  </button>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-5xl">{seciliOgrenci.avatar}</div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {seciliOgrenci.ad}
                        </h2>
                        <p className="text-gray-300">
                          {seciliOgrenci.sinif} • {seciliOgrenci.egitimYili} • No: {seciliOgrenci.ogrenciNo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  seciliOgrenci.durum === 'Aktif' 
                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50' 
                    : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-700/50'
                }`}>
                  {seciliOgrenci.durum}
                  {seciliOgrenci.durum === 'Gelecek' && ' (5. sınıf olacak)'}
                </span>
              </div>
            </div>

            {/* GÜNLÜK LİSTESİ */}
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📖</span> Günlük Kayıtları ({ogrenciGunlukleri.length})
              </h3>
              
              {ogrenciGunlukleri.length > 0 ? (
                <div className="space-y-6">
                  {ogrenciGunlukleri.map(gunluk => (
                    <div key={gunluk.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-white text-xl mb-2">{gunluk.baslik}</h4>
                          <div className="flex items-center gap-4 text-gray-300">
                            <span className="flex items-center gap-2">
                              <span className="text-lg">📅</span> {gunluk.tarih}
                            </span>
                            <span className="flex items-center gap-2">
                              {gunluk.ayFazi}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-yellow-400 text-2xl">
                            {'★'.repeat(Math.floor(gunluk.yildiz))}
                            {'☆'.repeat(5 - Math.floor(gunluk.yildiz))}
                          </div>
                          <span className="text-sm text-gray-400 mt-1">{gunluk.yildiz} / 5.0</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/30 rounded-xl p-4 mt-4 border border-gray-800/50">
                        <p className="text-gray-300 leading-relaxed">{gunluk.icerik}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📭</div>
                  <p className="text-xl text-gray-400">Bu öğrencinin henüz günlüğü yok.</p>
                  <p className="text-gray-500 mt-2">Öğrenci henüz ay gözlemi yapmamış.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ÖĞRENCİ LİSTESİ */
          <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">👥 5. Sınıf Öğrenci Listesi</h2>
                  <p className="text-gray-300">
                    {seciliEgitimYili === 'Tümü' ? 'Tüm eğitim yılları' : seciliEgitimYili} • 
                    {seciliSinif === 'Tümü' ? ' 5-A ve 5-B sınıfları' : ` ${seciliSinif}`} • 
                    Toplam {filtrelenmisOgrenciler.length} öğrenci
                  </p>
                </div>
                <div className="text-sm bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-700">
                  <span className="text-green-400">✅ Aktif</span> • 
                  <span className="text-purple-400 mx-2">🔮 Gelecek</span>
                </div>
              </div>
            </div>
            
            {filtrelenmisOgrenciler.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">Öğrenci</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">Sınıf</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">Eğitim Yılı</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">Durum</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">Günlük</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filtrelenmisOgrenciler.map(ogrenci => (
                      <tr key={ogrenci.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="text-3xl mr-4">{ogrenci.avatar}</div>
                            <div>
                              <div className="font-bold text-white text-lg">{ogrenci.ad}</div>
                              <div className="text-sm text-gray-400">
                                No: {ogrenci.ogrenciNo} • {ogrenci.aciklama}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 rounded-xl text-sm font-medium border border-blue-700/50">
                            {ogrenci.sinif}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className={
                              ogrenci.egitimYili === currentEgitimYili ? "text-green-400" : "text-purple-400"
                            }>
                              {ogrenci.egitimYili}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                            ogrenci.durum === 'Aktif' 
                              ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50' 
                              : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-700/50'
                          }`}>
                            {ogrenci.durum}
                            {ogrenci.durum === 'Gelecek' && ' (5. sınıf olacak)'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl ${ogrenci.gunlukSayisi > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                              {ogrenci.gunlukSayisi > 0 ? '📖' : '📭'}
                            </span>
                            <span className={`font-bold text-xl ${
                              ogrenci.gunlukSayisi > 0 ? 'text-white' : 'text-gray-500'
                            }`}>
                              {ogrenci.gunlukSayisi}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <button
                            onClick={() => handleOgrenciSec(ogrenci)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                              ogrenci.gunlukSayisi > 0
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={ogrenci.gunlukSayisi === 0}
                          >
                            {ogrenci.gunlukSayisi > 0 ? '👁️ Günlükleri Gör' : 'Günlük Yok'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <p className="text-xl text-gray-400">Bu filtrelerle eşleşen öğrenci bulunamadı.</p>
              </div>
            )}

            <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 text-center text-gray-300 text-sm border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span><strong>2025-2026:</strong> Mevcut 5. sınıf öğrencileri</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-purple-400 text-lg">🔮</span>
                  <span><strong>2026-2027:</strong> Gelecek yıl 5. sınıf olacak</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Ay Günlüğü • 5. Sınıf Öğretmen Paneli • {new Date().getFullYear()}</p>
          <p className="text-gray-600 text-xs mt-1">Mevcut Eğitim Yılı: {currentEgitimYili} • Sadece 5. sınıf öğrencileri</p>
        </div>
      </div>
    </div>
  );
}

export default OgretmenDashboard;