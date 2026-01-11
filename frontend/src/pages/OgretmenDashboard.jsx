import React from 'react';

function OgretmenDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* BAŞLIK */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Öğretmen Paneli</h1>
          <p className="text-gray-600">Öğrencilerin Ay Günlüklerini Takip Edin</p>
        </header>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Toplam Öğrenci</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Bu Ay Günlük</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Aktif Sınıflar</h3>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Son Giriş</h3>
            <p className="text-lg text-gray-600">-</p>
          </div>
        </div>

        {/* SINIF FİLTRELEME */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Sınıf Filtreleme</h2>
          <div className="flex flex-wrap gap-2">
            {['5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B'].map(sinif => (
              <button key={sinif} className="px-4 py-2 bg-gray-200 hover:bg-blue-100 rounded-lg">
                {sinif}
              </button>
            ))}
          </div>
        </div>

        {/* ÖĞRENCİ LİSTESİ */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Öğrenci Listesi</h2>
            <p className="text-gray-600">Firebase bağlantısı yapıldığında burada öğrenciler görünecek</p>
          </div>
          <div className="p-4 text-center text-gray-500">
            <p>📡 Firebase bağlantısı bekleniyor...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OgretmenDashboard;