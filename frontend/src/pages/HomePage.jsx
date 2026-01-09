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
      {/* Hero Section with Background */}
      <div className="relative min-h-screen flex flex-col">
        {/* Large Background Moon Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://customer-assets.emergentagent.com/job_moontracker-5/artifacts/zksvk4wp_AY%20ARKAPLAN.jpg)',
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/60 via-[#0a0e27]/70 to-[#0a0e27]"></div>
        
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center">
            Ay Hakkında Her Şey
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 text-center max-w-3xl">
            Gecenin en güzel arkadaşımız Ay hakkında merak ettiğin her şeyi öğren!
          </p>
          
          {/* Current Moon Phase Info */}
          <div className="bg-[#1a1f3a]/60 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-4 mb-16">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🌕</div>
              <div>
                <div className="text-2xl font-bold">Dolunay</div>
                <div className="text-gray-400">%98 Aydınlatılmış</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 pb-8 w-full">
          <div className="bg-[#1a1f3a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-2 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Ay Hakkında */}
        {activeTab === 'ay-hakkinda' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ay Hakkında</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Ay hakkında merak ettiğin temel bilgiler!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">🌑</div>
                <h3 className="text-2xl font-bold mb-3">Ay'ın Yüzeyi Nasıl?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ay'ın yüzeyi gri renkli ve tozlu. Üzerinde büyük delikler (kraterler), dağlar ve düz alanlar var. Uzaydan gelen taşlar çarptığı için bu şekil oluşmuş.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">💨</div>
                <h3 className="text-2xl font-bold mb-3">Ay'da Hava Var mı?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ay'da neredeyse hiç hava yok! Bu yüzden nefes alamazsın, ses duyamazsın ve çok sıcak-soğuk olur. Astronotlar özel kıyafet giymelidir.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold mb-3">Ay'da Yaşam Olabilir mi?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Hayır! Ay'da su, hava, uygun sıcaklık yok. Hiç bitki veya hayvan yaşayamaz. Sadece astronotlar özel ekipmanlarla gidebilir.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">🔄</div>
                <h3 className="text-2xl font-bold mb-3">Ay Nasıl Hareket Eder?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ay hem kendi etrafında döner hem de Dünya'nın etrafında dolaşır. Bu hareketler sayesinde ay fazları (hilal, dolunay) ve gelgitler oluşur.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">👁️</div>
                <h3 className="text-2xl font-bold mb-3">Neden Hep Aynı Yüzü Görürüz?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ay'ın iki dönüş hareketi eşit sürede olduğu için hep aynı tarafını görürüz. Arkasındaki yarısını hiç göremeyiz!
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="text-5xl mb-4">📏</div>
                <h3 className="text-2xl font-bold mb-3">Ay Ne Kadar Uzakta?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ay, Dünya'dan 384.400 km uzakta. Bu mesafe çok uzun - arabayla gitsen 4 ay sürer! Dünya'nın 30 katı kadar uzak.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ay Fazları */}
        {activeTab === 'ay-fazlari' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ay Fazları</h2>
              <p className="text-xl text-gray-300">Ay'ın farklı şekilleri ve nasıl değiştiği</p>
            </div>

            {/* Main Phase Display */}
            <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
              <div className="text-9xl mb-6 animate-float">{selectedPhase.emoji}</div>
              <h3 className="text-3xl font-bold mb-4">{selectedPhase.name}</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                {selectedPhase.description}
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPhase}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
                >
                  ← Önceki Faz
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
                >
                  Sonraki Faz →
                </button>
              </div>
            </div>

            {/* All Phases Grid */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Ay'ın Şekilleri</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {moonPhases.map((phase, index) => (
                  <button
                    key={phase.id}
                    onClick={() => {
                      setSelectedPhase(phase);
                      setCurrentPhaseIndex(index);
                    }}
                    className={`bg-[#1a1f3a]/60 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 ${
                      selectedPhase.id === phase.id
                        ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="text-4xl mb-2">{phase.emoji}</div>
                    <p className="text-xs text-gray-300">{phase.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ay'ın Özellikleri */}
        {activeTab === 'ay-ozellikleri' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ay'ın Özellikleri</h2>
              <p className="text-xl text-gray-300">Ay'ın büyüklüğü, hareketi ve diğer özellikları</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moonProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
                >
                  <h3 className="text-2xl font-bold mb-3">{property.title}</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-4">{property.value}</div>
                  <p className="text-gray-300 leading-relaxed">{property.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dünya'ya Etkileri */}
        {activeTab === 'dunya-etkileri' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ay Dünya'yı Nasıl Etkiler?</h2>
              <p className="text-xl text-gray-300">Ay'ın Dünya'mıza ve hayatımıza etkisi</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earthEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{effect.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{effect.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{effect.description}</p>
                  <div className="text-sm text-blue-400 font-medium">{effect.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
