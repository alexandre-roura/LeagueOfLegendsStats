import { Link } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ErrorFallback from "../components/ErrorFallback";

export default function ChampionsPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error("ChampionsPage Error:", error)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto text-center py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >
            ⚔️
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Champions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg mb-8"
          >
            Detailed champion statistics and analytics coming soon!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-lol-gold mb-4">
              Planned Features
            </h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, staggerChildren: 0.1 }}
              className="grid md:grid-cols-2 gap-4 text-left"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="font-medium text-white mb-2">
                  📊 Champion Stats
                </h4>
                <p className="text-gray-400 text-sm">
                  Win rates, pick rates, and performance metrics
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h4 className="font-medium text-white mb-2">
                  🎯 Build Analytics
                </h4>
                <p className="text-gray-400 text-sm">
                  Most popular builds and item combinations
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <h4 className="font-medium text-white mb-2">📈 Tier Lists</h4>
                <p className="text-gray-400 text-sm">
                  Current meta rankings by role
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <h4 className="font-medium text-white mb-2">⚡ Patch Impact</h4>
                <p className="text-gray-400 text-sm">
                  How changes affect champion performance
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
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
