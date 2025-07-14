import type { MatchDto } from "../../types/Match";
import { formatTimeAgo } from "../../utils/timeUtils";
import { getMatchTypeInfo } from "../../utils/gameConstants";

interface MatchHeaderProps {
  match: MatchDto;
  won: boolean;
}

export default function MatchHeader({ match, won }: MatchHeaderProps) {
  const matchTypeInfo = getMatchTypeInfo(match.info.queueId);

  return (
    <div
      className={`px-4 py-2 flex items-center justify-between ${
        won ? "bg-green-800/40" : "bg-red-800/40"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              won ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {won ? "Victory" : "Defeat"}
          </span>
        </div>
        <span className="text-sm text-gray-300">
          {matchTypeInfo.displayName}
        </span>
      </div>
      <span className="text-sm text-gray-400">
        {formatTimeAgo(match.info.gameEndTimestamp)}
      </span>
    </div>
  );
}
