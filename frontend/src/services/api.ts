import { getApiUrl, API_CONFIG } from "../config/api";
import type { PlayerData } from "../types/Player";
import type { MatchDto } from "../types/Match";

// API Response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Custom error class for API errors
export class ApiError extends Error {
  status?: number;
  response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

// Generic API request handler
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(data.error || "API request failed");
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown API error"
    );
  }
}

// Player service
export const playerService = {
  async getPlayerInfo(
    summonerName: string,
    tagLine: string,
    region: string
  ): Promise<PlayerData> {
    const endpoint = API_CONFIG.ENDPOINTS.PLAYER(summonerName, tagLine);
    const url = `${getApiUrl(endpoint)}?region=${region}`;
    return apiRequest<PlayerData>(url);
  },

  async getAccountInfo(summonerName: string, tagLine: string, region: string) {
    const endpoint = API_CONFIG.ENDPOINTS.ACCOUNT(summonerName, tagLine);
    const url = `${getApiUrl(endpoint)}?region=${region}`;
    return apiRequest(url);
  },
};

// Match service
export const matchService = {
  async getMatchHistory(
    puuid: string,
    region: string,
    start = 0,
    count = 10
  ): Promise<string[]> {
    const endpoint = API_CONFIG.ENDPOINTS.MATCH_HISTORY(puuid);
    const url = `${getApiUrl(
      endpoint
    )}?region=${region}&start=${start}&count=${count}`;
    return apiRequest<string[]>(url);
  },

  async getMatchDetails(matchId: string, region: string): Promise<MatchDto> {
    const endpoint = API_CONFIG.ENDPOINTS.MATCH_DETAILS(matchId);
    const url = `${getApiUrl(endpoint)}?region=${region}`;
    return apiRequest<MatchDto>(url);
  },
};

// Utility functions for error handling
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
