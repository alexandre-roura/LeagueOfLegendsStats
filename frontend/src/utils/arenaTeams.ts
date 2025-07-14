/**
 * Arena team names utility
 * Maps playerSubteamId to team names for Arena mode
 */

// Mapping des playerSubteamId vers les noms d'équipes Arena
const ARENA_TEAM_NAMES: Record<number, string> = {
  1: "Poros",
  2: "Minions", 
  3: "Scuttles",
  4: "Krugs",
  5: "Raptors",
  6: "Sentinels",
  7: "Wolves",
  8: "Gromps"
};

// Mapping des noms d'équipes vers les noms de fichiers d'images
const ARENA_TEAM_IMAGES: Record<string, string> = {
  "Poros": "poro",
  "Minions": "minion", 
  "Scuttles": "scuttle",
  "Krugs": "krug",
  "Raptors": "raptor",
  "Sentinels": "sentinel",
  "Wolves": "wolf",
  "Gromps": "gromp"
};

/**
 * Gets the team name for an Arena team based on playerSubteamId
 * @param playerSubteamId - The player subteam ID from Arena match data
 * @returns The team name (e.g., "Wolves", "Raptors") or "Unknown Team" if not found
 */
export function getArenaTeamName(playerSubteamId: number | undefined): string {
  if (playerSubteamId === undefined || playerSubteamId === null) {
    return "Unknown Team";
  }
  
  return ARENA_TEAM_NAMES[playerSubteamId] || `Team ${playerSubteamId}`;
}

/**
 * Gets a formatted team name for display
 * @param playerSubteamId - The player subteam ID from Arena match data
 * @returns Formatted team name (e.g., "Team Wolves")
 */
export function getFormattedArenaTeamName(playerSubteamId: number | undefined): string {
  const teamName = getArenaTeamName(playerSubteamId);
  return teamName === "Unknown Team" ? teamName : `Team ${teamName}`;
}

/**
 * Gets the team image URL for an Arena team
 * @param playerSubteamId - The player subteam ID from Arena match data
 * @returns The URL to the team image
 */
export function getArenaTeamImageUrl(playerSubteamId: number | undefined): string {
  if (playerSubteamId === undefined || playerSubteamId === null) {
    return "";
  }
  
  const teamName = ARENA_TEAM_NAMES[playerSubteamId];
  if (!teamName) {
    return "";
  }
  
  const imageName = ARENA_TEAM_IMAGES[teamName];
  if (!imageName) {
    return "";
  }
  
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/subteams/${imageName}.svg`;
}
