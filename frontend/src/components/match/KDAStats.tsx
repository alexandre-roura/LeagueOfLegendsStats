import type { ParticipantDto } from "../../types/Match";

interface KDAStatsProps {
  participant: ParticipantDto;
}

export default function KDAStats({ participant }: KDAStatsProps) {
  const calculateKDA = () => {
    const { kills, deaths, assists } = participant;
    if (deaths === 0) {
      return kills + assists > 0 ? "Perfect" : "0.00";
    }
    return ((kills + assists) / deaths).toFixed(2);
  };

  const getKDAColor = () => {
    const { kills, deaths, assists } = participant;
    const kda =
      deaths === 0
        ? kills + assists > 0
          ? 10
          : 0
        : (kills + assists) / deaths;

    if (kda >= 3) return "text-yellow-400"; // Gold for excellent KDA
    if (kda >= 2) return "text-green-400"; // Green for good KDA
    if (kda >= 1) return "text-blue-400"; // Blue for average KDA
    return "text-red-400"; // Red for poor KDA
  };

  return (
    <div className="text-center min-w-[80px]">
      <div className="text-lg font-bold">
        <span className="text-green-400">{participant.kills}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-red-400">{participant.deaths}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-blue-400">{participant.assists}</span>
      </div>
      <div className={`text-sm font-medium ${getKDAColor()}`}>
        {calculateKDA()} KDA
      </div>
    </div>
  );
}
