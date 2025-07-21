import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import type { PlayerData } from "../types/Player";
import RankIcon from "./RankIcon";
import MatchCard from "./MatchCard";
import ErrorFallback from "./ErrorFallback";
import LoadingSpinner from "./LoadingSpinner";
import { useInfiniteMatchHistory } from "../hooks/useQueries";

interface PlayerInfoProps {
  playerData: PlayerData;
  region?: string;
}

export default function PlayerInfo({
  playerData,
  region = "EUW",
}: PlayerInfoProps) {
  const { account, summoner, rankings } = playerData;
  const [activeTab, setActiveTab] = useState(() =>
    rankings.length > 0 ? rankings[0].queueType : "RANKED_SOLO_5x5"
  );

  // Use React Query for match history with infinite loading
  const {
    data: infiniteMatchData,
    isLoading: loadingMatches,
    error: matchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMatchHistory({
    puuid: summoner.puuid,
    region,
    pageSize: 10,
    enabled: !!summoner.puuid && !!region,
  });

  // Flatten all match pages into a single array
  const matchHistory =
    infiniteMatchData?.pages.flatMap((page) => page.matches) || [];

  const getQueueName = (queueType: string) => {
    const queueNames: { [key: string]: string } = {
      RANKED_SOLO_5x5: "Solo/Duo",
      RANKED_FLEX_SR: "Flex",
      RANKED_FLEX_TT: "Flex 3v3",
    };
    return queueNames[queueType] || queueType;
  };

  const getQueueIcon = (queueType: string) => {
    const queueIcons: { [key: string]: string } = {
      RANKED_SOLO_5x5: "⚔️",
      RANKED_FLEX_SR: "👥",
      RANKED_FLEX_TT: "🔺",
    };
    return queueIcons[queueType] || "🎮";
  };

  return (
    <div className="space-y-8">
      {/* Player Header */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Profile Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-lol-gold/20 to-lol-gold/5 border-2 border-lol-gold/30 flex items-center justify-center overflow-hidden">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summoner.profileIconId}.png`}
                alt="Profile Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/96/96";
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-lol-gold text-gray-900 px-2 py-1 rounded-lg text-sm font-bold">
              {summoner.summonerLevel}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-lol-gold to-yellow-400 bg-clip-text text-transparent mb-2">
              {account.gameName}
              <span className="text-gray-400 text-xl">#{account.tagLine}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Level {summoner.summonerLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid - Stats Left, Match History Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Ranked Stats */}
        <div className="lg:col-span-1 space-y-4">
          {rankings.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-sm text-gray-400">
                No ranked games this season
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
              {/* Tab Bar - Compact */}
              <div className="flex border-b border-gray-700/50">
                {rankings.map((ranking) => {
                  const isActive = activeTab === ranking.queueType;
                  return (
                    <button
                      key={ranking.queueType}
                      onClick={() => setActiveTab(ranking.queueType)}
                      className={`flex-1 px-3 py-2 flex items-center justify-center space-x-1 transition-all duration-300 text-sm ${
                        isActive
                          ? "bg-lol-gold/20 text-lol-gold border-b-2 border-lol-gold"
                          : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                      }`}
                    >
                      <span className="text-sm">
                        {getQueueIcon(ranking.queueType)}
                      </span>
                      <span className="font-medium hidden sm:inline">
                        {getQueueName(ranking.queueType)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content - Condensed */}
              {(() => {
                const currentRanking = rankings.find(
                  (r) => r.queueType === activeTab
                );
                if (!currentRanking) return null;

                return (
                  <div className="p-4">
                    {/* Rank Display */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {currentRanking.tier} {currentRanking.rank}
                        </h4>
                        <p className="text-sm text-lol-gold">
                          {currentRanking.leaguePoints} LP
                        </p>
                      </div>
                      <RankIcon
                        tier={currentRanking.tier}
                        rank={currentRanking.rank}
                        size="sm"
                      />
                    </div>

                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                        <div className="text-green-400 font-bold text-lg">
                          {currentRanking.wins}
                        </div>
                        <div className="text-xs text-gray-400">Wins</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                        <div className="text-red-400 font-bold text-lg">
                          {currentRanking.losses}
                        </div>
                        <div className="text-xs text-gray-400">Losses</div>
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="bg-gray-700/30 rounded-lg p-3 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Win Rate</span>
                        <span className="text-white font-bold">
                          {(
                            (currentRanking.wins /
                              (currentRanking.wins + currentRanking.losses)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Status Badges - Compact */}
                    {(currentRanking.hotStreak ||
                      currentRanking.veteran ||
                      currentRanking.freshBlood ||
                      currentRanking.inactive) && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {currentRanking.hotStreak && (
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md">
                            🔥 Hot
                          </span>
                        )}
                        {currentRanking.veteran && (
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-md">
                            ⭐ Vet
                          </span>
                        )}
                        {currentRanking.freshBlood && (
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md">
                            🌱 New
                          </span>
                        )}
                        {currentRanking.inactive && (
                          <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-md">
                            💤 Inactive
                          </span>
                        )}
                      </div>
                    )}

                    {/* Promotion Series - Compact */}
                    {currentRanking.miniSeries && (
                      <div className="bg-gradient-to-r from-lol-gold/20 to-yellow-500/20 rounded-lg p-3 border border-lol-gold/30">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-lol-gold font-bold">
                            🚀 Promos
                          </span>
                          <span className="text-white">
                            {currentRanking.miniSeries.progress}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right Column - Match History */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-lg font-bold bg-gradient-to-r from-lol-gold to-yellow-400 bg-clip-text text-transparent mb-4">
              Match History
            </h3>

            {loadingMatches ? (
              <LoadingSpinner size="md" text="Loading match history..." />
            ) : matchError ? (
              <ErrorFallback
                error={
                  matchError instanceof Error
                    ? matchError
                    : new Error(String(matchError))
                }
                resetErrorBoundary={() => window.location.reload()}
              />
            ) : matchHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <div className="text-4xl mb-4">📜</div>
                <p>No match history found</p>
              </motion.div>
            ) : (
              // Simple list that grows naturally - no virtual scrolling or height limits
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {matchHistory.map((matchId, index) => (
                    <motion.div
                      key={matchId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <ErrorBoundary
                        FallbackComponent={({ resetErrorBoundary }) => (
                          <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                            <p className="text-yellow-400 text-sm">
                              Failed to load match {matchId}
                            </p>
                            <button
                              onClick={resetErrorBoundary}
                              className="mt-2 text-xs text-yellow-300 hover:text-yellow-200 underline"
                            >
                              Try again
                            </button>
                          </div>
                        )}
                      >
                        <MatchCard
                          matchId={matchId}
                          currentPlayerPuuid={summoner.puuid}
                          region={region}
                        />
                      </ErrorBoundary>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="bg-lol-gold hover:bg-lol-gold/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Matches</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
