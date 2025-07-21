import { Link } from "react-router-dom";

export default function LeaderboardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-8xl mb-6">🏆</div>
        <h1 className="text-4xl font-bold text-white mb-4">Leaderboards</h1>
        <p className="text-gray-400 text-lg mb-8">
          Global and regional leaderboards for all ranks coming soon!
        </p>
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-lol-gold mb-4">
            Planned Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="font-medium text-white mb-2">
                🌍 Regional Ladders
              </h4>
              <p className="text-gray-400 text-sm">
                Top players by region and queue type
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">
                ⭐ Challenger Tracking
              </h4>
              <p className="text-gray-400 text-sm">
                Live Challenger and Grandmaster standings
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">📊 Statistics</h4>
              <p className="text-gray-400 text-sm">
                Average LP, win rates, and trends
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">🔍 Player Search</h4>
              <p className="text-gray-400 text-sm">
                Find specific players in the rankings
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="inline-block mt-6 bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
