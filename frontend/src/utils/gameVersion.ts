/**
 * Utility functions for game version handling
 */

import type { MatchDto } from "../types/Match";

/**
 * Extracts and formats the game version from match data
 * @param gameVersion - The raw game version from match data (e.g., "14.23.590.9183")
 * @param fallbackVersion - Fallback version to use if gameVersion is not provided
 * @returns Formatted version string for Data Dragon API (e.g., "14.23.1")
 */
export function getFormattedGameVersion(
  gameVersion?: string,
  fallbackVersion: string = getLatestGameVersion()
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
  fallbackVersion: string = getLatestGameVersion()
): string {
  return getFormattedGameVersion(matchData?.info.gameVersion, fallbackVersion);
}

/**
 * Gets the latest available game version for Data Dragon
 * This can be extended to fetch from Riot's version API in the future
 * @returns The latest game version string
 */
export function getLatestGameVersion(): string {
  return "15.13.1";
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
