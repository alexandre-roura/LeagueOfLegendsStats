import type { ParticipantDto } from "../../types/Match";
import { formatNumber } from "../../utils/timeUtils";

interface GameStatsProps {
  participant: ParticipantDto;
  gameDurationInSeconds: number;
}

export default function GameStats({
  participant,
  gameDurationInSeconds,
}: GameStatsProps) {
  const calculateCSPerMinute = () => {
    const totalCS =
      participant.totalMinionsKilled + (participant.neutralMinionsKilled || 0);
    const minutes = gameDurationInSeconds / 60;
    return (totalCS / minutes).toFixed(1);
  };

  return (
    <div className="text-center min-w-[80px]">
      <div className="text-white font-medium">
        {formatNumber(participant.goldEarned)} gold
      </div>
      <div className="text-sm text-gray-400">
        {participant.totalMinionsKilled +
          (participant.neutralMinionsKilled || 0)}{" "}
        CS ({calculateCSPerMinute()}/min)
      </div>
    </div>
  );
}
