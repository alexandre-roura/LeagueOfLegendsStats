/**
 * Hook for generating item image URLs from Data Dragon API
 * Handles item ID validation and URL generation
 */
import { getLatestGameVersion } from "../utils";
import type { ParticipantDto } from "../types/Match";

export function useItemImageUrl(gameVersion: string = getLatestGameVersion()) {
  /**
   * Generates the Data Dragon URL for an item image
   * @param itemId - The item ID from Riot API
   * @returns The complete URL to the item image, or empty string for invalid items
   */
  const getItemImageUrl = (itemId: number): string => {
    // Item ID 0 means no item equipped
    if (itemId === 0 || !itemId) {
      return "";
    }

    // Validate that itemId is a positive number
    if (itemId < 0 || !Number.isInteger(itemId)) {
      console.warn(`[useItemImageUrl] Invalid item ID: ${itemId}`);
      return "";
    }

    const url = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${itemId}.png`;

    return url;
  };

  /**
   * Checks if an item ID is valid (not 0 or empty)
   * @param itemId - The item ID to validate
   * @returns True if the item ID is valid, false otherwise
   */
  const isValidItemId = (itemId: number): boolean => {
    return itemId > 0 && Number.isInteger(itemId);
  };

  /**
   * Gets all item URLs for a participant's items
   * @param items - Array of 7 item IDs (items 0-6)
   * @returns Array of item image URLs (empty string for empty slots)
   */
  const getParticipantItemUrls = (items: number[]): string[] => {
    return items.map(itemId => getItemImageUrl(itemId));
  };

  /**
   * Extracts all item IDs from a participant
   * @param participant - The participant data
   * @returns Array of all 7 item IDs [item0, item1, ..., item6]
   */
  const getParticipantItems = (participant: ParticipantDto): number[] => {
    return [
      participant.item0,
      participant.item1,
      participant.item2,
      participant.item3,
      participant.item4,
      participant.item5,
      participant.item6,
    ];
  };

  /**
   * Gets all item URLs for a participant
   * @param participant - The participant data
   * @returns Array of item image URLs (empty string for empty slots)
   */
  const getParticipantItemUrlsFromData = (participant: ParticipantDto): string[] => {
    return getParticipantItemUrls(getParticipantItems(participant));
  };

  return {
    getItemImageUrl,
    isValidItemId,
    getParticipantItemUrls,
    getParticipantItems,
    getParticipantItemUrlsFromData,
  };
}
