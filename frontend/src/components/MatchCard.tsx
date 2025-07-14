import { useState } from "react";
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

  // Use custom hooks for data fetching and image handling
  const { matchData, loading, error, showContent } = useMatchData({
    matchId,
    region,
  });

  // Get game version from match data using utility function
  const gameVersion = getFormattedGameVersion(matchData?.info.gameVersion);

  const { getChampionImageUrl } = useChampionImageUrl(gameVersion);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !matchData) {
    return (
      <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
        <p className="text-red-400 text-sm">Failed to load match data</p>
      </div>
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
    <div
      className={`
        bg-gradient-to-r rounded-lg border cursor-pointer min-h-[140px]
        transition-all duration-300 ease-in-out
        ${
          isWin
            ? "from-green-900/30 to-green-800/20 border-green-500/30 hover:border-green-400/50"
            : "from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-400/50"
        }
        hover:shadow-xl hover:brightness-110
        ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${expanded ? "" : ""}
      `}
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
          <ItemsDisplay participant={currentPlayer} gameVersion={gameVersion} />

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
          />
        </div>

        {/* Expand Arrow */}
        <div
          className={`
            transform transition-transform duration-200 ml-4
            ${expanded ? "rotate-180" : "rotate-0"}
          `}
        >
          <span className="text-gray-400 text-lg">▼</span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="bg-gray-900 rounded-b-lg">
          <ExpandedMatchDetails
            matchData={matchData}
            currentPlayerPuuid={currentPlayerPuuid}
          />
        </div>
      )}
    </div>
  );
}
