/**
 * Formats champion names for Data Dragon API compatibility
 * Handles special cases where the API expects different naming conventions
 */
export function useChampionImageUrl(gameVersion: string) {
  const formatChampionName = (name: string) => {
    // Handle special cases for champion names that differ in Data Dragon filenames
    const specialCases: { [key: string]: string } = {
      "Nunu & Willump": "Nunu",
      Wukong: "MonkeyKing",
      LeBlanc: "Leblanc",
      "Vel'Koz": "Velkoz",
      "Cho'Gath": "Chogath",
      "Kai'Sa": "Kaisa",
      "Kha'Zix": "Khazix",
      "Kog'Maw": "KogMaw",
      "Rek'Sai": "RekSai",
      FiddleSticks: "Fiddlesticks",
    };

    return specialCases[name] || name.replace(/[^a-zA-Z0-9]/g, "");
  };

  const getChampionImageUrl = (championName: string) => {
    const formattedName = formatChampionName(championName);
    return `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formattedName}.png`;
  };

  return { getChampionImageUrl, formatChampionName };
}
