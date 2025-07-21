import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import type { PlayerData } from "../types/Player";

// Action types (re-export for convenience)
export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PLAYER_DATA"; payload: PlayerData | null }
  | {
      type: "SET_LAST_SEARCH";
      payload: { summonerName: string; tagLine: string; region: string } | null;
    }
  | { type: "RESET_STATE" };

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Action creators
export const actions = {
  setLoading: (loading: boolean): AppAction => ({
    type: "SET_LOADING",
    payload: loading,
  }),
  setError: (error: string | null): AppAction => ({
    type: "SET_ERROR",
    payload: error,
  }),
  setPlayerData: (data: PlayerData | null): AppAction => ({
    type: "SET_PLAYER_DATA",
    payload: data,
  }),
  setLastSearch: (
    search: { summonerName: string; tagLine: string; region: string } | null
  ): AppAction => ({
    type: "SET_LAST_SEARCH",
    payload: search,
  }),
  resetState: (): AppAction => ({ type: "RESET_STATE" }),
};
