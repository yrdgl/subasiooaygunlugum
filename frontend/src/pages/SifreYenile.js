import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset, auth } from "../lib/firebase";
import { FaMoon, FaArrowLeft, FaLock, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

function SifreYenile() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // URL'den oobCode (reset code) ve mode parametrelerini al
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");
    
    console.log("Mode:", mode);
    console.log("oobCode:", oobCode);
    
    // Eğer Firebase reset linkinden geldiysek
    if (mode === "resetPassword" && oobCode) {
      // Kodu localStorage'a kaydet
      localStorage.setItem("resetCode", oobCode);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasyon
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      // localStorage'dan kodu al veya URL'den
      const params = new URLSearchParams(location.search);
      let oobCode = params.get("oobCode") || localStorage.getItem("resetCode");
      
      if (!oobCode) {
        throw new Error("Geçersiz veya süresi dolmuş şifre sıfırlama linki");
      }

      // Şifreyi Firebase'de güncelle
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      // Başarılı
      setSuccess(true);
      
      // LocalStorage'ı temizle
      localStorage.removeItem("resetCode");
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate("/OgrenciGiris");
      }, 3000);
      
    } catch (err) {
      console.error("Şifre sıfırlama hatası:", err.code, err.message);
      
      // Hata mesajlarını Türkçeleştir
      if (err.code === "auth/expired-action-code") {
        setError("Bu linkin süresi dolmuş. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("Geçersiz şifre sıfırlama linki. Lütfen yeni bir istek gönderin.");
      } else if (err.code === "auth/user-disabled") {
        setError("Bu hesap devre dışı bırakılmış.");
      } else if (err.code === "auth/user-not-found") {
        setError("Bu email adresine kayıtlı kullanıcı bulunamadı.");
      } else if (err.code === "auth/weak-password") {
        setError("Şifre çok zayıf. Daha güçlü bir şifre seçin.");
      } else {
        setError("Şifre sıfırlanırken bir hata oluştu: " + err.message);
      }
      
      // Hata durumunda kodu temizle
      localStorage.removeItem("resetCode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="py-4 sm:py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">Ay Günlüğü</h1>
            </div>

            <Link
              to="/OgrenciGiris"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg text-sm sm:text-base"
            >
              <FaArrowLeft className="mr-2" />
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">🔐 Yeni Şifre Belirle</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {success 
                ? "Şifreniz başarıyla değiştirildi!" 
                : "Yeni şifrenizi belirleyin"}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700">
            {success ? (
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="text-5xl sm:text-6xl text-green-500 mb-4">
                  <FaCheck />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-300">
                  ✅ Şifreniz Başarıyla Değiştirildi!
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Yeni şifrenizle giriş yapabilirsiniz.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  3 saniye içinde giriş sayfasına yönlendirileceksiniz...
                </p>
                <button
                  onClick={() => navigate("/OgrenciGiris")}
                  className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 text-sm sm:text-base"
                >
                  🔐 Hemen Giriş Yap
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="p-3 sm:p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                    <p className="text-red-300 text-sm sm:text-base">{error}</p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    <FaLock className="inline mr-2" />
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="w-full p-3 sm:p-4 bg-black/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    En az 6 karakter olmalıdır
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                    <FaLock className="inline mr-2" />
                    Şifreyi Tekrar Girin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Şifreyi tekrar girin"
                      className="w-full p-3 sm:p-4 bg-black/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      İşleniyor...
                    </span>
                  ) : (
                    "📝 Şifremi Değiştir"
                  )}
                </button>

                {/* Info */}
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 sm:p-4">
                  <p className="text-blue-300 text-xs sm:text-sm">
                    <strong>ℹ️ Bilgi:</strong> Bu sayfaya sadece e-postanıza gelen şifre sıfırlama linkinden ulaşabilirsiniz.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-800 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} Ay Günlüğü - Subaşı Ortaokulu
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SifreYenile;