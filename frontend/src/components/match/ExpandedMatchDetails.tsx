import type { MatchDto, ParticipantDto } from "../../types/Match";
import { formatGameDuration } from "../../utils/timeUtils";
import { getMatchTypeInfo } from "../../utils/gameConstants";
import { useChampionImageUrl } from "../../hooks/useChampionImageUrl";
import { useItemImageUrl } from "../../hooks/useItemImageUrl";
import { getFormattedGameVersion } from "../../utils";
import { getFormattedArenaTeamName, getArenaTeamImageUrl } from "../../utils/arenaTeams";

interface ExpandedMatchDetailsProps {
  matchData: MatchDto;
  currentPlayerPuuid: string;
}

export default function ExpandedMatchDetails({
  matchData,
  currentPlayerPuuid,
}: ExpandedMatchDetailsProps) {
  const matchTypeInfo = getMatchTypeInfo(matchData.info.queueId);

  const gameVersion = getFormattedGameVersion(matchData.info.gameVersion);
  const { getChampionImageUrl } = useChampionImageUrl(gameVersion);
  const { getItemImageUrl, isValidItemId, getParticipantItems } = useItemImageUrl(gameVersion);

  const renderParticipant = (
    participant: ParticipantDto,
    isArenaMode = false,
    maxDamageDealt = 0,
    maxDamageTaken = 0
  ) => {
    const isCurrentPlayer = participant.puuid === currentPlayerPuuid;
    const placement = participant.placement || 8;
    const isTop4 = placement <= 4;

    const damageDealtPercentage = maxDamageDealt > 0 ? (participant.totalDamageDealt / maxDamageDealt) * 100 : 0;
    const damageTakenPercentage = maxDamageTaken > 0 ? (participant.totalDamageTaken / maxDamageTaken) * 100 : 0;

    return (
      <div
        key={participant.puuid}
        className={`grid gap-2 md:gap-4 items-center p-2 md:p-3 rounded text-xs ${
          isCurrentPlayer
            ? "bg-blue-900/30 border border-blue-600/50"
            : isArenaMode
            ? isTop4
              ? "bg-green-900/30 border border-green-600/50"
              : "bg-red-900/30 border border-red-600/50"
            : "bg-gray-800/50 border border-gray-700/30"
        }`}
        style={{ 
          gridTemplateColumns: "minmax(100px, 150px) minmax(40px, 60px) minmax(40px, 60px) minmax(40px, 60px) minmax(50px, 70px) minmax(80px, 120px)"
        }}
      >
        {/* Player Info */}
        <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
          <img
            src={getChampionImageUrl(participant.championName)}
            alt={participant.championName}
            className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/32/32";
            }}
          />
          <div className="min-w-0 flex-1 text-left">
            <div
              className={`font-medium text-xs truncate ${
                isCurrentPlayer ? "text-blue-400" : "text-white"
              }`}
              title={participant.riotIdGameName || participant.summonerName}
            >
              {participant.riotIdGameName || participant.summonerName}
            </div>
            <div className="text-xs text-gray-400 truncate hidden md:block" title={participant.championName}>
              {participant.championName}
            </div>
          </div>
        </div>

        {/* KDA */}
        <div className="text-center">
          <div className="text-white font-medium text-xs">
            {participant.kills}/{participant.deaths}/{participant.assists}
          </div>
        </div>

        {/* Damage Dealt */}
        <div className="text-center">
          <div className="text-white text-xs mb-1">
            {Math.round(participant.totalDamageDealt / 1000)}k
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-red-500 h-1 rounded-full" 
              style={{ width: `${damageDealtPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Damage Taken */}
        <div className="text-center">
          <div className="text-white text-xs mb-1">
            {Math.round(participant.totalDamageTaken / 1000)}k
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gray-400 h-1 rounded-full" 
              style={{ width: `${damageTakenPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Gold */}
        <div className="text-center">
          <div className="text-white text-xs">
            {(participant.goldEarned / 1000).toFixed(1)}k
          </div>
        </div>

        {/* Items */}
        <div className="flex items-center space-x-0.5 md:space-x-1 ml-auto">
          {getParticipantItems(participant).map((itemId, index) => (
            <div
              key={index}
              className="w-4 h-4 md:w-5 md:h-5 bg-gray-700 rounded border border-gray-600 flex-shrink-0"
            >
              {isValidItemId(itemId) && (
                <img
                  src={getItemImageUrl(itemId)}
                  alt={`Item ${itemId}`}
                  className="w-full h-full rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeams = () => {
    // Calculate max damage values across all participants
    const maxDamageDealt = Math.max(...matchData.info.participants.map(p => p.totalDamageDealt));
    const maxDamageTaken = Math.max(...matchData.info.participants.map(p => p.totalDamageTaken));

    // Arena mode (queue 1700) - group by placement
    if (matchData.info.queueId === 1700) {
      const teamsByPlacement = new Map<number, ParticipantDto[]>();      // Group players by their placement
      matchData.info.participants.forEach((player) => {
        const placement = player.placement || 8; // Default to last place if no placement
        if (!teamsByPlacement.has(placement)) {
          teamsByPlacement.set(placement, []);
        }
        teamsByPlacement.get(placement)!.push(player);
      });

      // Get all teams sorted by placement
      const allTeams = Array.from(teamsByPlacement.entries()).sort(
        ([a], [b]) => a - b
      );

      console.log("First participant data:", matchData.info.participants[0].playerSubteamId);
      return (
        <div className="space-y-4">
          {allTeams.map(([placement, team], teamIndex) => (
            <div key={placement} className="space-y-2">
              <div 
                className="grid gap-2 md:gap-4 items-center p-2 md:p-3 bg-gray-800/30 rounded border border-gray-700/50 text-xs"
                style={{ 
                  gridTemplateColumns: "minmax(100px, 150px) minmax(40px, 60px) minmax(40px, 60px) minmax(40px, 60px) minmax(50px, 70px) minmax(80px, 120px)"
                }}
              >
                <div className="flex items-center space-x-1">
                  <div
                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      placement === 1
                        ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                        : placement === 2
                        ? "bg-gray-300/20 text-gray-300 border border-gray-300/50"
                        : placement === 3
                        ? "bg-amber-600/20 text-amber-600 border border-amber-600/50"
                        : placement === 4
                        ? "bg-blue-400/20 text-blue-400 border border-blue-400/50"
                        : "bg-gray-500/20 text-gray-500 border border-gray-500/50"
                    }`}
                  >
                    #{placement}
                  </div>
                  {team.length > 0 && (
                    <div className="flex items-center space-x-1 px-1 py-0.5 rounded text-xs font-medium bg-gray-600/30 text-gray-300">
                      {getArenaTeamImageUrl(team[0].playerSubteamId) && (
                        <img
                          src={getArenaTeamImageUrl(team[0].playerSubteamId)}
                          alt={getFormattedArenaTeamName(team[0].playerSubteamId)}
                          className="w-3 h-3"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span>{getFormattedArenaTeamName(team[0].playerSubteamId)}</span>
                    </div>
                  )}
                </div>
                <div className="text-center text-xs font-medium text-gray-400">KDA</div>
                <div className="text-center text-xs font-medium text-gray-400">Dealt</div>
                <div className="text-center text-xs font-medium text-gray-400">Taken</div>
                <div className="text-center text-xs font-medium text-gray-400">Gold</div>
                <div className="text-right text-xs font-medium text-gray-400">Items</div>
              </div>
              
              <div className="space-y-2">
                {team.map((participant) =>
                  renderParticipant(participant, true, maxDamageDealt, maxDamageTaken)
                )}
              </div>
              {teamIndex < allTeams.length - 1 && (
                <div className="border-b border-gray-600/30 mt-4"></div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Regular 5v5 modes - group by teamId
    const team1 = matchData.info.participants.filter((p) => p.teamId === 100);
    const team2 = matchData.info.participants.filter((p) => p.teamId === 200);

    const team1Won =
      matchData.info.teams.find((t) => t.teamId === 100)?.win || false;
    const team2Won =
      matchData.info.teams.find((t) => t.teamId === 200)?.win || false;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div 
            className="grid gap-2 md:gap-4 items-center p-2 md:p-3 bg-gray-800/30 rounded border border-gray-700/50 text-xs"
            style={{ 
              gridTemplateColumns: "minmax(100px, 150px) minmax(40px, 60px) minmax(40px, 60px) minmax(40px, 60px) minmax(50px, 70px) minmax(80px, 120px)"
            }}
          >
            <div
              className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                team1Won
                  ? "bg-green-400/20 text-green-400 border border-green-400/50"
                  : "bg-red-400/20 text-red-400 border border-red-400/50"
              }`}
            >
              Team 1
            </div>
            <div className="text-center text-xs font-medium text-gray-400">KDA</div>
            <div className="text-center text-xs font-medium text-gray-400">Dealt</div>
            <div className="text-center text-xs font-medium text-gray-400">Taken</div>
            <div className="text-center text-xs font-medium text-gray-400">Gold</div>
            <div className="text-right text-xs font-medium text-gray-400">Items</div>
          </div>
          
          <div className="space-y-2">
            {team1.map((participant) => renderParticipant(participant, false, maxDamageDealt, maxDamageTaken))}
          </div>
        </div>

        <div className="border-b border-gray-600/30"></div>

        <div className="space-y-2">
          <div 
            className="grid gap-2 md:gap-4 items-center p-2 md:p-3 bg-gray-800/30 rounded border border-gray-700/50 text-xs"
            style={{ 
              gridTemplateColumns: "minmax(100px, 150px) minmax(40px, 60px) minmax(40px, 60px) minmax(40px, 60px) minmax(50px, 70px) minmax(80px, 120px)"
            }}
          >
            <div
              className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                team2Won
                  ? "bg-green-400/20 text-green-400 border border-green-400/50"
                  : "bg-red-400/20 text-red-400 border border-red-400/50"
              }`}
            >
              Team 2
            </div>
            <div className="text-center text-xs font-medium text-gray-400">KDA</div>
            <div className="text-center text-xs font-medium text-gray-400">Dealt</div>
            <div className="text-center text-xs font-medium text-gray-400">Taken</div>
            <div className="text-center text-xs font-medium text-gray-400">Gold</div>
            <div className="text-right text-xs font-medium text-gray-400">Items</div>
          </div>
          
          <div className="space-y-2">
            {team2.map((participant) => renderParticipant(participant, false, maxDamageDealt, maxDamageTaken))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 space-y-2 md:space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center text-xs md:text-sm text-gray-400 space-y-1 md:space-y-0">
        <span>
          {matchTypeInfo.displayName} • {matchTypeInfo.map}
        </span>
        <span>Duration: {formatGameDuration(matchData.info.gameDuration)}</span>
      </div>

      <div className="space-y-2 md:space-y-4">
        <h4 className="text-base md:text-lg font-semibold text-white">Match Details</h4>
        {renderTeams()}
      </div>
    </div>
  );
}
