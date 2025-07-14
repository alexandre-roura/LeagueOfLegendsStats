import { useState } from "react";

interface SearchFormProps {
  onSearch: (summonerName: string, tagLine: string, region: string) => void;
  loading: boolean;
}

const REGIONS = [
  { code: "EUW", label: "Europe West", endpoint: "euw1" },
  { code: "NA", label: "North America", endpoint: "na1" },
  { code: "KR", label: "Korea", endpoint: "kr" },
  { code: "EUNE", label: "Europe Nordic & East", endpoint: "eun1" },
  { code: "BR", label: "Brazil", endpoint: "br1" },
  { code: "JP", label: "Japan", endpoint: "jp1" },
  { code: "LAN", label: "Latin America North", endpoint: "la1" },
  { code: "LAS", label: "Latin America South", endpoint: "la2" },
  { code: "OCE", label: "Oceania", endpoint: "oc1" },
  { code: "RU", label: "Russia", endpoint: "ru" },
  { code: "TR", label: "Turkey", endpoint: "tr1" },
];

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("EUW");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (riotId.trim()) {
      // Parse the Riot ID (format: "Name#Tag")
      const parts = riotId.trim().split("#");
      if (parts.length === 2) {
        const [summonerName, tagLine] = parts;
        if (summonerName && tagLine) {
          onSearch(summonerName, tagLine, region);
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-lol-gold/10 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-lol-gold mb-2">
            Search Summoner
          </h3>
          <p className="text-gray-400 text-sm">
            Enter your Summoner Name (Name#Tag) and select your region
          </p>
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
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="e.g., Faker#KR1"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all duration-300 hover:border-gray-500"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-1 h-6 bg-lol-gold/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Region Selector */}
          <div className="space-y-2">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-300"
            >
              Region
            </label>
            <div className="relative">
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all duration-300 hover:border-gray-500 appearance-none cursor-pointer"
                disabled={loading}
              >
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code} className="bg-gray-900">
                    {r.code} - {r.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !riotId.trim() || !riotId.includes("#")}
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

        {/* Format hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Format: YourName#YourTag (e.g., Faker#KR1, Player#EUW)
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {REGIONS.slice(0, 6).map((r) => (
              <button
                key={r.code}
                type="button"
                onClick={() => setRegion(r.code)}
                className={`px-2 py-1 text-xs rounded-md transition-colors duration-200 ${
                  region === r.code
                    ? "bg-lol-gold/30 text-lol-gold border border-lol-gold/50"
                    : "bg-gray-700/50 hover:bg-lol-gold/20 text-gray-400 hover:text-lol-gold"
                }`}
                disabled={loading}
              >
                {r.code}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
