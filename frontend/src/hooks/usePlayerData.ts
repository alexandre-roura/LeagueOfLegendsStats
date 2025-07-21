import { useCallback } from "react";
import { useAppContext, actions } from "./useAppContext";
import { playerService, getErrorMessage } from "../services/api";

export function usePlayerData() {
  const { state, dispatch } = useAppContext();

  const searchPlayer = useCallback(
    async (summonerName: string, tagLine: string, region: string) => {
      dispatch(actions.setLoading(true));
      dispatch(actions.setError(null));
      dispatch(actions.resetState());
      dispatch(actions.setLastSearch({ summonerName, tagLine, region }));

      try {
        const playerData = await playerService.getPlayerInfo(
          summonerName,
          tagLine,
          region
        );
        dispatch(actions.setPlayerData(playerData));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        dispatch(actions.setError(errorMessage));
      } finally {
        dispatch(actions.setLoading(false));
      }
    },
    [dispatch]
  );

  const retryLastSearch = useCallback(() => {
    if (state.lastSearch) {
      const { summonerName, tagLine, region } = state.lastSearch;
      searchPlayer(summonerName, tagLine, region);
    }
  }, [state.lastSearch, searchPlayer]);

  const clearError = useCallback(() => {
    dispatch(actions.setError(null));
  }, [dispatch]);

  return {
    playerData: state.playerData,
    loading: state.loading,
    error: state.error,
    lastSearch: state.lastSearch,
    searchPlayer,
    retryLastSearch,
    clearError,
  };
}
