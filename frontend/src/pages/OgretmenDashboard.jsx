import React, { useState } from 'react';

// DEMO ÖĞRENCİ VERİLERİ - EĞİTİM YILLARI EKLENDİ
const demoOgrenciler = [
  { 
    id: 1, 
    ad: "Ahmet Yılmaz", 
    sinif: "5-A", 
    egitimYili: "2026-2027",
    sonGunluk: "2026-01-15", 
    durum: "Aktif",
    ogrenciNo: "1001",
    gunlukSayisi: 3,
    avatar: "👦"
  },
  { 
    id: 2, 
    ad: "Ayşe Demir", 
    sinif: "5-B", 
    egitimYili: "2026-2027",
    sonGunluk: "2026-01-14", 
    durum: "Aktif",
    ogrenciNo: "1002",
    gunlukSayisi: 5,
    avatar: "👧"
  },
  { 
    id: 3, 
    ad: "Mehmet Kaya", 
    sinif: "5-A", 
    egitimYili: "2025-2026",
    sonGunluk: "2025-12-20", 
    durum: "Mezun",
    ogrenciNo: "2001",
    gunlukSayisi: 7,
    avatar: "👦"
  },
  { 
    id: 4, 
    ad: "Zeynep Arslan", 
    sinif: "5-B", 
    egitimYili: "2025-2026",
    sonGunluk: "2025-12-15", 
    durum: "Mezun",
    ogrenciNo: "2002",
    gunlukSayisi: 2,
    avatar: "👧"
  },
  { 
    id: 5, 
    ad: "Can Öztürk", 
    sinif: "5-A", 
    egitimYili: "2026-2027",
    sonGunluk: "2026-01-09", 
    durum: "Aktif",
    ogrenciNo: "1003",
    gunlukSayisi: 4,
    avatar: "👦"
  },
];

// DEMO GÜNLÜK VERİLERİ
const demoGunlukler = [
  {
    id: 1,
    ogrenciId: 1,
    ogrenciAd: "Ahmet Yılmaz",
    tarih: "2026-01-15",
    baslik: "Ayın Hareketleri",
    icerik: "Ay bugün çok parlaktı. Gökyüzünde net görünüyordu. Teleskopla baktığımda kraterleri görebildim.",
    ayFazi: "🌕 Dolunay",
    yildiz: "4.5"
  },
  {
    id: 2,
    ogrenciId: 1,
    ogrenciAd: "Ahmet Yılmaz",
    tarih: "2026-01-10",
    baslik: "Yeni Ay Gözlemi",
    icerik: "Ay neredeyse görünmüyordu. Sadece ince bir hilal vardı. Yıldızlar daha net göründü.",
    ayFazi: "🌑 Hilal",
    yildiz: "3.0"
  },
  {
    id: 3,
    ogrenciId: 2,
    ogrenciAd: "Ayşe Demir",
    tarih: "2026-01-14",
    baslik: "Gözlem Notlarım",
    icerik: "Ay'ın sağ tarafı aydınlıktı. Bulutlar arasından parıldıyordu. Güzel bir manzara.",
    ayFazi: "🌓 Yarımay",
    yildiz: "5.0"
  },
];

function OgretmenDashboard() {
  const [ogrenciler] = useState(demoOgrenciler);
  const [seciliSinif, setSeciliSinif] = useState('Tümü');
  const [seciliEgitimYili, setSeciliEgitimYili] = useState('Tümü'); // YENİ
  const [seciliOgrenci, setSeciliOgrenci] = useState(null);

  // Eğitim yılları listesi
  const egitimYillari = ['Tümü', '2026-2027', '2025-2026', '2024-2025']; // YENİ
  
  // Sınıf filtreleme (sadece 5-A ve 5-B)
  const siniflar = ['Tümü', '5-A', '5-B'];

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
  const toplamGunluk = demoGunlukler.length;
  const aktifOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Aktif').length;
  const mezunOgrenci = filtrelenmisOgrenciler.filter(o => o.durum === 'Mezun').length;

  const handleOgrenciSec = (ogrenci) => {
    setSeciliOgrenci(ogrenci);
  };

  const handleGeriDon = () => {
    setSeciliOgrenci(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white p-4">
      {/* ARKA PLAN */}
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
            <div className="text-sm bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 py-2 rounded-xl border border-blue-700/50 backdrop-blur-sm">
              <span className="text-yellow-300">🌙</span> Demo Mod: Gerçek veriler Firebase ile gelecek
            </div>
          </div>
          
          {/* ÇIKIŞ BUTONU */}
          <div className="mt-4 flex gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Ana Sayfa
            </a>
            <a href="/OgretmenGiris" className="text-gray-400 hover:text-white transition-colors">
              Çıkış Yap
            </a>
          </div>
        </header>

        {/* İSTATİSTİK KARTLARI - AY TEMALI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl border border-blue-700/30 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Toplam Öğrenci</h3>
              <div className="text-2xl">👥</div>
            </div>
            <p className="text-3xl font-bold text-white">{toplamOgrenci}</p>
            <p className="text-sm text-blue-300 mt-2">{seciliEgitimYili === 'Tümü' ? 'Tüm yıllar' : seciliEgitimYili}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl border border-green-700/30 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Aktif Öğrenci</h3>
              <div className="text-2xl">⭐</div>
            </div>
            <p className="text-3xl font-bold text-white">{aktifOgrenci}</p>
            <p className="text-sm text-green-300 mt-2">Mevcut öğrenci</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Mezun Öğrenci</h3>
              <div className="text-2xl">🎓</div>
            </div>
            <p className="text-3xl font-bold text-white">{mezunOgrenci}</p>
            <p className="text-sm text-purple-300 mt-2">Geçmiş yıllar</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl rounded-2xl border border-yellow-700/30 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300">Toplam Günlük</h3>
              <div className="text-2xl">📚</div>
            </div>
            <p className="text-3xl font-bold text-white">{toplamGunluk}</p>
            <p className="text-sm text-yellow-300 mt-2">Ay gözlem kaydı</p>
          </div>
        </div>

        {/* FİLTRELEME ALANI */}
        <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">🌌 Filtreleme</h2>
          
          {/* EĞİTİM YILI FİLTRELEME - YENİ EKLENDİ */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-300">📅 Eğitim Yılı</h3>
            <div className="flex flex-wrap gap-3">
              {egitimYillari.map(yil => (
                <button 
                  key={yil}
                  onClick={() => setSeciliEgitimYili(yil)}
                  className={`px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    seciliEgitimYili === yil
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 backdrop-blur-sm'
                  }`}
                >
                  {yil === 'Tümü' ? '📅 Tüm Yıllar' : yil}
                </button>
              ))}
            </div>
          </div>

          {/* SINIF FİLTRELEME */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-gray-300">🏫 Sınıf</h3>
            <div className="flex flex-wrap gap-3">
              {siniflar.map(sinif => (
                <button 
                  key={sinif}
                  onClick={() => setSeciliSinif(sinif)}
                  className={`px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    seciliSinif === sinif
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 backdrop-blur-sm'
                  }`}
                >
                  {sinif === 'Tümü' ? '🏫 Tüm Sınıflar' : sinif}
                </button>
              ))}
            </div>
          </div>
        </div>

        {seciliOgrenci ? (
          /* ÖĞRENCİ DETAY SAYFASI - AY TEMALI */
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
                    : 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border border-yellow-700/50'
                }`}>
                  {seciliOgrenci.durum}
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
                    <div key={gunluk.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
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
                  <div className="text-6xl mb-4 opacity-50">🌑</div>
                  <p className="text-xl text-gray-400">Bu öğrencinin henüz günlüğü yok.</p>
                  <p className="text-gray-500 mt-2">Öğrenci henüz ay gözlemi yapmamış.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ÖĞRENCİ LİSTESİ - AY TEMALI */
          <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">👥 Öğrenci Listesi</h2>
                  <p className="text-gray-300">
                    {seciliEgitimYili === 'Tümü' ? 'Tüm eğitim yılları' : seciliEgitimYili} • 
                    {seciliSinif === 'Tümü' ? ' Tüm sınıflar' : ` ${seciliSinif}`} • 
                    Toplam {filtrelenmisOgrenciler.length} öğrenci
                  </p>
                </div>
                <div className="text-sm bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-700">
                  <span className="text-blue-400">📅</span> Eğitim Yılı: {seciliEgitimYili}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Öğrenci</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Sınıf</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Eğitim Yılı</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Öğrenci No</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Günlük</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtrelenmisOgrenciler.map(ogrenci => (
                    <tr key={ogrenci.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{ogrenci.avatar}</div>
                          <div>
                            <div className="font-bold text-white text-lg">{ogrenci.ad}</div>
                            <div className="text-sm text-gray-400">Son günlük: {ogrenci.sonGunluk}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 rounded-xl text-sm font-medium border border-blue-700/50">
                          {ogrenci.sinif}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{ogrenci.egitimYili}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-lg text-sm border border-gray-700">
                          {ogrenci.ogrenciNo}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📖</span>
                          <span className="font-bold text-white text-xl">{ogrenci.gunlukSayisi}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          ogrenci.durum === 'Aktif' 
                            ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border border-green-700/50' 
                            : 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border border-yellow-700/50'
                        }`}>
                          {ogrenci.durum}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <button
                          onClick={() => handleOgrenciSec(ogrenci)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                        >
                          👁️ Günlükleri Gör
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 text-center text-gray-300 text-sm border-t border-white/10">
              <div className="flex items-center justify-center gap-3">
                <span className="text-yellow-400">⚠️</span>
                <p>
                  Demo mod: {filtrelenmisOgrenciler.length} demo öğrenci gösteriliyor. 
                  Firebase bağlantısı yapıldığında gerçek öğrenci verileri görünecek.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Ay Günlüğü Öğretmen Paneli • {new Date().getFullYear()} • Sadece 5. sınıf öğretmenleri için</p>
        </div>
      </div>
    </div>
  );
}

export default OgretmenDashboard;