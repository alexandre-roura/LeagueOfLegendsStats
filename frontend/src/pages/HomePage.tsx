import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import SearchForm from "../components/SearchForm";
import Header from "../components/Header";
import ErrorFallback from "../components/ErrorFallback";
import { usePlayerSearch } from "../hooks/useQueries";

export default function HomePage() {
  const navigate = useNavigate();
  const playerSearchMutation = usePlayerSearch();

  const handleSearch = async (
    summonerName: string,
    tagLine: string,
    region: string
  ) => {
    // Utilise React Query pour pré-charger les données
    try {
      await playerSearchMutation.mutateAsync({
        name: summonerName,
        tag: tagLine,
        region,
      });
      // Navigation après succès
      navigate(`/summoners/${region}/${summonerName}-${tagLine}/overview`);
    } catch (error) {
      // Navigation même en cas d'erreur (sera gérée par SummonerPage)
      console.warn("Pre-search failed, navigating anyway:", error);
      navigate(`/summoners/${region}/${summonerName}-${tagLine}/overview`);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header spécifique à la home (logo centré) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <Header />
        </motion.div>

        {/* Search Form Central */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <SearchForm
            onSearch={handleSearch}
            loading={playerSearchMutation.isPending}
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-center py-16"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-8xl mb-6"
          >
            🎮
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-2xl font-semibold text-gray-300 mb-4"
          >
            Ready to Explore the Rift
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-gray-400 text-lg"
          >
            Enter a summoner name and region to view detailed statistics,
            rankings, and performance insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500"
          >
            {[
              { icon: "📊", text: "Detailed Stats" },
              { icon: "🏆", text: "Rank Tracking" },
              { icon: "📈", text: "Win Rate Analysis" },
              { icon: "⚡", text: "Real-time Data" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-800/30 rounded-lg p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl mb-1"
                >
                  {feature.icon}
                </motion.div>
                <div>{feature.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
}
