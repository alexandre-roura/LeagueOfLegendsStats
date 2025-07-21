import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import PlayerInfo from "../components/PlayerInfo";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ErrorFallback from "../components/ErrorFallback";
import { usePlayerQuery } from "../hooks/useQueries";

export default function SummonerPage() {
  const { region, nameTag } = useParams<{ region: string; nameTag: string }>();
  const navigate = useNavigate();

  // Parse name-tag format with useMemo to prevent infinite re-renders
  const parsedParams = useMemo(() => {
    if (!nameTag || !region) {
      return null;
    }

    // Split par le dernier tiret pour gérer les noms avec des tirets
    const lastDashIndex = nameTag.lastIndexOf("-");
    if (lastDashIndex === -1) {
      return null;
    }

    const name = nameTag.substring(0, lastDashIndex);
    const tag = nameTag.substring(lastDashIndex + 1);

    return { name, tag, region: region.toUpperCase() };
  }, [nameTag, region]);

  // React Query pour charger les données du joueur
  const {
    data: playerData,
    isLoading: loading,
    error,
    refetch,
  } = usePlayerQuery({
    name: parsedParams?.name || "",
    tag: parsedParams?.tag || "",
    region: parsedParams?.region || "",
    enabled: !!parsedParams, // Active la query seulement si les params sont valides
  });

  const handleRetry = () => {
    // React Query refetch - beaucoup plus simple !
    refetch();
  };

  // Validation des paramètres d'URL
  if (!parsedParams) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-900/20 rounded-lg p-8 border border-red-500/30"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl mb-4"
            >
              ❌
            </motion.div>
            <h2 className="text-red-400 text-xl font-semibold mb-2">
              Invalid URL Format
            </h2>
            <p className="text-red-300 mb-4">
              The summoner URL should be in format:
              /summoners/REGION/Name-Tag/overview
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go Home
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const { name, tag, region: upperRegion } = parsedParams;

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
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <LoadingSpinner size="lg" text={`Loading ${name}#${tag}...`} />
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ErrorMessage
              message={
                error instanceof Error ? error.message : "An error occurred"
              }
              onRetry={handleRetry}
            />
          </motion.div>
        )}

        {/* Player Data */}
        {playerData && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <PlayerInfo playerData={playerData} region={upperRegion} />
          </motion.div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
}
