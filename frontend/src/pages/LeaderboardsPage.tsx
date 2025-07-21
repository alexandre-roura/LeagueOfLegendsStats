import { Link } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ErrorFallback from "../components/ErrorFallback";

export default function LeaderboardsPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error("LeaderboardsPage Error:", error)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto text-center py-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="text-8xl mb-6"
          >
            🏆
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Leaderboards
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg mb-8"
          >
            Global and regional leaderboards for all ranks coming soon!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl font-semibold text-lol-gold mb-4"
            >
              Planned Features
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, staggerChildren: 0.1 }}
              className="grid md:grid-cols-2 gap-4 text-left"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <h4 className="font-medium text-white mb-2">
                  🌍 Regional Ladders
                </h4>
                <p className="text-gray-400 text-sm">
                  Top players by region and queue type
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02, x: -5 }}
              >
                <h4 className="font-medium text-white mb-2">
                  ⭐ Challenger Tracking
                </h4>
                <p className="text-gray-400 text-sm">
                  Live Challenger and Grandmaster standings
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <h4 className="font-medium text-white mb-2">📊 Statistics</h4>
                <p className="text-gray-400 text-sm">
                  Average LP, win rates, and trends
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.02, x: -5 }}
              >
                <h4 className="font-medium text-white mb-2">
                  🔍 Player Search
                </h4>
                <p className="text-gray-400 text-sm">
                  Find specific players in the rankings
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-block mt-6 bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}
