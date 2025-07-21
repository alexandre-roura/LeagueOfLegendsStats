import { Link } from "react-router-dom";

export default function ChampionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-8xl mb-6">⚔️</div>
        <h1 className="text-4xl font-bold text-white mb-4">Champions</h1>
        <p className="text-gray-400 text-lg mb-8">
          Detailed champion statistics and analytics coming soon!
        </p>
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-lol-gold mb-4">
            Planned Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="font-medium text-white mb-2">📊 Champion Stats</h4>
              <p className="text-gray-400 text-sm">
                Win rates, pick rates, and performance metrics
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">
                🎯 Build Analytics
              </h4>
              <p className="text-gray-400 text-sm">
                Most popular builds and item combinations
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">📈 Tier Lists</h4>
              <p className="text-gray-400 text-sm">
                Current meta rankings by role
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">⚡ Patch Impact</h4>
              <p className="text-gray-400 text-sm">
                How changes affect champion performance
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
