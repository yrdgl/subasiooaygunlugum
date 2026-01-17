import React, { useState } from 'react';
import { moonPhases, moonProperties, earthEffects } from '../data/mockData';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('ay-fazlari');
  const [selectedPhase, setSelectedPhase] = useState(moonPhases[0]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const handlePrevPhase = () => {
    const newIndex = currentPhaseIndex > 0 ? currentPhaseIndex - 1 : moonPhases.length - 1;
    setCurrentPhaseIndex(newIndex);
    setSelectedPhase(moonPhases[newIndex]);
  };

  const handleNextPhase = () => {
    const newIndex = currentPhaseIndex < moonPhases.length - 1 ? currentPhaseIndex + 1 : 0;
    setCurrentPhaseIndex(newIndex);
    setSelectedPhase(moonPhases[newIndex]);
  };

  const tabs = [
    { id: 'ay-hakkinda', label: 'Ay Hakkında' },
    { id: 'ay-fazlari', label: 'Ay Fazları' },
    { id: 'ay-ozellikleri', label: "Ay'ın Özellikleri" },
    { id: 'dunya-etkileri', label: "Dünya'ya Etkileri" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      {/* Hero + Tab + Content - TEK BÖLÜMDE */}
      <div className="relative">
        {/* Hero Background */}
        <div className="relative min-h-[35vh] md:min-h-[40vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://customer-assets.emergentagent.com/job_moontracker-5/artifacts/zksvk4wp_AY%20ARKAPLAN.jpg)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              filter: 'brightness(0.4)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/70 via-[#0a0e27]/50 to-[#0a0e27]"></div>
          
          <div className="relative z-10 px-6 pt-14 pb-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center">
                Ay Hakkında Her Şey
              </h1>
              <p className="text-base md:text-lg text-gray-100 mb-2 text-center max-w-3xl mx-auto">
                Gecenin en güzel arkadaşı Ay hakkında merak ettiğin her şeyi öğren!
              </p>
            </div>
          </div>
        </div>

        {/* Tab + Content Container - AYNI BÖLÜM, ÇOK YAKIN */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-4">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-[#1a1f3a]/95 to-[#0a0e27]/95 backdrop-blur-xl rounded-t-2xl border border-white/20 border-b-0 p-1.5 flex gap-1.5 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-3 rounded-t-lg font-medium transition-all duration-300 text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-inner'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content - TAB'LERİN HEMEN ALTINDA */}
          <div className="bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] rounded-b-2xl border border-white/20 border-t-0 p-6 md:p-8 shadow-lg">
            {/* Ay Hakkında */}
            {activeTab === 'ay-hakkinda' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Ay Hakkında</h2>
                  <p className="text-gray-300">
                    Ay hakkında merak ettiğin temel bilgiler!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">🌑</div>
                    <h3 className="text-lg font-bold mb-2">Ay'ın Yüzeyi Nasıl?</h3>
                    <p className="text-gray-300 text-sm">
                      Ay'ın yüzeyi gri renkli ve tozlu. Üzerinde büyük delikler (kraterler), dağlar ve düz alanlar var.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">💨</div>
                    <h3 className="text-lg font-bold mb-2">Ay'da Hava Var mı?</h3>
                    <p className="text-gray-300 text-sm">
                      Ay'da neredeyse hiç hava yok! Bu yüzden nefes alamazsın, ses duyamazsın ve çok sıcak-soğuk olur.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">🌱</div>
                    <h3 className="text-lg font-bold mb-2">Ay'da Yaşam Olabilir mi?</h3>
                    <p className="text-gray-300 text-sm">
                      Hayır! Ay'da su, hava, uygun sıcaklık yok. Hiç bitki veya hayvan yaşayamaz.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">🔄</div>
                    <h3 className="text-lg font-bold mb-2">Ay Nasıl Hareket Eder?</h3>
                    <p className="text-gray-300 text-sm">
                      Ay hem kendi etrafında döner hem de Dünya'nın etrafında dolaşır.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">👁️</div>
                    <h3 className="text-lg font-bold mb-2">Neden Hep Aynı Yüzü Görürüz?</h3>
                    <p className="text-gray-300 text-sm">
                      Ay'ın iki dönüş hareketi eşit sürede olduğu için hep aynı tarafını görürüz.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500">
                    <div className="text-4xl mb-3">📏</div>
                    <h3 className="text-lg font-bold mb-2">Ay Ne Kadar Uzakta?</h3>
                    <p className="text-gray-300 text-sm">
                      Ay, Dünya'dan 384.400 km uzakta. Bu mesafe çok uzun - arabayla gitsen 4 ay sürer!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ay Fazları */}
            {activeTab === 'ay-fazlari' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Ay Fazları</h2>
                  <p className="text-gray-300">Ay'ın farklı şekilleri ve nasıl değiştiği</p>
                </div>

                {/* Main Phase Display */}
                <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                  <div className="text-7xl mb-4 animate-float">{selectedPhase.emoji}</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{selectedPhase.name}</h3>
                  <p className="text-gray-300 max-w-2xl mx-auto mb-5 text-sm">
                    {selectedPhase.description}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handlePrevPhase}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      ← Önceki Faz
                    </button>
                    <button
                      onClick={handleNextPhase}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Sonraki Faz →
                    </button>
                  </div>
                </div>

                {/* All Phases Grid */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3 text-center">Ay'ın Tüm Şekilleri</h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {moonPhases.map((phase, index) => (
                      <button
                        key={phase.id}
                        onClick={() => {
                          setSelectedPhase(phase);
                          setCurrentPhaseIndex(index);
                        }}
                        className={`bg-[#1a1f3a] rounded-lg border p-3 transition-all duration-300 hover:scale-105 ${
                          selectedPhase.id === phase.id
                            ? 'border-blue-500 shadow-md shadow-blue-500/30 bg-blue-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-1">{phase.emoji}</div>
                        <p className="text-xs text-gray-300 font-medium">{phase.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ay'ın Özellikleri */}
            {activeTab === 'ay-ozellikleri' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Ay'ın Özellikleri</h2>
                  <p className="text-gray-300">Ay'ın büyüklüğü, hareketi ve diğer özellikleri</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moonProperties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500"
                    >
                      <h3 className="text-lg font-bold mb-2">{property.title}</h3>
                      <div className="text-2xl font-bold text-blue-400 mb-2">{property.value}</div>
                      <p className="text-gray-300 text-sm">{property.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dünya'ya Etkileri */}
            {activeTab === 'dunya-etkileri' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Ay Dünya'yı Nasıl Etkiler?</h2>
                  <p className="text-gray-300">Ay'ın Dünya'mıza ve hayatımıza etkisi</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {earthEffects.map((effect) => (
                    <div
                      key={effect.id}
                      className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-xl border border-white/10 p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500 group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{effect.icon}</div>
                      <h3 className="text-lg font-bold mb-2">{effect.title}</h3>
                      <p className="text-gray-300 text-sm mb-2">{effect.description}</p>
                      <div className="text-xs text-blue-400 font-medium">{effect.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ÖĞRENCİ PLATFORMU BÖLÜMÜ - TAB/CONTENT'DEN SONRA */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-gradient-to-r from-[#1a1f3a] to-[#0a0e27] rounded-2xl border border-white/10 p-6 md:p-8 shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-3 text-white">
            🌙 Ay Günlüğü Öğrenci Platformu
          </h2>
          <p className="text-gray-300 text-center text-sm mb-4">
            Ay gözlem günlüğüne katıl, her akşam ayın durumunu kaydet!
          </p>
          
          <div className="flex flex-col md:flex-row gap-2 justify-center mb-4">
            <a 
              href="/OgrenciKayit"
              className="flex-1 py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] text-center text-sm"
            >
              📝 Öğrenci Kayıt
            </a>
            
            <a 
              href="/OgrenciGiris"
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] text-center text-sm"
            >
              🔓 Öğrenci Giriş
            </a>
          </div>
          
          {/* ÖĞRETMEN GİRİŞİ */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs mb-2 text-center">Öğretmen misiniz?</p>
            <div className="flex justify-center">
              <a 
                href="/OgretmenGiris" 
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all hover:scale-[1.02]"
              >
                👨‍🏫 Öğretmen Girişi
              </a>
            </div>
            <p className="text-gray-500 text-xs text-center mt-1">
              Sadece yetkili öğretmenler için
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="text-center text-gray-500 text-xs">
          <p>Ay Günlüğü • Öğrenci ve Öğretmen Platformu • {new Date().getFullYear()}</p>
          <p className="text-gray-600 text-xs mt-1">
            Ay hakkında bilgi edin, gözlemlerini kaydet, öğretmenlerinden yıldız kazan!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;