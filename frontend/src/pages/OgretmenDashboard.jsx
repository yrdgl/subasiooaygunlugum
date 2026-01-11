import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// DEMO ÖĞRENCİ VERİLERİ
const demoOgrenciler = [
  { 
    id: 1, 
    ad: "Ahmet Yılmaz", 
    sinif: "5-A", 
    sonGunluk: "2026-01-15", 
    durum: "Aktif",
    email: "ahmet@demo.com",
    gunlukSayisi: 3,
    avatar: "👦"
  },
  { 
    id: 2, 
    ad: "Ayşe Demir", 
    sinif: "5-B", 
    sonGunluk: "2026-01-14", 
    durum: "Aktif",
    email: "ayse@demo.com",
    gunlukSayisi: 5,
    avatar: "👧"
  },
  { 
    id: 3, 
    ad: "Mehmet Kaya", 
    sinif: "6-A", 
    sonGunluk: "2026-01-12", 
    durum: "Aktif",
    email: "mehmet@demo.com",
    gunlukSayisi: 7,
    avatar: "👦"
  },
  { 
    id: 4, 
    ad: "Zeynep Arslan", 
    sinif: "6-B", 
    sonGunluk: "2026-01-10", 
    durum: "Pasif",
    email: "zeynep@demo.com",
    gunlukSayisi: 2,
    avatar: "👧"
  },
  { 
    id: 5, 
    ad: "Can Öztürk", 
    sinif: "7-A", 
    sonGunluk: "2026-01-09", 
    durum: "Aktif",
    email: "can@demo.com",
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
    ayFazi: "Dolunay",
    yildiz: "4.5"
  },
  {
    id: 2,
    ogrenciId: 1,
    ogrenciAd: "Ahmet Yılmaz",
    tarih: "2026-01-10",
    baslik: "Yeni Ay Gözlemi",
    icerik: "Ay neredeyse görünmüyordu. Sadece ince bir hilal vardı. Yıldızlar daha net göründü.",
    ayFazi: "Hilal",
    yildiz: "3.0"
  },
  {
    id: 3,
    ogrenciId: 2,
    ogrenciAd: "Ayşe Demir",
    tarih: "2026-01-14",
    baslik: "Gözlem Notlarım",
    icerik: "Ay'ın sağ tarafı aydınlıktı. Bulutlar arasından parıldıyordu. Güzel bir manzara.",
    ayFazi: "Yarımay",
    yildiz: "5.0"
  },
  {
    id: 4,
    ogrenciId: 3,
    ogrenciAd: "Mehmet Kaya",
    tarih: "2026-01-12",
    baslik: "Ay ve Bulutlar",
    icerik: "Bulutlu bir geceydi. Ay bazen görünüyor bazen kayboluyordu. İlginç bir gözlem oldu.",
    ayFazi: "Şişkin Ay",
    yildiz: "4.0"
  },
];

function OgretmenDashboard() {
  const [ogrenciler] = useState(demoOgrenciler);
  const [seciliSinif, setSeciliSinif] = useState('Tümü');
  const [seciliOgrenci, setSeciliOgrenci] = useState(null);

  // Seçili öğrencinin günlüklerini filtrele
  const ogrenciGunlukleri = seciliOgrenci 
    ? demoGunlukler.filter(g => g.ogrenciId === seciliOgrenci.id)
    : [];

  // İstatistikleri hesapla
  const toplamOgrenci = ogrenciler.length;
  const toplamGunluk = demoGunlukler.length;
  const aktifOgrenci = ogrenciler.filter(o => o.durum === 'Aktif').length;

  // Sınıf filtreleme
  const siniflar = ['Tümü', '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B'];
  const filtrelenmisOgrenciler = seciliSinif === 'Tümü' 
    ? ogrenciler 
    : ogrenciler.filter(o => o.sinif === seciliSinif);

  const handleOgrenciSec = (ogrenci) => {
    setSeciliOgrenci(ogrenci);
  };

  const handleGeriDon = () => {
    setSeciliOgrenci(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* BAŞLIK */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Öğretmen Paneli</h1>
          <p className="text-gray-600">Öğrencilerin Ay Günlüklerini Takip Edin</p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
            🔥 DEMO MOD: Firebase bağlantısı yapılana kadar demo verilerle çalışır
          </div>
        </header>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Toplam Öğrenci</h3>
            <p className="text-2xl font-bold text-blue-600">{toplamOgrenci}</p>
            <p className="text-sm text-gray-500 mt-1">Demo veri</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Toplam Günlük</h3>
            <p className="text-2xl font-bold text-green-600">{toplamGunluk}</p>
            <p className="text-sm text-gray-500 mt-1">Demo kayıt</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Aktif Öğrenci</h3>
            <p className="text-2xl font-bold text-purple-600">{aktifOgrenci}</p>
            <p className="text-sm text-gray-500 mt-1">Son 7 gün</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Son Giriş</h3>
            <p className="text-lg font-bold text-gray-800">Bugün</p>
            <p className="text-sm text-gray-500 mt-1">Demo modunda</p>
          </div>
        </div>

        {/* SINIF FİLTRELEME */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Sınıf Filtreleme</h2>
          <div className="flex flex-wrap gap-2">
            {siniflar.map(sinif => (
              <button 
                key={sinif}
                onClick={() => setSeciliSinif(sinif)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  seciliSinif === sinif
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 hover:bg-blue-100 text-gray-700'
                }`}
              >
                {sinif}
              </button>
            ))}
          </div>
        </div>

        {seciliOgrenci ? (
          /* ÖĞRENCİ DETAY SAYFASI */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleGeriDon}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Geri Dön
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {seciliOgrenci.avatar} {seciliOgrenci.ad}
                    </h2>
                    <p className="text-gray-600">
                      {seciliOgrenci.sinif} • {seciliOgrenci.email} • {seciliOgrenci.gunlukSayisi} günlük
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  seciliOgrenci.durum === 'Aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {seciliOgrenci.durum}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Günlük Kayıtları</h3>
              
              {ogrenciGunlukleri.length > 0 ? (
                <div className="space-y-4">
                  {ogrenciGunlukleri.map(gunluk => (
                    <div key={gunluk.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{gunluk.baslik}</h4>
                          <p className="text-sm text-gray-600">{gunluk.tarih} • {gunluk.ayFazi}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-500">
                            {'★'.repeat(Math.floor(gunluk.yildiz))}
                            {'☆'.repeat(5 - Math.floor(gunluk.yildiz))}
                          </div>
                          <span className="text-sm text-gray-500">{gunluk.yildiz}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{gunluk.icerik}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Bu öğrencinin henüz günlüğü yok.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ÖĞRENCİ LİSTESİ */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Öğrenci Listesi</h2>
              <p className="text-gray-600">
                {seciliSinif === 'Tümü' 
                  ? 'Tüm öğrenciler' 
                  : `${seciliSinif} sınıfı öğrencileri`
                } • Toplam {filtrelenmisOgrenciler.length} öğrenci
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öğrenci</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sınıf</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Günlük</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Günlük Sayısı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtrelenmisOgrenciler.map(ogrenci => (
                    <tr key={ogrenci.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{ogrenci.avatar}</div>
                          <div>
                            <div className="font-medium text-gray-900">{ogrenci.ad}</div>
                            <div className="text-sm text-gray-500">{ogrenci.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {ogrenci.sinif}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{ogrenci.sonGunluk}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">{ogrenci.gunlukSayisi}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          ogrenci.durum === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ogrenci.durum}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOgrenciSec(ogrenci)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Günlükleri Gör
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 text-center text-gray-600 text-sm">
              <p>🔥 Demo mod: Bu veriler gerçek değildir. Firebase bağlantısı yapıldığında gerçek veriler görünecek.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OgretmenDashboard;