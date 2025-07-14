import type { MatchDto, ParticipantDto } from "../../types/Match";
import { formatGameDuration } from "../../utils/timeUtils";
import { getMatchTypeInfo } from "../../utils/gameConstants";

interface ExpandedMatchDetailsProps {
  matchData: MatchDto;
  currentPlayerPuuid: string;
}

export default function ExpandedMatchDetails({
  matchData,
  currentPlayerPuuid,
}: ExpandedMatchDetailsProps) {
  const matchTypeInfo = getMatchTypeInfo(matchData.info.queueId);

  const getChampionImageUrl = (championName: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName}.png`;
  };

  const getItemImageUrl = (itemId: number) => {
    if (itemId === 0) return "";
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/${itemId}.png`;
  };

  const renderParticipant = (
    participant: ParticipantDto,
    isArenaMode = false
  ) => {
    const isCurrentPlayer = participant.puuid === currentPlayerPuuid;
    const placement = participant.placement || 8;
    const isTop4 = placement <= 4;

    return (
      <div
        key={participant.puuid}
        className={`flex items-center justify-between p-3 rounded ${
          isCurrentPlayer
            ? "bg-blue-900/30 border border-blue-600/50"
            : isArenaMode
            ? isTop4
              ? "bg-green-900/30 border border-green-600/50"
              : "bg-red-900/30 border border-red-600/50"
            : "bg-gray-800/50 border border-gray-700/30"
        }`}
      >
        <div className="flex items-center space-x-3">
          <img
            src={getChampionImageUrl(participant.championName)}
            alt={participant.championName}
            className="w-10 h-10 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/40/40";
            }}
          />
          <div>
            <div
              className={`font-medium ${
                isCurrentPlayer ? "text-blue-400" : "text-white"
              }`}
            >
              {participant.riotIdGameName || participant.summonerName}
            </div>
            <div className="text-sm text-gray-400">
              {participant.championName}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-white font-medium">
              {participant.kills}/{participant.deaths}/{participant.assists}
            </div>
            <div className="text-xs text-gray-400">KDA</div>
          </div>

          <div className="text-center">
            <div className="text-white">
              {participant.totalMinionsKilled +
                (participant.neutralMinionsKilled || 0)}
            </div>
            <div className="text-xs text-gray-400">CS</div>
          </div>

          <div className="text-center">
            <div className="text-white">
              {Math.round(participant.goldEarned / 1000)}k
            </div>
            <div className="text-xs text-gray-400">Gold</div>
          </div>

          <div className="flex space-x-1">
            {[
              participant.item0,
              participant.item1,
              participant.item2,
              participant.item3,
              participant.item4,
              participant.item5,
              participant.item6,
            ].map((itemId, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-gray-700 rounded border border-gray-600"
              >
                {itemId > 0 && (
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
      </div>
    );
  };

  const renderTeams = () => {
    // Arena mode (queue 1700) - group by placement
    if (matchData.info.queueId === 1700) {
      const teamsByPlacement = new Map<number, ParticipantDto[]>();

      // Group players by their placement
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

      return (
        <div className="space-y-4">
          {allTeams.map(([placement, team], teamIndex) => (
            <div key={placement} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
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
                  #{placement} Place
                </div>
              </div>
              <div className="space-y-2">
                {team.map((participant) =>
                  renderParticipant(participant, true)
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
          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                team1Won
                  ? "bg-green-400/20 text-green-400 border border-green-400/50"
                  : "bg-red-400/20 text-red-400 border border-red-400/50"
              }`}
            >
              Team 1 {team1Won ? "(Victory)" : "(Defeat)"}
            </div>
          </div>
          <div className="space-y-2">
            {team1.map((participant) => renderParticipant(participant, false))}
          </div>
        </div>

        <div className="border-b border-gray-600/30"></div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                team2Won
                  ? "bg-green-400/20 text-green-400 border border-green-400/50"
                  : "bg-red-400/20 text-red-400 border border-red-400/50"
              }`}
            >
              Team 2 {team2Won ? "(Victory)" : "(Defeat)"}
            </div>
          </div>
          <div className="space-y-2">
            {team2.map((participant) => renderParticipant(participant, false))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>
          {matchTypeInfo.displayName} • {matchTypeInfo.map}
        </span>
        <span>Duration: {formatGameDuration(matchData.info.gameDuration)}</span>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Match Details</h4>
        {renderTeams()}
      </div>
    </div>
  );
}
