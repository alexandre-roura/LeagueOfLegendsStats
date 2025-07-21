import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useMatchData } from "../hooks/useMatchData";
import { useChampionImageUrl } from "../hooks/useChampionImageUrl";
import { getFormattedGameVersion } from "../utils";

// Match components
import SkeletonLoader from "./match/SkeletonLoader";
import MatchSummary from "./match/MatchSummary";
import ChampionDisplay from "./match/ChampionDisplay";
import KDAStats from "./match/KDAStats";
import ItemsDisplay from "./match/ItemsDisplay";
import PlayersList from "./match/PlayersList";
import ExpandedMatchDetails from "./match/ExpandedMatchDetails";
import GameModeStats from "./match/GameModeStats";
import ErrorFallback from "./ErrorFallback";

interface MatchCardProps {
  matchId: string;
  currentPlayerPuuid: string;
  region: string;
}

export default function MatchCard({
  matchId,
  currentPlayerPuuid,
  region,
}: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Use React Query for data fetching with enhanced error handling
  const { matchData, loading, error, showContent } = useMatchData({
    matchId,
    region,
  });
  console.log("Region in MatchCard:", region);
  console.log("Platform ID in MatchCard:", matchData?.info.platformId);

  // Get game version from match data using utility function
  const gameVersion = getFormattedGameVersion(matchData?.info.gameVersion);
  const { getChampionImageUrl } = useChampionImageUrl(gameVersion);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <SkeletonLoader />
      </motion.div>
    );
  }

  if (error || !matchData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900/20 rounded-lg p-4 border border-red-500/30"
      >
        <ErrorFallback
          error={error || new Error("Match data not found")}
          resetErrorBoundary={() => window.location.reload()}
        />
      </motion.div>
    );
  }

  const currentPlayer = matchData.info.participants.find(
    (p) => p.puuid === currentPlayerPuuid
  );

  if (!currentPlayer) {
    return (
      <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
        <p className="text-yellow-400 text-sm">Player not found in match</p>
      </div>
    );
  }

  // Calculate derived values
  const isWin = currentPlayer.win;

  // Calculate kill participation
  const playerTeam = matchData.info.teams.find(
    (team) => team.teamId === currentPlayer.teamId
  );
  const teamKills = playerTeam?.objectives.champion.kills || 0;
  const killParticipation =
    teamKills > 0
      ? ((currentPlayer.kills + currentPlayer.assists) / teamKills) * 100
      : 0;

  // Check if this is an Arena game mode
  const isArenaMode =
    matchData.info.queueId === 1700 || matchData.info.queueId === 1710;

  // Get champion image URL using hook
  const championImageUrl = getChampionImageUrl(currentPlayer.championName);

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900/20 rounded-lg p-4 border border-red-500/30"
        >
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        </motion.div>
      )}
    >
      <motion.div
        animate={{
          opacity: showContent ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          delay: 0.1,
        }}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
        className={clsx(
          "bg-gradient-to-r rounded-lg border cursor-pointer min-h-[140px]",
          "transition-all duration-300 ease-in-out",
          isWin
            ? "from-green-900/30 to-green-800/20 border-green-500/30 hover:border-green-400/50"
            : "from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-400/50",
          "hover:brightness-110"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Game Info Header */}
        <MatchSummary matchData={matchData} />

        {/* Match Content */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Champion Avatar */}
            <ChampionDisplay
              participant={currentPlayer}
              championImageUrl={championImageUrl}
              isWin={isWin}
            />

            {/* KDA Stats */}
            <KDAStats participant={currentPlayer} />

            {/* Items Display */}
            <ItemsDisplay
              participant={currentPlayer}
              gameVersion={gameVersion}
            />

            {/* Game Mode Specific Stats */}
            <GameModeStats
              participant={currentPlayer}
              isArenaMode={isArenaMode}
              gameDurationInSeconds={matchData.info.gameDuration}
              killParticipation={killParticipation}
            />
          </div>

          {/* Players List */}
          <div className="flex items-center space-x-2 mx-4">
            <PlayersList
              participants={matchData.info.participants}
              currentPlayerPuuid={currentPlayerPuuid}
              queueId={matchData.info.queueId}
              gameVersion={gameVersion}
              region={matchData.info.platformId}
            />
          </div>

          {/* Expand Arrow */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4"
          >
            <span className="text-gray-400 text-lg">▼</span>
          </motion.div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gray-900 rounded-b-lg overflow-hidden"
            >
              <ExpandedMatchDetails
                matchData={matchData}
                currentPlayerPuuid={currentPlayerPuuid}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
}
