import React, { useState, useEffect } from 'react';

function DailyJournalForm({ studentData, onSave }) {
  const [observation, setObservation] = useState('');
  const [moonPhase, setMoonPhase] = useState('🌕');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bugünün tarihini varsayılan yap
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const moonPhases = [
    { emoji: '🌑', name: 'Yeni Ay', description: 'Ay görünmüyor' },
    { emoji: '🌒', name: 'Hilal', description: 'İnce şerit' },
    { emoji: '🌓', name: 'İlk Dördün', description: 'Sağ yarı aydınlık' },
    { emoji: '🌔', name: 'Şişkin Ay', description: 'Çoğu aydınlık' },
    { emoji: '🌕', name: 'Dolunay', description: 'Tamamen aydınlık' },
    { emoji: '🌖', name: 'Şişkin Ay', description: 'Çoğu aydınlık' },
    { emoji: '🌗', name: 'Son Dördün', description: 'Sol yarı aydınlık' },
    { emoji: '🌘', name: 'Hilal', description: 'İnce şerit' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!observation.trim()) {
      alert('Lütfen gözlem notunuzu yazın!');
      return;
    }

    setIsSubmitting(true);

    // Günlük kaydı oluştur
    const journalEntry = {
      id: `${studentData.id}-${date}`,
      studentId: studentData.id,
      studentName: studentData.name,
      studentSurname: studentData.surname,
      studentClass: studentData.class,
      date: date,
      moonPhase: moonPhase,
      moonPhaseName: moonPhases.find(p => p.emoji === moonPhase)?.name || 'Bilinmiyor',
      observation: observation,
      createdAt: new Date().toISOString()
    };

    try {
      // Şimdilik LocalStorage'a kaydedelim
      // Firebase ekleyince burayı değiştireceğiz
      const existingJournals = JSON.parse(localStorage.getItem('moonJournalEntries') || '[]');
      const updatedJournals = [...existingJournals, journalEntry];
      localStorage.setItem('moonJournalEntries', JSON.stringify(updatedJournals));

      // Formu temizle
      setObservation('');
      setMoonPhase('🌕');
      
      // Ana sayfaya bildir
      if (onSave) {
        onSave(journalEntry);
      }

      alert('✅ Gözleminiz kaydedildi!');
    } catch (error) {
      alert('❌ Kayıt sırasında hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPhase = moonPhases.find(p => p.emoji === moonPhase);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-white">📝 Bugünün Ay Gözlemini Kaydet</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SOL TARAF - FORM */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">📅 Gözlem Tarihi</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                {selectedPhase?.emoji} Ay'ın Bugünkü Durumu: <span className="text-purple-300">{selectedPhase?.name}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {moonPhases.map((phase, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMoonPhase(phase.emoji)}
                    className={`text-3xl rounded-lg p-2 transition-all duration-300 ${
                      moonPhase === phase.emoji 
                        ? 'bg-purple-600/50 border-2 border-purple-400 transform scale-110' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}
                    title={`${phase.name}: ${phase.description}`}
                  >
                    {phase.emoji}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">{selectedPhase?.description}</p>
            </div>
          </div>

          {/* SAĞ TARAF - NOT ALANI */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">📖 Gözlem Notun</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[180px]"
                placeholder="Ay'ı bugün nasıl gördün?...
• Hava açık mıydı, bulutlu muydu?
• Ay'ın şekli nasıldı?
• Özel bir gözlemin var mı?
• Duygu ve düşüncelerini yaz..."
              />
              <p className="text-gray-400 text-sm mt-1">
                Minimum 20 karakter ({observation.length}/20)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || observation.length < 20}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isSubmitting || observation.length < 20
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Kaydediliyor...
                </>
              ) : (
                <>
                  <span className="text-xl mr-2">💾</span> Gözlemi Kaydet
                </>
              )}
            </button>

            <div className="mt-4 text-center text-gray-400 text-sm">
              <p>✨ Öğretmeniniz bu günlüğü görebilecek</p>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center text-gray-300">
          <span className="text-2xl mr-3">👨‍🎓</span>
          <div>
            <p className="font-medium">{studentData?.name} {studentData?.surname} - {studentData?.class}</p>
            <p className="text-sm text-gray-400">5. Sınıf Fen Bilimleri - Ay Gözlem Günlüğü</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyJournalForm;
