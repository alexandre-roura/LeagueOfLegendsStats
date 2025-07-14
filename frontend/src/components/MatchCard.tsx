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
          
          {/* Players List Skeleton - Arena mode with placements */}
          <div className="flex items-center space-x-2 mx-4">
            <div className="flex flex-col space-y-1">
              {Array.from({ length: 4 }).map((_, teamIndex) => (
                <div key={teamIndex} className="flex items-center space-x-2">
                  {/* Placement skeleton */}
                  <div className="w-6 h-4 bg-gray-600 rounded animate-pulse"></div>
                  
                  {/* Two players skeleton */}
                  <div className="flex space-x-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                      <div className="w-5 h-2 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                      <div className="w-5 h-2 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
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
      "FiddleSticks": "Fiddlesticks",
    };

    
    const test = specialCases[name] || name.replace(/[^a-zA-Z0-9]/g, "");
    console.log("Formatted champion name:", test);  

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
            </div>        </div>

        {/* Items Display */}
        <div className="flex items-center space-x-1 mx-4">
          {/* Left side - 6 items in 2 rows of 3 */}
          <div className="flex flex-col space-y-1">
            {/* First row - 3 items */}
            <div className="flex space-x-1">
              {[currentPlayer.item0, currentPlayer.item1, currentPlayer.item2].map((itemId, index) => (
                <div
                  key={index}
                  className={`
                    w-6 h-6 rounded border relative overflow-hidden
                    ${
                      itemId === 0
                        ? "border-gray-600/50 bg-gray-800/30"
                        : "border-lol-gold/30 bg-gray-900/50"
                    }
                  `}
                >
                  {itemId === 0 ? (
                    <div className="w-full h-full bg-gray-700/20"></div>
                  ) : (
                    <>
                      <img
                        src={getItemImageUrl(itemId) || ""}
                        alt={`Item ${itemId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-lol-gold text-[8px] font-semibold bg-gray-800/80">
                        {itemId.toString().slice(-2)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {/* Second row - 3 items */}
            <div className="flex space-x-1">
              {[currentPlayer.item3, currentPlayer.item4, currentPlayer.item5].map((itemId, index) => (
                <div
                  key={index + 3}
                  className={`
                    w-6 h-6 rounded border relative overflow-hidden
                    ${
                      itemId === 0
                        ? "border-gray-600/50 bg-gray-800/30"
                        : "border-lol-gold/30 bg-gray-900/50"
                    }
                  `}
                >
                  {itemId === 0 ? (
                    <div className="w-full h-full bg-gray-700/20"></div>
                  ) : (
                    <>
                      <img
                        src={getItemImageUrl(itemId) || ""}
                        alt={`Item ${itemId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-lol-gold text-[8px] font-semibold bg-gray-800/80">
                        {itemId.toString().slice(-2)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - 1 trinket item */}
          <div className="flex items-center">
            <div
              className={`
                w-6 h-6 rounded border relative overflow-hidden
                ${
                  currentPlayer.item6 === 0
                    ? "border-gray-600/50 bg-gray-800/30"
                    : "border-lol-gold/30 bg-gray-900/50"
                }
              `}
            >
              {currentPlayer.item6 === 0 ? (
                <div className="w-full h-full bg-gray-700/20"></div>
              ) : (
                <>
                  <img
                    src={getItemImageUrl(currentPlayer.item6) || ""}
                    alt={`Item ${currentPlayer.item6}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.classList.remove("hidden");
                        fallback.classList.add("flex");
                      }
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center text-lol-gold text-[8px] font-semibold bg-gray-800/80">
                    {currentPlayer.item6.toString().slice(-2)}
                  </div>
                </>
              )}
            </div>
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

        {/* Players List - Teams face to face */}
        <div className="flex items-center space-x-2 mx-4">
          {isArenaMode ? (
            /* Arena Mode - 4 teams with placement + 2 players each */
            <div className="flex flex-col space-y-1">
              {Array.from({ length: 4 }).map((_, rankIndex) => {
                const placement = rankIndex + 1;
                
                // Get players with this placement (should be 2 teammates)
                const teamPlayers = matchData.info.participants
                  .filter(p => p.placement === placement)
                  .slice(0, 2);
                
                // If no players found for this placement, skip
                if (teamPlayers.length === 0) return null;
                
                return (
                  <div key={placement} className="flex items-center space-x-2">
                    {/* Team Placement */}
                    <div 
                      className={`
                        text-xs font-bold px-1 py-0.5 rounded min-w-[32px] text-center
                        ${placement === 1 
                          ? "bg-yellow-600/30 text-yellow-400" 
                          : placement === 2 
                          ? "bg-orange-600/30 text-orange-400"
                          : placement <= 4
                          ? "bg-blue-600/30 text-blue-400"
                          : "bg-gray-600/30 text-gray-400"}
                      `}
                    >
                      #{placement}
                    </div>
                    
                    {/* Team Players (2 on same line) */}
                    <div className="flex space-x-2">
                      {teamPlayers.map((participant) => {
                        const displayName = participant.riotIdGameName || "?";
                        
                        return (
                        <div key={participant.puuid} className="flex items-center space-x-1.5">
                          <div 
                            className={`
                              w-4 h-4 rounded-full overflow-hidden border relative
                              ${participant.puuid === currentPlayerPuuid 
                                ? "border-yellow-400/80 ring-1 ring-yellow-400/60" 
                                : "border-purple-400/50"}
                            `}
                          >
                            <img
                              src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formatChampionName(participant.championName)}.png`}
                              alt={`${participant.championName} champion`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.classList.remove("hidden");
                                  fallback.classList.add("flex");
                                }
                              }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center text-xs font-bold bg-gray-700 text-white">
                              {participant.championName.slice(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <span 
                            className={`
                              text-[10px] truncate w-[36px] text-left
                              ${participant.puuid === currentPlayerPuuid 
                                ? "text-yellow-400 font-semibold" 
                                : "text-gray-400"}
                            `}
                            title={displayName}
                          >
                            {displayName}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          ) : (
            /* Ranked/Normal Mode - 2 teams of 5 players each */
            <>
              {/* Team 1 (left side) */}
              <div className="flex flex-col space-y-0.5">
                {matchData.info.participants
                  .filter(p => p.teamId === 100)
                  .map((participant) => {
                    const displayName = participant.riotIdGameName || "?";
                    
                    return (
                  <div key={participant.puuid} className="flex items-center space-x-1">
                    <div 
                      className={`
                        w-4 h-4 rounded-full overflow-hidden border relative
                        ${participant.teamId === currentPlayer.teamId 
                          ? "border-blue-400/60" 
                          : "border-red-400/60"}
                        ${participant.puuid === currentPlayerPuuid 
                          ? "ring-1 ring-yellow-400/80" 
                          : ""}
                      `}
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formatChampionName(participant.championName)}.png`}
                        alt={`${participant.championName} champion`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-xs font-bold bg-gray-700 text-white">
                        {participant.championName.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <span 
                      className={`
                        text-[10px] truncate max-w-[36px] text-left
                        ${participant.puuid === currentPlayerPuuid 
                          ? "text-yellow-400 font-semibold" 
                          : "text-gray-400"}
                      `}
                      title={displayName}
                    >
                      {displayName}
                    </span>
                  </div>
                    );
                  })}
              </div>

              {/* Team 2 (right side) */}
              <div className="flex flex-col space-y-0.5">
                {matchData.info.participants
                  .filter(p => p.teamId === 200)
                  .map((participant) => {
                    const displayName = participant.riotIdGameName || "?";
                    
                    return (
                  <div key={participant.puuid} className="flex items-center space-x-1">
                    <div 
                      className={`
                        w-4 h-4 rounded-full overflow-hidden border relative
                        ${participant.teamId === currentPlayer.teamId 
                          ? "border-blue-400/60" 
                          : "border-red-400/60"}
                        ${participant.puuid === currentPlayerPuuid 
                          ? "ring-1 ring-yellow-400/80" 
                          : ""}
                      `}
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formatChampionName(participant.championName)}.png`}
                        alt={`${participant.championName} champion`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-xs font-bold bg-gray-700 text-white">
                        {participant.championName.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <span 
                      className={`
                        text-[10px] truncate w-[36px] text-left
                        ${participant.puuid === currentPlayerPuuid 
                          ? "text-yellow-400 font-semibold" 
                          : "text-gray-400"}
                      `}
                      title={displayName}
                    >
                      {displayName}
                    </span>
                  </div>
                    );
                  })}
              </div>
            </>
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
        </div>
      )}
    </div>
  );
}
