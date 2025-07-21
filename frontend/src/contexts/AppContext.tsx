import { createContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { PlayerData } from "../types/Player";

// State interface
interface AppState {
  playerData: PlayerData | null;
  loading: boolean;
  error: string | null;
  lastSearch: {
    summonerName: string;
    tagLine: string;
    region: string;
  } | null;
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PLAYER_DATA"; payload: PlayerData | null }
  | { type: "SET_LAST_SEARCH"; payload: AppState["lastSearch"] }
  | { type: "RESET_STATE" };

// Initial state
const initialState: AppState = {
  playerData: null,
  loading: false,
  error: null,
  lastSearch: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PLAYER_DATA":
      return { ...state, playerData: action.payload };
    case "SET_LAST_SEARCH":
      return { ...state, lastSearch: action.payload };
    case "RESET_STATE":
      return { ...state, playerData: null, error: null };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Export context for external use
export { AppContext };
