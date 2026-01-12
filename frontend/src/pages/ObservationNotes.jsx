import React, { useState } from 'react';
import { observationNotes } from '../data/mockData';

const ObservationNotes = () => {
  const [activeView, setActiveView] = useState('gozlem');

  if (activeView === 'gunluk') {
    window.location.href = '/gunluk-kayitlar';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Candemir'in Ay Günlüğü</h1>
          <p className="text-xl text-gray-300">Ay gözlemlerim ve notlarım</p>
        </div>

        {/* Toggle View */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1a1f3a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-2 flex gap-2">
            <button
              onClick={() => setActiveView('gunluk')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeView === 'gunluk'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📖</span>
              Günlük Kayıtları
            </button>
            <button
              onClick={() => setActiveView('gozlem')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeView === 'gozlem'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🔭</span>
              Gözlem Notları
            </button>
          </div>
        </div>

        {/* Observation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {observationNotes.map((note) => (
            <div
              key={note.id}
              className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-500/50 group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🔭</span>
                <div className="text-sm text-blue-400 bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30">
                  {note.date}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                {note.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {note.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400">🌙 Ay Fazı:</span>
                  <span className="text-gray-300">{note.phase}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">👁️ Görünürlük:</span>
                  <span className="text-gray-300">{note.visibility}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-orange-400">⏱️ Gözlem Süresi:</span>
                  <span className="text-gray-300">{note.duration}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-xs text-gray-400 italic">
                  <span className="font-semibold text-gray-300">Not:</span> {note.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObservationNotes;
