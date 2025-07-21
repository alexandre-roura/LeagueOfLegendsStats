import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SummonerPage from "./pages/SummonerPage";
import ChampionsPage from "./pages/ChampionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorFallback from "./components/ErrorFallback";
import { AppProvider } from "./contexts/AppContext";

// Main App component with routing
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Router>
            <Routes>
              {/* Home page route - no layout wrapper for centered design */}
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />

              {/* Summoner profile route */}
              <Route
                path="/summoners/:region/:nameTag/overview"
                element={
                  <Layout>
                    <SummonerPage />
                  </Layout>
                }
              />

              {/* Champions page */}
              <Route
                path="/champions"
                element={
                  <Layout>
                    <ChampionsPage />
                  </Layout>
                }
              />

              {/* Leaderboards page */}
              <Route
                path="/leaderboards"
                element={
                  <Layout>
                    <LeaderboardsPage />
                  </Layout>
                }
              />

              {/* 404 page */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFoundPage />
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </AppProvider>

        {/* React Query DevTools - seulement en développement */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
