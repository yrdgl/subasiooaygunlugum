import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Lock, User, Mail } from "lucide-react";

function OgretmenGiris() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Firebase Authentication ile giriş yap
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );
      
      const user = userCredential.user;
      
      // 2. Firestore'dan öğretmen bilgilerini kontrol et
      const teacherDoc = await getDoc(doc(db, "teachers", user.email));
      
      if (!teacherDoc.exists()) {
        // Bu kullanıcı teachers koleksiyonunda yok
        await auth.signOut();
        throw new Error("Bu email adresi öğretmen olarak kayıtlı değil");
      }
      
      const teacherData = teacherDoc.data();
      
      if (teacherData.role !== "teacher") {
        await auth.signOut();
        throw new Error("Bu kullanıcının öğretmen yetkisi yok");
      }
      
      // 3. Başarılı giriş - localStorage'a kaydet
      localStorage.setItem("isTeacher", "yes");
      localStorage.setItem("teacherEmail", user.email);
      localStorage.setItem("teacherLoginTime", new Date().toISOString());
      
      // 4. Dashboard'a yönlendir
      navigate("/OgretmenDashboard");
      
    } catch (err) {
      console.error("Giriş hatası:", err);
      
      // Kullanıcı dostu hata mesajları
      if (err.code === "auth/invalid-email") {
        setError("Geçersiz email adresi");
      } else if (err.code === "auth/user-not-found") {
        setError("Bu email adresi kayıtlı değil");
      } else if (err.code === "auth/wrong-password") {
        setError("Şifre hatalı");
      } else if (err.code === "auth/too-many-requests") {
        setError("Çok fazla deneme yaptınız. Lütfen bekleyin");
      } else if (err.message.includes("öğretmen olarak kayıtlı değil")) {
        setError("Bu email adresi öğretmen olarak kayıtlı değil");
      } else {
        setError(err.message || "Giriş başarısız");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4 sm:p-6">
      {/* Arkaplan efekti */}
      <div className="absolute inset-0 bg-[url('https://customer-assets.emergentagent.com/job_moontracker-5/artifacts/zksvk4wp_AY%20ARKAPLAN.jpg')] bg-cover bg-center opacity-10" />
      
      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Logo/Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 mb-4">
            <User size={32} className="text-yellow-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">👨‍🏫 Öğretmen Girişi</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            5. Sınıf Fen Bilimleri Öğretmen Paneli
          </p>
        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm sm:text-base text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email Adresi
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Öğretmen email adresiniz"
                className="w-full p-3 sm:p-4 bg-black/50 border border-gray-700 rounded-lg text-white text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                required
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                inputMode="email"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                📧
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Öğretmen email adresini girin</p>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-2 flex items-center gap-2">
              <Lock size={16} />
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 sm:p-4 bg-black/50 border border-gray-700 rounded-lg text-white text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all pr-12"
                required
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Şifrenizi girin</p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              </button>
            </div>
          </div>

          {/* Güvenlik Uyarısı */}
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 text-sm">🔐</span>
              <div>
                <p className="text-xs sm:text-sm text-yellow-300 font-medium mb-1">
                  Güvenlik Uyarısı
                </p>
                <p className="text-xs text-yellow-400/80">
                  Bu panel yalnızca yetkili öğretmenler içindir. Giriş bilgilerinizi kimseyle paylaşmayın.
                </p>
              </div>
            </div>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg flex items-center justify-center gap-2 min-h-[50px] shadow-lg hover:shadow-yellow-500/20"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Giriş Yap</span>
              </>
            )}
          </button>
        </form>

        {/* Geri Dönüş Linki */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-gray-800/30 transition-colors"
          >
            <span>←</span>
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Ay Günlüğü • Öğretmen Paneli v1.0 • {new Date().getFullYear()}
          </p>
<p className="text-gray-400 text-sm mt-2 font-medium">Created by Candemir Yurdagül</p>
          <p className="text-xs text-gray-700 mt-1">
            🔒 Firebase Authentication ile korunmaktadır
          </p>
        </div>
      </div>
    </div>
  );
}

export default OgretmenGiris;