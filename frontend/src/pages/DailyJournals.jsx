import React, { useState } from 'react';
import { dailyJournals, observationNotes } from '../data/mockData';

// TEST: Console'a yazdır
console.log('TEST - dailyJournals:', dailyJournals);
console.log('TEST - observationNotes:', observationNotes);

const JournalPage = () => {
  const [selectedJournal, setSelectedJournal] = useState(dailyJournals[0]);
  const [activeView, setActiveView] = useState('gunluk');

  const getRatingColor = (rating) => {
    const colors = {
      'Mükemmel': 'text-green-400',
      'Çok İyi': 'text-blue-400',
      'Zor': 'text-orange-400',
      'Görünmez': 'text-gray-400'
    };
    return colors[rating] || 'text-gray-400';
  };

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

        {/* Günlük Kayıtlar View */}
        {activeView === 'gunluk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Journal List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Günlük Kayıtları</h2>
              <div className="space-y-3">
                {dailyJournals.map((journal) => (
                  <button
                    key={journal.id}
                    onClick={() => setSelectedJournal(journal)}
                    className={`w-full text-left bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 ${
                      selectedJournal.id === journal.id
                        ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{journal.emoji}</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">{journal.date}</div>
                        <div className="text-xs text-blue-400 mb-2">{journal.phase}</div>
                        <h3 className="font-bold mb-2 line-clamp-2">{journal.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{journal.preview}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-lg flex items-center gap-1">
                            <span>🕐</span> {journal.time}
                          </span>
                          <span className={`text-xs px-2 py-1 bg-white/10 rounded-lg ${getRatingColor(journal.rating)}`}>
                            {journal.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content - Journal Detail */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1a1f3a]/80 to-[#0a0e27]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="text-7xl">{selectedJournal.emoji}</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedJournal.title}</h2>
                    <div className="text-gray-400 mb-4">{selectedJournal.date} - {selectedJournal.time}</div>
                    <div className="flex gap-3">
                      <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 font-medium">
                        {selectedJournal.phase}
                      </span>
                      <span className={`px-4 py-2 bg-white/10 rounded-xl border border-white/20 font-medium ${getRatingColor(selectedJournal.rating)}`}>
                        {selectedJournal.rating}
                      </span>
                      <span className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 font-medium text-gray-300">
                        ☁️ {selectedJournal.weather}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="prose prose-invert max-w-none">
                    {selectedJournal.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>🔭</span>
                      Gece Gözlemleri
                    </h3>
                    <ul className="space-y-2">
                      {selectedJournal.observations.map((obs, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-yellow-400 mt-1">⭐</span>
                          <span className="text-gray-300">{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gözlem Notları View */}
        {activeView === 'gozlem' && (
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
        )}
      </div>
    </div>
  );
};

export default JournalPage;