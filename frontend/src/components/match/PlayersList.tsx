import type { ParticipantDto } from "../../types/Match";
import { useChampionImageUrl } from "../../hooks/useChampionImageUrl";
import { useNavigate } from "react-router-dom";

interface PlayersListProps {
  participants: ParticipantDto[];
  currentPlayerPuuid: string;
  queueId: number;
  gameVersion: string;
  region: string; // Added region prop for navigation
}

export default function PlayersList({
  participants,
  currentPlayerPuuid,
  queueId,
  gameVersion,
  region
}: PlayersListProps) {
  const { getChampionImageUrl } = useChampionImageUrl(gameVersion);
  const navigate = useNavigate();

  const truncateName = (name: string) => {
    return name.length > 8 ? name.slice(0, 5) + "..." : name;
  };

  const handlePlayerClick = (player: ParticipantDto) => {
    // Extract name and tag from riotIdGameName and riotIdTagline or use summonerName
    const name = player.riotIdGameName || player.summonerName;
    const tag = player.riotIdTagline || "EUW"; // Default tag if not available

    if (name) {
      const regionWithoutNumber = region ? region.replace(/[0-9]/g, "") : "EUW";
      navigate(
        `/summoners/${regionWithoutNumber}/${encodeURIComponent(
          name
        )}-${encodeURIComponent(tag)}/overview`
      );
    }
  };

  // Arena mode (queue 1700)
  if (queueId === 1700) {
    // Group players by placement and sort by placement (4 best teams)
    const teamsByPlacement = new Map<number, ParticipantDto[]>();

    // Group players by their placement
    participants.forEach((player) => {
      const placement = player.placement || 8; // Default to last place if no placement
      if (!teamsByPlacement.has(placement)) {
        teamsByPlacement.set(placement, []);
      }
      teamsByPlacement.get(placement)!.push(player);
    });

    // Get the 4 best teams (placements 1-4) sorted by placement
    const topTeams = Array.from(teamsByPlacement.entries())
      .filter(([placement]) => placement <= 4)
      .sort(([a], [b]) => a - b)
      .slice(0, 4);

    return (
      <div className="flex flex-col space-y-1">
        {topTeams.map(([placement, team]) => {
          return (
            <div key={placement} className="flex items-center space-x-2 w-48">
              <span
                className={`text-xs font-bold w-6 flex-shrink-0 ${
                  placement === 1
                    ? "text-yellow-400"
                    : placement === 2
                    ? "text-gray-300"
                    : placement === 3
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                #{placement}
              </span>
              <div className="flex space-x-1 flex-1 min-w-0">
                {team.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="flex items-center space-x-1 flex-1 min-w-0 cursor-pointer hover:bg-gray-700/30 rounded px-1 py-0.5 transition-colors"
                    onClick={() => handlePlayerClick(player)}
                    title={`View ${
                      player.riotIdGameName || player.summonerName
                    }'s profile`}
                  >
                    <img
                      src={getChampionImageUrl(player.championName)}
                      alt={player.championName}
                      className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                        player.puuid === currentPlayerPuuid
                          ? "border-blue-400"
                          : "border-gray-600"
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/16/16";
                      }}
                    />
                    <span
                      className={`text-xs truncate hover:text-white transition-colors ${
                        player.puuid === currentPlayerPuuid
                          ? "text-blue-400 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {truncateName(
                        player.riotIdGameName || player.summonerName
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Regular 5v5 modes
  const team1 = participants.slice(0, 5);
  const team2 = participants.slice(5, 10);

  const renderTeam = (team: ParticipantDto[]) => (
    <div className="flex flex-col space-y-1">
      {team.map((player, playerIndex) => (
        <div
          key={playerIndex}
          className="flex items-center space-x-1 cursor-pointer hover:bg-gray-700/30 rounded px-1 py-0.5 transition-colors"
          onClick={() => handlePlayerClick(player)}
          title={`View ${
            player.riotIdGameName || player.summonerName
          }'s profile`}
        >
          <img
            src={getChampionImageUrl(player.championName)}
            alt={player.championName}
            className={`w-4 h-4 rounded-full border ${
              player.puuid === currentPlayerPuuid
                ? "border-blue-400"
                : "border-gray-600"
            }`}
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/16/16";
            }}
          />
          <span
            className={`text-xs max-w-[3rem] truncate hover:text-white transition-colors ${
              player.puuid === currentPlayerPuuid
                ? "text-blue-400 font-medium"
                : "text-gray-400"
            }`}
          >
            {truncateName(player.riotIdGameName || player.summonerName)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center space-x-4">
      {renderTeam(team1)}
      {renderTeam(team2)}
    </div>
  );
}
