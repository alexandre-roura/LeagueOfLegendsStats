import { useState, useEffect } from "react";
import type { MatchDto } from "../types/Match";
import { getApiUrl, API_CONFIG } from "../config/api";
import { getMatchTypeInfo, getQueueIcon } from "../utils/gameConstants";
import {
  formatGameDuration,
  formatTimeAgo,
  formatNumber,
} from "../utils/timeUtils";

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
  const [matchData, setMatchData] = useState<MatchDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const endpoint = API_CONFIG.ENDPOINTS.MATCH_DETAILS(matchId);
        const url = getApiUrl(endpoint) + `?region=${region}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch match details: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setMatchData(data.data);
        } else {
          throw new Error("Failed to fetch match details from server");
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        // Add a minimum loading time for better UX
        setTimeout(() => {
          setLoading(false);
          setShowContent(true);
        }, 300);
      }
    };

    fetchMatchDetails();
  }, [matchId, region]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
        {/* Skeleton Header */}
        <div className="bg-gray-800/40 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="w-24 h-3 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-6 bg-gray-600 rounded animate-pulse"></div>
        </div>
        
        {/* Skeleton Content */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Champion Avatar Skeleton */}
            <div className="w-16 h-16 bg-gray-600 rounded-lg animate-pulse relative">
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* KDA Skeleton */}
            <div className="text-center min-w-[80px] space-y-2">
              <div className="w-20 h-5 bg-gray-600 rounded animate-pulse mx-auto"></div>
              <div className="w-16 h-4 bg-gray-600 rounded animate-pulse mx-auto"></div>
            </div>
            
            {/* Stats Skeleton */}
            <div className="text-center min-w-[80px] space-y-2">
              <div className="w-24 h-4 bg-gray-600 rounded animate-pulse mx-auto"></div>
              <div className="w-16 h-3 bg-gray-600 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
          
          {/* Arrow Skeleton */}
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    );
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

  const isWin = currentPlayer.win;
  const kdaRatio =
    currentPlayer.deaths === 0
      ? currentPlayer.kills + currentPlayer.assists
      : (currentPlayer.kills + currentPlayer.assists) / currentPlayer.deaths;

  const totalCS =
    currentPlayer.totalMinionsKilled + currentPlayer.neutralMinionsKilled;
  const csPerMinute = totalCS / (matchData.info.gameDuration / 60);

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

  // Use the new utility functions for better accuracy
  const matchTypeInfo = getMatchTypeInfo(matchData.info.queueId);
  const queueIcon = getQueueIcon(matchData.info.queueId);
  const gameDuration = formatGameDuration(matchData.info.gameDuration);
  const timeAgo = formatTimeAgo(matchData.info.gameEndTimestamp);

  // Format champion name and get Data Dragon image URL
  const formatChampionName = (name: string) => {
    // Handle special cases for champion names that differ in Data Dragon filenames
    const specialCases: { [key: string]: string } = {
      "Nunu & Willump": "Nunu",
      Wukong: "MonkeyKing",
      LeBlanc: "Leblanc",
      "Vel'Koz": "Velkoz",
      "Cho'Gath": "Chogath",
      "Kai'Sa": "Kaisa",
      "Kha'Zix": "Khazix",
      "Kog'Maw": "KogMaw",
      "Rek'Sai": "RekSai",
    };

    return specialCases[name] || name.replace(/[^a-zA-Z0-9]/g, "");
  };

  const gameVersion = matchData.info.gameVersion.split(".").slice(0, 2).join(".") + ".1";
  const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formatChampionName(
    currentPlayer.championName
  )}.png`;
  const getItemImageUrl = (itemId: number) =>
    itemId === 0 ? null : `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${itemId}.png`;

  return (
    <div
      className={`
        bg-gradient-to-r rounded-lg border transition-all duration-500 cursor-pointer
        ${
          isWin
            ? "from-green-900/30 to-green-800/20 border-green-500/30 hover:border-green-400/50"
            : "from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-400/50"
        }
        hover:scale-[1.02] hover:shadow-lg
        ${showContent ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Game Info Header */}
      <div className="bg-gray-800/40 px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{queueIcon}</span>
            <span
              className={`
                text-xs font-semibold
                ${
                  matchTypeInfo.isRanked
                    ? "text-yellow-400"
                    : matchTypeInfo.isSpecialMode
                    ? "text-purple-400"
                    : "text-gray-300"
                }
              `}
            >
              {matchTypeInfo.displayName.toUpperCase()}
            </span>
          </div>
          <div className="text-gray-400 text-xs">
            {timeAgo} • {gameDuration}
          </div>
        </div>
        <button className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded text-xs font-medium transition-colors">
          Match Details
        </button>
      </div>

      {/* Match Content */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Champion with Image */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-16 h-16 rounded-lg relative overflow-hidden border-2
                ${isWin ? "border-green-500/50" : "border-red-500/50"}
              `}
            >
              <img
                src={championImageUrl}
                alt={currentPlayer.championName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Show initials fallback if Data Dragon fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove("hidden");
                    fallback.classList.add("flex");
                  }
                }}
              />
              <div
                className={`
                  absolute inset-0 hidden items-center justify-center text-xl font-bold
                  ${
                    isWin
                      ? "bg-green-600/30 text-green-200"
                      : "bg-red-600/30 text-red-200"
                  }
                `}
              >
                {currentPlayer.championName.slice(0, 2).toUpperCase()}
              </div>

              {/* Champion Level Badge */}
              <div className="absolute -bottom-1 -right-1 bg-gray-800 text-yellow-400 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-gray-600">
                {currentPlayer.champLevel}
              </div>
            </div>
          </div>

          {/* KDA */}
          <div className="text-center min-w-[80px]">
            <div className="text-white font-bold text-lg">
              <span className="text-green-400">{currentPlayer.kills}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-red-400">{currentPlayer.deaths}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-blue-400">{currentPlayer.assists}</span>
            </div>
            <div
              className={`
                text-sm font-semibold
                ${
                  kdaRatio >= 3
                    ? "text-green-400"
                    : kdaRatio >= 2
                    ? "text-yellow-400"
                    : kdaRatio >= 1
                    ? "text-orange-400"
                    : "text-red-400"
                }
              `}
            >
              {kdaRatio.toFixed(2)} KDA
            </div>
          </div>

          {/* CS and Kill Participation - Hidden for Arena */}
          {!isArenaMode && (
            <div className="text-center min-w-[80px]">
              <div className="text-white font-bold text-sm">
                CS {formatNumber(totalCS)} ({csPerMinute.toFixed(1)})
              </div>
              <div className="text-gray-400 text-sm">
                {killParticipation.toFixed(0)}% KP
              </div>
            </div>
          )}

          {/* Arena Placement */}
          {isArenaMode && currentPlayer.placement && (
            <div className="text-center min-w-[80px]">
              <div
                className={`
                text-sm font-semibold
                ${
                  currentPlayer.placement === 1
                    ? "text-yellow-400"
                    : currentPlayer.placement <= 3
                    ? "text-orange-400"
                    : currentPlayer.placement <= 6
                    ? "text-blue-400"
                    : "text-gray-400"
                }
              `}
              >
                {currentPlayer.placement === 1
                  ? "WINNER"
                  : `TOP ${currentPlayer.placement}`}
              </div>
            </div>
          )}
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
        <div className="mt-4 pt-4 border-t border-gray-600/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Damage Stats */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Damage</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">To Champions:</span>
                  <span className="text-white">
                    {formatNumber(currentPlayer.totalDamageDealtToChampions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white">
                    {formatNumber(currentPlayer.totalDamageDealt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taken:</span>
                  <span className="text-white">
                    {formatNumber(currentPlayer.totalDamageTaken)}
                  </span>
                </div>
              </div>
            </div>

            {/* Gold & Items */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Economy</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gold Earned:</span>
                  <span className="text-yellow-400">
                    {formatNumber(currentPlayer.goldEarned)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gold Spent:</span>
                  <span className="text-yellow-400">
                    {formatNumber(currentPlayer.goldSpent)}
                  </span>
                </div>
              </div>
            </div>

            {/* Vision & Objectives */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Vision</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vision Score:</span>
                  <span className="text-purple-400">
                    {currentPlayer.visionScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wards Placed:</span>
                  <span className="text-purple-400">
                    {currentPlayer.wardsPlaced}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wards Killed:</span>
                  <span className="text-purple-400">
                    {currentPlayer.wardsKilled}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Items</h4>
            <div className="flex space-x-2">
              {[
                currentPlayer.item0,
                currentPlayer.item1,
                currentPlayer.item2,
                currentPlayer.item3,
                currentPlayer.item4,
                currentPlayer.item5,
                currentPlayer.item6,
              ].map((itemId, index) => (
                <div
                  key={index}
                  className={`
                    w-12 h-12 rounded border-2 relative overflow-hidden transition-transform hover:scale-105
                    ${
                      itemId === 0
                        ? "border-gray-600 bg-gray-800/50"
                        : "border-lol-gold/30 bg-gray-900 hover:border-lol-gold/50"
                    }
                  `}
                >
                  {itemId === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      —
                    </div>
                  ) : (
                    <>
                      <img
                        src={getItemImageUrl(itemId) || ""}
                        alt={`Item ${itemId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Show item ID fallback if Data Dragon fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-lol-gold text-xs font-semibold bg-gray-800/80">
                        {itemId.toString().slice(-2)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
