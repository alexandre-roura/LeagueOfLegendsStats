/**
 * Formats champion names for Data Dragon API compatibility
 * Handles special cases where the API expects different naming conventions
 */
import { getLatestGameVersion } from "../utils";

export function useChampionImageUrl(gameVersion: string = getLatestGameVersion()) {
  const formatChampionName = (name: string) => {
    // Handle special cases for champion names that differ in Data Dragon filenames
    const specialCases: { [key: string]: string } = {
      "Nunu & Willump": "Nunu",
      "Wukong": "MonkeyKing",
      "LeBlanc": "Leblanc",
      "Vel'Koz": "Velkoz",
      "Cho'Gath": "Chogath",
      "Kai'Sa": "Kaisa",
      "Kha'Zix": "Khazix",
      "Kog'Maw": "KogMaw",
      "Rek'Sai": "RekSai",
      "FiddleSticks": "Fiddlesticks",    // API peut retourner "FiddleSticks" 
      "Fiddlesticks": "Fiddlesticks",    // API peut retourner "Fiddlesticks"
      "fiddlesticks": "Fiddlesticks",    // Au cas où en minuscules
      "FIDDLESTICKS": "Fiddlesticks",    // Au cas où en majuscules
      "Fiddlestick": "Fiddlesticks",     // Au cas où sans le 's' final
      "fiddlestick": "Fiddlesticks",     // Sans 's' et minuscules
    };

    return specialCases[name] || name.replace(/[^a-zA-Z0-9]/g, "");
  };

  const getChampionImageUrl = (championName: string) => {
    const formattedName = formatChampionName(championName);
    const url = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${formattedName}.png`;
    return url;
  };

  return { getChampionImageUrl, formatChampionName };
}
