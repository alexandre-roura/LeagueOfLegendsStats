import { useState, useEffect } from "react";
import type { MatchDto } from "../types/Match";
import { useMatchQuery } from "./useQueries";

interface UseMatchDataProps {
  matchId: string;
  region: string;
  enabled?: boolean;
}

interface UseMatchDataReturn {
  matchData: MatchDto | null;
  loading: boolean;
  error: Error | null;
  showContent: boolean;
}

export function useMatchData({
  matchId,
  region,
  enabled = true,
}: UseMatchDataProps): UseMatchDataReturn {
  const [showContent, setShowContent] = useState(false);

  // Use React Query for match data
  const {
    data: matchData,
    isLoading,
    error,
  } = useMatchQuery({
    matchId,
    region,
    enabled,
  });

  // Handle content visibility with animation delay
  useEffect(() => {
    if (!isLoading && matchData) {
      // Add a minimum delay for smooth animations
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, matchData]);

  return {
    matchData: matchData || null,
    loading: isLoading,
    error: error as Error | null,
    showContent,
  };
}
