import type { ParticipantDto } from "../../types/Match";

interface ChampionDisplayProps {
  participant: ParticipantDto;
  championImageUrl: string;
  isWin: boolean;
}

export default function ChampionDisplay({
  participant,
  championImageUrl,
  isWin,
}: ChampionDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-16 h-16 rounded-lg relative overflow-hidden border-2
          ${isWin ? "border-green-500/50" : "border-red-500/50"}
        `}
      >
        <img
          src={championImageUrl}
          alt={participant.championName}
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
          {participant.championName.slice(0, 2).toUpperCase()}
        </div>

        {/* Champion Level Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-yellow-400 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-gray-600">
          {participant.champLevel}
        </div>
      </div>
    </div>
  );
}
