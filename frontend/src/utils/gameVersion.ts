/**
 * Utility functions for game version handling
 */

import type { MatchDto } from "../types/Match";

// Cache pour éviter de faire trop de requêtes
let cachedLatestVersion: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches the latest game version from Riot's Data Dragon API
 * @returns Promise<string> The latest game version
 */
async function fetchLatestGameVersion(): Promise<string> {
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch versions: ${response.status}`);
    }

    const versions: string[] = await response.json();
    return versions[0]; // La première version est toujours la plus récente
  } catch (error) {
    console.warn("Failed to fetch latest game version, using fallback:", error);
    return "15.13.1"; // Fallback version
  }
}

/**
 * Gets the latest available game version for Data Dragon with caching
 * @returns Promise<string> The latest game version string
 */
export async function getLatestGameVersion(): Promise<string> {
  const now = Date.now();

  // Utiliser le cache si disponible et pas expiré
  if (cachedLatestVersion && now - cacheTimestamp < CACHE_DURATION) {
    return cachedLatestVersion;
  }

  // Récupérer la nouvelle version
  const latestVersion = await fetchLatestGameVersion();
  cachedLatestVersion = latestVersion;
  cacheTimestamp = now;

  return latestVersion;
}

/**
 * Gets the latest available game version synchronously (uses cached value or fallback)
 * @returns The latest game version string
 */
export function getLatestGameVersionSync(): string {
  return cachedLatestVersion || "15.13.1";
}

/**
 * Extracts and formats the game version from match data
 * @param gameVersion - The raw game version from match data (e.g., "14.23.590.9183")
 * @param fallbackVersion - Fallback version to use if gameVersion is not provided
 * @returns Formatted version string for Data Dragon API (e.g., "14.23.1")
 */
export function getFormattedGameVersion(
  gameVersion?: string,
  fallbackVersion: string = getLatestGameVersionSync()
): string {
  if (!gameVersion) {
    return fallbackVersion;
  }

  // Split the version and take the first two parts (major.minor)
  // Then add ".1" for Data Dragon compatibility
  const versionParts = gameVersion.split(".");
  if (versionParts.length >= 2) {
    return `${versionParts[0]}.${versionParts[1]}.1`;
  }

  return fallbackVersion;
}

/**
 * Extracts the game version directly from match data
 * @param matchData - The complete match data object
 * @param fallbackVersion - Fallback version to use if match data doesn't contain version
 * @returns Formatted version string for Data Dragon API
 */
export function getGameVersionFromMatch(
  matchData?: MatchDto,
  fallbackVersion: string = getLatestGameVersionSync()
): string {
  return getFormattedGameVersion(matchData?.info.gameVersion, fallbackVersion);
}

/**
 * Validates if a game version string is in the correct format
 * @param version - Version string to validate
 * @returns True if the version is valid, false otherwise
 */
export function isValidGameVersion(version: string): boolean {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
}

// Initialize cache au chargement du module
getLatestGameVersion().catch(() => {
  // Si l'initialisation échoue, on utilise la version de fallback
});
