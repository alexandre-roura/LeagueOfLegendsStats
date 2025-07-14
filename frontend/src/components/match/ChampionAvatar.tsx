import type { ParticipantDto } from "../../types/Match";

interface ChampionAvatarProps {
  participant: ParticipantDto;
}

export default function ChampionAvatar({ participant }: ChampionAvatarProps) {
  const getChampionImageUrl = (championName: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName}.png`;
  };

  const getSummonerSpellImageUrl = (summonerSpellId: number) => {
    const spellMap: { [key: number]: string } = {
      1: "SummonerBoost",
      3: "SummonerExhaust",
      4: "SummonerFlash",
      6: "SummonerHaste",
      7: "SummonerHeal",
      11: "SummonerSmite",
      12: "SummonerTeleport",
      13: "SummonerMana",
      14: "SummonerDot",
      21: "SummonerBarrier",
      30: "SummonerPoroRecall",
      31: "SummonerPoroThrow",
      32: "SummonerSnowball",
      39: "SummonerSnowURFSnowball_Mark",
      54: "Summoner_UltBookPlaceholder",
      55: "Summoner_UltBookSmitePlaceholder",
    };

    const spellName = spellMap[summonerSpellId] || "SummonerFlash";
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/spell/${spellName}.png`;
  };

  return (
    <div className="w-16 h-16 relative">
      <img
        src={getChampionImageUrl(participant.championName)}
        alt={participant.championName}
        className="w-full h-full rounded-lg object-cover"
        onError={(e) => {
          e.currentTarget.src = "/api/placeholder/64/64";
        }}
      />
      <div className="absolute -bottom-1 -right-1 flex space-x-1">
        <img
          src={getSummonerSpellImageUrl(participant.summoner1Id)}
          alt="Summoner Spell 1"
          className="w-5 h-5 rounded border border-gray-600"
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/20/20";
          }}
        />
        <img
          src={getSummonerSpellImageUrl(participant.summoner2Id)}
          alt="Summoner Spell 2"
          className="w-5 h-5 rounded border border-gray-600"
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/20/20";
          }}
        />
      </div>
    </div>
  );
}
