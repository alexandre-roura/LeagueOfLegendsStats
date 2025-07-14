import type { MatchDto } from "../../types/Match";
import { formatGameDuration, formatTimeAgo } from "../../utils/timeUtils";
import { getMatchTypeInfo, getQueueIcon } from "../../utils/gameConstants";

interface MatchSummaryProps {
  matchData: MatchDto;
}

export default function MatchSummary({ matchData }: MatchSummaryProps) {
  const matchTypeInfo = getMatchTypeInfo(matchData.info.queueId);
  const queueIcon = getQueueIcon(matchData.info.queueId);
  const gameDuration = formatGameDuration(matchData.info.gameDuration);
  const timeAgo = formatTimeAgo(matchData.info.gameEndTimestamp);

  return (
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
  );
}
