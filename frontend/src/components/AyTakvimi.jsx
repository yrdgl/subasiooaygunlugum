import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AyTakvimi = ({ yazilanGunler = [], onGunSec }) => {
  const [suankiTarih, setSuankiTarih] = useState(new Date());
  
  // Ay ve yıl bilgileri
  const ayAdlari = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const haftaGunleri = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  
  // Takvim oluşturma fonksiyonu
  const takvimiOlustur = () => {
    const yil = suankiTarih.getFullYear();
    const ay = suankiTarih.getMonth();
    
    // Ayın ilk ve son günü
    const ilkGun = new Date(yil, ay, 1);
    const sonGun = new Date(yil, ay + 1, 0);
    
    // İlk günün haftanın kaçıncı günü olduğu (Pazartesi=0)
    const ilkGunIndex = (ilkGun.getDay() + 6) % 7;
    
    const gunler = [];
    
    // Boş hücreler (ayın ilk gününden önce)
    for (let i = 0; i < ilkGunIndex; i++) {
      gunler.push({ tarih: null, gun: '', bos: true });
    }
    
    // Ayın günleri
    for (let i = 1; i <= sonGun.getDate(); i++) {
      const tarihStr = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const bugun = new Date().toISOString().split('T')[0] === tarihStr;
      const yaziVar = yazilanGunler.includes(tarihStr);
      
      gunler.push({
        tarih: tarihStr,
        gun: i,
        bugun,
        yaziVar,
        bos: false
      });
    }
    
    return gunler;
  };
  
  // Önceki ay
  const oncekiAyaGit = () => {
    setSuankiTarih(new Date(suankiTarih.getFullYear(), suankiTarih.getMonth() - 1, 1));
  };
  
  // Sonraki ay
  const sonrakiAyaGit = () => {
    setSuankiTarih(new Date(suankiTarih.getFullYear(), suankiTarih.getMonth() + 1, 1));
  };
  
  // Bugüne git
  const buguneGit = () => {
    setSuankiTarih(new Date());
  };
  
  // Gün tıklama
  const gunTikla = (tarih) => {
    if (tarih && onGunSec) {
      onGunSec(tarih);
    }
  };
  
  const gunler = takvimiOlustur();
  const haftalar = [];
  
  // Günleri haftalara böl
  for (let i = 0; i < gunler.length; i += 7) {
    haftalar.push(gunler.slice(i, i + 7));
  }
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 max-w-4xl mx-auto">
      {/* Takvim Başlığı */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={oncekiAyaGit}
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {ayAdlari[suankiTarih.getMonth()]} {suankiTarih.getFullYear()}
          </h2>
          <button
            onClick={buguneGit}
            className="text-sm text-blue-400 hover:text-blue-300 mt-1"
          >
            Bugüne Git
          </button>
        </div>
        
        <button
          onClick={sonrakiAyaGit}
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
      
      {/* Haftanın Günleri */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {haftaGunleri.map((gun) => (
          <div key={gun} className="text-center font-semibold text-gray-400 py-2">
            {gun}
          </div>
        ))}
      </div>
      
      {/* Takvim Günleri */}
      <div className="grid grid-cols-7 gap-2">
        {gunler.map((gunBilgisi, index) => (
          <div
            key={index}
            className={`
              h-14 rounded-xl flex flex-col items-center justify-center relative
              ${gunBilgisi.bos ? 'invisible' : 'cursor-pointer'}
              ${gunBilgisi.bugun ? 'border-2 border-yellow-500' : 'border border-gray-700'}
              ${gunBilgisi.yaziVar 
                ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 hover:from-blue-800/40 hover:to-purple-800/40' 
                : 'bg-gray-900/30 hover:bg-gray-800/50'
              }
              transition-all duration-200
            `}
            onClick={() => gunTikla(gunBilgisi.tarih)}
            title={gunBilgisi.tarih || ''}
          >
            {!gunBilgisi.bos && (
              <>
                <span className={`text-lg font-semibold ${gunBilgisi.bugun ? 'text-yellow-300' : 'text-white'}`}>
                  {gunBilgisi.gun}
                </span>
                {gunBilgisi.yaziVar && (
                  <div className="absolute bottom-1 w-2 h-2 rounded-full bg-green-400"></div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Açıklama */}
      <div className="flex items-center justify-center mt-6 space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
          <span className="text-gray-300">Günlük Yazılmış</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full border-2 border-yellow-500 mr-2"></div>
          <span className="text-gray-300">Bugün</span>
        </div>
      </div>
    </div>
  );
};

export default AyTakvimi;