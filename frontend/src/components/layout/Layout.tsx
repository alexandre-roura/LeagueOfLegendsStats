import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("EUW");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Parse format "name#tag"
    const parts = searchQuery.trim().split(/[#]/);
    const name = parts[0];
    const tag = parts[1] || "EUW"; // Tag par défaut si non spécifié

    navigate(`/summoners/${selectedRegion}/${name}-${tag}/overview`);
  };

  return (
    <div className="min-h-screen bg-lol-gradient">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lol-gold/3 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-lol-blue/2 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lol-gold/2 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-lol-gold to-yellow-400 bg-clip-text text-transparent"
              >
                LoL Stats
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-lol-gold transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/champions"
                  className="text-gray-300 hover:text-lol-gold transition-colors"
                >
                  Champions
                </Link>
                <Link
                  to="/leaderboards"
                  className="text-gray-300 hover:text-lol-gold transition-colors"
                >
                  Leaderboards
                </Link>
              </nav>
            </div>

            {/* Quick Search */}
            <form
              onSubmit={handleQuickSearch}
              className="flex items-center space-x-2"
            >
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-lol-gold focus:border-transparent"
              >
                <option value="EUW">EUW</option>
                <option value="NA">NA</option>
                <option value="KR">KR</option>
                <option value="EUNE">EUNE</option>
                <option value="BR">BR</option>
                <option value="JP">JP</option>
                <option value="LAN">LAN</option>
                <option value="LAS">LAS</option>
                <option value="OCE">OCE</option>
                <option value="RU">RU</option>
                <option value="TR">TR</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Summoner#Tag"
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-lol-gold focus:border-transparent w-48"
              />

              <button
                type="submit"
                className="bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 text-center pb-8">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-gray-800/30 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm">
              League of Legends Stats Tracker • Built with ❤️ using React &
              FastAPI
            </p>
            <p className="text-gray-500 text-xs mt-1">
              League of Legends is a trademark of Riot Games, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
