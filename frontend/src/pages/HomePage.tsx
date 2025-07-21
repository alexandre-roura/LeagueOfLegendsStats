import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import Header from "../components/Header";

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (
    summonerName: string,
    tagLine: string,
    region: string
  ) => {
    // Naviguer vers la page du summoner
    navigate(`/summoners/${region}/${summonerName}-${tagLine}/overview`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header spécifique à la home (logo centré) */}
      <div className="text-center mb-12">
        <Header />
      </div>

      {/* Search Form Central */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchForm onSearch={handleSearch} loading={false} />
      </div>

      {/* Features Grid */}
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
    </div>
  );
}
