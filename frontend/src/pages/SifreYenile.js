
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { confirmPasswordReset, auth } from "../lib/firebase";
import { FaMoon, FaArrowLeft, FaLock, FaCheck } from "react-icons/fa";

function SifreYenile() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [oobCode, setOobCode] = useState(null);

  // URL'den oobCode ve mode parametrelerini al
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const code = params.get("oobCode");

    if (mode === "resetPassword" && code) {
      setOobCode(code);
    } else {
      setError("Geçersiz veya hatalı link. Lütfen yeniden şifre sıfırlama isteği gönderin.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!oobCode) {
      setError("Şifre sıfırlama linki geçersiz veya süresi dolmuş.");
      return;
    }

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
      // Firebase ile şifreyi güncelle
      await confirmPasswordReset(auth, oobCode, newPassword);

      setSuccess(true);
      setOobCode(null); // Kodu temizle

      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate("/OgrenciGiris");
      }, 3000);
    } catch (err) {
      console.error("Şifre sıfırlama hatası:", err);
      if (err.code === "auth/expired-action-code") {
        setError("Bu linkin süresi dolmuş. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("Geçersiz şifre sıfırlama linki. Lütfen yeniden deneyin.");
      } else {
        setError("Şifre sıfırlanırken bir hata oluştu: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="py-4 sm:py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <FaMoon className="text-white text-xl" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Ay Günlüğü</h1>
          </div>
          <Link
            to="/OgrenciGiris"
            className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors hover:bg-gray-800 text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2" />
            Giriş Sayfasına Dön
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">🔐 Yeni Şifre Belirle</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {success ? "Şifreniz başarıyla değiştirildi!" : "Yeni şifrenizi belirleyin"}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            {success ? (
              <div className="text-center space-y-4">
                <div className="text-5xl text-green-500">
                  <FaCheck />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-300">✅ Şifreniz Değiştirildi!</h2>
                <p className="text-gray-300 text-sm">Yeni şifrenizle giriş yapabilirsiniz.</p>
                <p className="text-gray-400 text-xs sm:text-sm">3 saniye içinde giriş sayfasına yönlendirileceksiniz...</p>
                <button
                  onClick={() => navigate("/OgrenciGiris")}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
                >
                  🔐 Hemen Giriş Yap
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                    <p className="text-red-300 text-sm sm:text-base">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 mb-2">
                    <FaLock className="inline mr-2" />
                    Yeni Şifre
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    <FaLock className="inline mr-2" />
                    Şifreyi Tekrar Girin
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Şifreyi tekrar girin"
                    className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "İşleniyor..." : "📝 Şifremi Değiştir"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Ay Günlüğü - Subaşı Ortaokulu
        </div>
<p className="text-gray-400 text-sm mt-2 font-medium">Created by Candemir Yurdagül</p>
      </footer>
    </div>
  );
}

export default SifreYenile;
