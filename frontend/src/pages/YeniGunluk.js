import React, { useState } from 'react';
import { 
  FaMoon, FaCalendarAlt, FaCamera, 
  FaArrowLeft, FaSave, FaImage 
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function YeniGunluk() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split('T')[0],
    ayEvresi: '',
    gozlem: '',
    havaDurumu: 'gunesli',
    notlar: ''
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.ayEvresi) {
      alert('Lütfen ayın evresini seçin!');
      return;
    }
    
    if (!formData.gozlem.trim()) {
      alert('Lütfen gözlem notlarınızı yazın!');
      return;
    }
    
    console.log('Günlük verisi:', formData);
    console.log('Fotoğraf:', foto ? foto.name : 'Yok');
    
    alert('Günlük kaydedildi! Dashboard\'a yönlendiriliyorsunuz...');
    
    setTimeout(() => {
      navigate('/OgrenciDashboard');
    }, 1500);
  };

  const handleDemoDoldur = () => {
    setFormData({
      tarih: new Date().toISOString().split('T')[0],
      ayEvresi: 'dolunay',
      gozlem: 'Bu akşam ay çok parlaktı. Gökyüzü açıktı ve yıldızlar da görünüyordu.',
      havaDurumu: 'gunesli',
      notlar: 'Ayı izlerken yanımda teleskop vardı.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header kısmını buraya ekleyeceğiz */}
    </div>
  );
}

export default YeniGunluk;