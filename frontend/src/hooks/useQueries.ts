import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  playerService,
  matchService,
  getErrorMessage,
  ApiError,
} from "../services/api";
import type { PlayerData } from "../types/Player";

// =====================================
// QUERY KEYS - Centralisés pour éviter les erreurs
// =====================================

export const queryKeys = {
  // Joueurs
  player: (name: string, tag: string, region: string) =>
    ["player", { name, tag, region }] as const,

  // Historique de matchs
  matchHistory: (
    puuid: string,
    region: string,
    count?: number,
    start?: number
  ) => ["matchHistory", { puuid, region, count, start }] as const,

  // Détails d'un match
  match: (matchId: string, region: string) =>
    ["match", { matchId, region }] as const,
} as const;

// =====================================
// PLAYER QUERIES
// =====================================

export interface UsePlayerQueryOptions {
  name: string;
  tag: string;
  region: string;
  enabled?: boolean;
}

export function usePlayerQuery({
  name,
  tag,
  region,
  enabled = true,
}: UsePlayerQueryOptions) {
  return useQuery({
    queryKey: queryKeys.player(name, tag, region),
    queryFn: async (): Promise<PlayerData> => {
      try {
        const data = await playerService.getPlayerInfo(name, tag, region);
        return data;
      } catch (error) {
        // Transform l'erreur pour React Query
        const message = getErrorMessage(error);
        const apiError = new Error(message);
        if (error instanceof ApiError && error.status) {
          (apiError as ApiError).status = error.status;
        }
        throw apiError;
      }
    },
    enabled: enabled && !!name && !!tag && !!region,
    // Cache spécialisé pour les données joueur
    staleTime: 2 * 60 * 1000, // 2 minutes pour les infos joueur
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
  });
}

// =====================================
// MATCH HISTORY QUERIES
// =====================================

export interface UseMatchHistoryQueryOptions {
  puuid: string;
  region: string;
  count?: number;
  start?: number;
  enabled?: boolean;
}

export function useMatchHistoryQuery({
  puuid,
  region,
  count = 20,
  start = 0,
  enabled = true,
}: UseMatchHistoryQueryOptions) {
  return useQuery({
    queryKey: queryKeys.matchHistory(puuid, region, count, start),
    queryFn: async () => {
      const data = await matchService.getMatchHistory(
        puuid,
        region,
        start,
        count
      );
      return data;
    },
    enabled: enabled && !!puuid && !!region,
    // Les matchs changent moins souvent
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
  });
}

// =====================================
// MATCH DETAILS QUERIES
// =====================================

export interface UseMatchQueryOptions {
  matchId: string;
  region: string;
  enabled?: boolean;
}

export function useMatchQuery({
  matchId,
  region,
  enabled = true,
}: UseMatchQueryOptions) {
  return useQuery({
    queryKey: queryKeys.match(matchId, region),
    queryFn: async () => {
      const data = await matchService.getMatchDetails(matchId, region);
      return data;
    },
    enabled: enabled && !!matchId && !!region,
    // Les détails de match ne changent jamais
    staleTime: Infinity, // Never stale
    gcTime: 30 * 60 * 1000, // 30 minutes en cache
  });
}

// =====================================
// INFINITE MATCH HISTORY QUERIES
// =====================================

export interface UseInfiniteMatchHistoryOptions {
  puuid: string;
  region: string;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteMatchHistory({
  puuid,
  region,
  pageSize = 20,
  enabled = true,
}: UseInfiniteMatchHistoryOptions) {
  return useInfiniteQuery({
    queryKey: ["infiniteMatchHistory", { puuid, region, pageSize }],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await matchService.getMatchHistory(
        puuid,
        region,
        pageParam,
        pageSize
      );
      return {
        matches: data,
        nextCursor: data.length === pageSize ? pageParam + pageSize : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && !!puuid && !!region,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
    initialPageParam: 0,
  });
}

// =====================================
// MUTATIONS (pour les actions utilisateur)
// =====================================

export function usePlayerSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      tag,
      region,
    }: {
      name: string;
      tag: string;
      region: string;
    }) => {
      const data = await playerService.getPlayerInfo(name, tag, region);
      return data;
    },
    onSuccess: (data, variables) => {
      // Mise en cache immédiate du résultat
      queryClient.setQueryData(
        queryKeys.player(variables.name, variables.tag, variables.region),
        data
      );
    },
    onError: (error) => {
      console.error("Player search failed:", error);
    },
  });
}

// =====================================
// UTILITY HOOKS
// =====================================

export function useInvalidatePlayerData() {
  const queryClient = useQueryClient();

  return (name: string, tag: string, region: string) => {
    // Invalide toutes les données liées à ce joueur
    queryClient.invalidateQueries({
      queryKey: queryKeys.player(name, tag, region),
    });
  };
}

export function usePrefetchPlayerData() {
  const queryClient = useQueryClient();

  return async (name: string, tag: string, region: string) => {
    // Pré-charge les données d'un joueur (utile pour hover effects)
    await queryClient.prefetchQuery({
      queryKey: queryKeys.player(name, tag, region),
      queryFn: () => playerService.getPlayerInfo(name, tag, region),
      staleTime: 2 * 60 * 1000,
    });
  };
}
