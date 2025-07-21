import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SummonerPage from "./pages/SummonerPage";
import ChampionsPage from "./pages/ChampionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./contexts/AppContext";

// Main App component with routing
function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
