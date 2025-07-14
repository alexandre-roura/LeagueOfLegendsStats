import { useState, useEffect } from "react";
import type { MatchDto } from "../types/Match";
import { getApiUrl, API_CONFIG } from "../config/api";

interface UseMatchDataProps {
  matchId: string;
  region: string;
}

interface UseMatchDataReturn {
  matchData: MatchDto | null;
  loading: boolean;
  error: string | null;
  showContent: boolean;
}

export function useMatchData({
  matchId,
  region,
}: UseMatchDataProps): UseMatchDataReturn {
  const [matchData, setMatchData] = useState<MatchDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const endpoint = API_CONFIG.ENDPOINTS.MATCH_DETAILS(matchId);
        const url = getApiUrl(endpoint) + `?region=${region}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch match details: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setMatchData(data.data);
        } else {
          throw new Error("Failed to fetch match details from server");
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        // Add a minimum loading time for better UX
        setTimeout(() => {
          setLoading(false);
          setShowContent(true);
        }, 300);
      }
    };

    fetchMatchDetails();
  }, [matchId, region]);

  return {
    matchData,
    loading,
    error,
    showContent,
  };
}
