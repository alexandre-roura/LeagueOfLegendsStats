// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  ENDPOINTS: {
    ACCOUNT: (summonerName: string, tagLine: string) =>
      `/account/${summonerName}/${tagLine}`,
    PLAYER: (summonerName: string, tagLine: string) =>
      `/player/${summonerName}/${tagLine}`,
    SUMMONER_BY_PUUID: (puuid: string) => `/summoner/puuid/${puuid}`,
    RANKINGS: (summonerId: string) => `/rankings/${summonerId}`,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Environment-based configuration
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};
