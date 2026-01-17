import React, { useMemo, useEffect } from "react";
import { FaMoon, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SifreYenile() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const done = searchParams.get("done"); // ✅ biz bunu ekledik

  const pendingEmail = useMemo(() => {
    try {
      return (localStorage.getItem("pendingResetEmail") || "").trim().toLowerCase();
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    // done=1 gelince küçük bir süre sonra girişe gönderelim (isteğe bağlı)
    if (done === "1") {
      const t = setTimeout(() => {
        navigate("/OgrenciGiris");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <FaMoon className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">Ay Günlüğü</h1>
            </div>

            <Link
              to="/OgrenciGiris"
              className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">🔐 Şifre Yenile</h1>
            <p className="text-gray-300">
              {done === "1"
                ? "Şifren yenilendi. Şimdi yeni şifrenle giriş yapabilirsin."
                : "Bu sayfa şifre yenileme yönlendirmesi için kullanılır."}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {done === "1" ? (
              <div className="text-center space-y-4">
                <p className="text-green-300 font-semibold text-lg">✅ Şifre yenileme tamamlandı!</p>
                {pendingEmail ? (
                  <p className="text-gray-300 text-sm">
                    Hesap: <span className="text-yellow-300 font-semibold">{pendingEmail}</span>
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    (Hesap bilgisi bulunamadı. Giriş sayfasında e-postanı yazabilirsin.)
                  </p>
                )}

                <a
                  href="/OgrenciGiris"
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold"
                >
                  🔐 Giriş Sayfasına Git
                </a>

                <p className="text-gray-500 text-xs">
                  Otomatik yönlendirme birkaç saniye içinde yapılacak.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Bu sayfa doğrudan şifre belirleme ekranı değildir.
                </p>
                <p className="text-gray-400 text-sm">
                  Şifre yenileme linkine e-postandan tıklayıp işlemi tamamladıktan sonra buraya yönlendirilirsin.
                </p>
                <a
                  href="/OgrenciGiris"
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold"
                >
                  👤 Öğrenci Girişe Dön
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Ay Günlüğü</p>
        </div>
      </footer>
    </div>
  );
}

export default SifreYenile;
