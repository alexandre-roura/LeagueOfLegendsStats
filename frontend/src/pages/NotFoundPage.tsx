import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-8xl mb-6">😵</div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-2">
          The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Path:{" "}
          <code className="bg-gray-800 px-2 py-1 rounded">
            {location.pathname}
          </code>
        </p>

        <div className="space-y-4">
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-lol-gold mb-4">
              What can you do?
            </h3>
            <div className="space-y-2 text-left">
              <p className="text-gray-300">
                • Check if the summoner name and tag are correct
              </p>
              <p className="text-gray-300">
                • Verify the region is valid (EUW, NA, KR, etc.)
              </p>
              <p className="text-gray-300">
                • Use the search form to find a summoner
              </p>
              <p className="text-gray-300">• Go back to the home page</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              🏠 Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
