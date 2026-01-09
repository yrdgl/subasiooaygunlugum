// frontend/src/pages/OgrenciKayit.js
import React from 'react';

function OgrenciKayit() {
  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      backgroundColor: '#0f172a',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#fbbf24' }}>
        🌙 ÖĞRENCİ KAYIT SAYFASI
      </h1>
      <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
        Bu sayfaya öğrenciler kayıt olacak
      </p>
      
      <div style={{
        maxWidth: '500px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#1e293b',
        borderRadius: '10px'
      }}>
        <h2>Kayıt Formu (Yakında)</h2>
        <p>Buraya form eklenecek...</p>
      </div>
      
      <a 
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Ana Sayfaya Dön
      </a>
    </div>
  );
}

export default OgrenciKayit;