import type { ParticipantDto } from "../../types/Match";
import { formatNumber } from "../../utils/timeUtils";

interface GameModeStatsProps {
  participant: ParticipantDto;
  isArenaMode: boolean;
  gameDurationInSeconds: number;
  killParticipation: number;
}

export default function GameModeStats({
  participant,
  isArenaMode,
  gameDurationInSeconds,
  killParticipation,
}: GameModeStatsProps) {
  if (isArenaMode && participant.placement) {
    return (
      <div className="text-center min-w-[80px]">
        <div
          className={`
            text-sm font-semibold
            ${
              participant.placement === 1
                ? "text-yellow-400"
                : participant.placement <= 3
                ? "text-orange-400"
                : participant.placement <= 6
                ? "text-blue-400"
                : "text-gray-400"
            }
          `}
        >
          {participant.placement === 1
            ? "WINNER"
            : `TOP ${participant.placement}`}
        </div>
      </div>
    );
  }

  if (!isArenaMode) {
    const totalCS =
      participant.totalMinionsKilled + participant.neutralMinionsKilled;
    const csPerMinute = totalCS / (gameDurationInSeconds / 60);

    return (
      <div className="text-center min-w-[80px]">
        <div className="text-white font-bold text-sm">
          CS {formatNumber(totalCS)} ({csPerMinute.toFixed(1)})
        </div>
        <div className="text-gray-400 text-sm">
          {killParticipation.toFixed(0)}% KP
        </div>
      </div>
    );
  }

  return null;
}
