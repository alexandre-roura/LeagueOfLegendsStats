import { useState } from "react";
import SearchForm from "./components/SearchForm";
import PlayerInfo from "./components/PlayerInfo";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import type { PlayerData } from "./types/Player";
import { getApiUrl, API_CONFIG } from "./config/api";

function App() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<{
    summonerName: string;
    tagLine: string;
    region: string;
  } | null>(null);

  const handleSearch = async (
    summonerName: string,
    tagLine: string,
    region: string
  ) => {
    setLoading(true);
    setError(null);
    setPlayerData(null);
    setLastSearch({ summonerName, tagLine, region });

    try {
      const endpoint = API_CONFIG.ENDPOINTS.PLAYER(summonerName, tagLine);
      const url = getApiUrl(endpoint) + `?region=${region}`;
      console.log(`Fetching player data from: ${url}`);
      const response = await fetch(url);
      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(
          `Player "${summonerName}#${tagLine}" not found in ${region}. Please check the summoner name, tag line, and region.`
        );
      }

      const data = await response.json();
      if (data.success) {
        setPlayerData(data.data);
      } else {
        throw new Error("Failed to fetch player data from the server.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching player data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSearch) {
      handleSearch(
        lastSearch.summonerName,
        lastSearch.tagLine,
        lastSearch.region
      );
    }
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {/* Loading State */}
        {loading && (
          <LoadingSpinner size="lg" text="Searching for summoner..." />
        )}

        {/* Player Information */}
        {playerData && !loading && (
          <div className="max-w-6xl mx-auto">
            <PlayerInfo
              playerData={playerData}
              region={lastSearch?.region || "EUW"}
            />
          </div>
        )}

        {/* Empty State */}
        {!playerData && !loading && !error && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-8xl mb-6 animate-float">🎮</div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              Ready to Explore the Rift
            </h3>
            <p className="text-gray-400 text-lg">
              Enter a summoner name and region to view detailed statistics,
              rankings, and performance insights.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-xl mb-1">📊</div>
                <div>Detailed Stats</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-xl mb-1">🏆</div>
                <div>Rank Tracking</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-xl mb-1">📈</div>
                <div>Win Rate Analysis</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-xl mb-1">⚡</div>
                <div>Real-time Data</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="inline-block bg-gray-800/30 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm">
              League of Legends Stats Tracker • Built with ❤️ using React &
              FastAPI
            </p>
            <p className="text-gray-500 text-xs mt-1">
              League of Legends is a trademark of Riot Games, Inc.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
