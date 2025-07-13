import { useState } from "react";

interface SearchFormProps {
  onSearch: (summonerName: string, tagLine: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim() && tagLine.trim()) {
      onSearch(summonerName.trim(), tagLine.trim());
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-lol-gold/10 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-lol-gold mb-2">Search Summoner</h3>
          <p className="text-gray-400 text-sm">Enter summoner name and region tag</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summoner Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="summonerName"
              className="block text-sm font-medium text-gray-300"
            >
              Summoner Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="summonerName"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                placeholder="e.g., Faker"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all duration-300 hover:border-gray-500"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-1 h-6 bg-lol-gold/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Tag Line Input */}
          <div className="space-y-2">
            <label
              htmlFor="tagLine"
              className="block text-sm font-medium text-gray-300"
            >
              Tag Line
            </label>
            <div className="relative">
              <input
                type="text"
                id="tagLine"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                placeholder="e.g., KR1"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all duration-300 hover:border-gray-500"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-1 h-6 bg-lol-gold/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !summonerName.trim() || !tagLine.trim()}
          className="w-full relative px-6 py-4 bg-gradient-to-r from-lol-gold to-yellow-500 hover:from-yellow-500 hover:to-lol-gold disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-lol-dark font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-lol-gold/30 disabled:transform-none disabled:shadow-none group"
        >
          <div className="flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-lol-dark/30 border-t-lol-dark rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Search Player</span>
              </>
            )}
          </div>
          
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-lol-gold/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
        </button>

        {/* Popular regions hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Popular regions:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['EUW', 'NA1', 'KR', 'EUN1', 'BR1', 'JP1', 'LAN', 'LAS', 'OCE', 'RU', 'TR1'].map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setTagLine(region)}
                className="px-2 py-1 text-xs bg-gray-700/50 hover:bg-lol-gold/20 text-gray-400 hover:text-lol-gold rounded-md transition-colors duration-200"
                disabled={loading}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
