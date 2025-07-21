import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import PlayerInfo from "../components/PlayerInfo";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ErrorBoundary from "../components/ErrorBoundary";
import { playerService, getErrorMessage } from "../services/api";
import type { PlayerData } from "../types/Player";

export default function SummonerPage() {
  const { region, nameTag } = useParams<{ region: string; nameTag: string }>();
  const navigate = useNavigate();

  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!parsedParams) {
        setError("Invalid summoner URL format");
        setLoading(false);
        return;
      }

      const { name, tag, region } = parsedParams;

      try {
        setLoading(true);
        setError(null);

        const data = await playerService.getPlayerInfo(name, tag, region);
        setPlayerData(data);
      } catch (err) {
        console.error("Error fetching player data:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [parsedParams]);

  const handleRetry = () => {
    if (parsedParams) {
      // Reset states et relancer la requête
      setError(null);
      setLoading(true);
      setPlayerData(null);

      const { name, tag, region } = parsedParams;

      // Force re-fetch via state change
      const fetchPlayerData = async () => {
        try {
          const data = await playerService.getPlayerInfo(name, tag, region);
          setPlayerData(data);
        } catch (err) {
          console.error("Error fetching player data:", err);
          setError(getErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };

      fetchPlayerData();
    }
  };

  // Validation des paramètres d'URL
  if (!parsedParams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-900/20 rounded-lg p-8 border border-red-500/30">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-red-400 text-xl font-semibold mb-2">
              Invalid URL Format
            </h2>
            <p className="text-red-300 mb-4">
              The summoner URL should be in format:
              /summoners/REGION/Name-Tag/overview
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-lol-gold hover:bg-lol-gold/80 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { name, tag, region: upperRegion } = parsedParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text={`Loading ${name}#${tag}...`} />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {/* Player Data */}
      {playerData && !loading && !error && (
        <div className="max-w-6xl mx-auto">
          <ErrorBoundary>
            <PlayerInfo playerData={playerData} region={upperRegion} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
