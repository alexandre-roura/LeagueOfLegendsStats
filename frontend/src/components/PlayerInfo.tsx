import type { PlayerData } from "../types/Player";
import RankIcon from "./RankIcon";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

interface PlayerInfoProps {
  playerData: PlayerData;
}

export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const { account, summoner, rankings } = playerData;

  const getTierColor = (tier: string) => {
    const colors: { [key: string]: string } = {
      IRON: "text-gray-400",
      BRONZE: "text-lol-bronze",
      SILVER: "text-lol-silver",
      GOLD: "text-lol-gold",
      PLATINUM: "text-lol-platinum",
      EMERALD: "text-emerald-400",
      DIAMOND: "text-lol-diamond",
      MASTER: "text-lol-master",
      GRANDMASTER: "text-lol-grandmaster",
      CHALLENGER: "text-lol-challenger",
    };
    return colors[tier] || "text-white";
  };

  const getQueueName = (queueType: string) => {
    const queueNames: { [key: string]: string } = {
      RANKED_SOLO_5x5: "Ranked Solo/Duo",
      RANKED_FLEX_SR: "Ranked Flex",
      RANKED_FLEX_TT: "Ranked Flex 3v3",
    };
    return queueNames[queueType] || queueType;
  };

  const getQueueIcon = (queueType: string) => {
    const icons: { [key: string]: string } = {
      RANKED_SOLO_5x5: "👤",
      RANKED_FLEX_SR: "👥",
      RANKED_FLEX_TT: "🏆",
    };
    return icons[queueType] || "🎮";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Player Header */}
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-lol-gold/10 transition-all duration-500 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-lol-gold/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-lol-gold/5 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Icon */}
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-lol-gold to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-lol-gold/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-lol-dark">
                  {summoner.profileIconId}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-lol-gold text-lol-dark px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                {summoner.summonerLevel}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {account.gameName}
              </h2>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <span className="text-lol-gold font-semibold">
                  #{account.tagLine}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">
                  Level {summoner.summonerLevel}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard
                  icon={<span className="text-lg">🏆</span>}
                  label="Ranked Queues"
                  value={rankings.length}
                  color="text-lol-gold"
                />
                <StatCard
                  icon={<span className="text-lg">⭐</span>}
                  label="Profile Icon"
                  value={summoner.profileIconId}
                  color="text-blue-400"
                />
                <StatCard
                  icon={<span className="text-lg">📊</span>}
                  label="Total Wins"
                  value={rankings.reduce((acc, r) => acc + r.wins, 0)}
                  color="text-green-400"
                />
                <StatCard
                  icon={<span className="text-lg">📉</span>}
                  label="Total Losses"
                  value={rankings.reduce((acc, r) => acc + r.losses, 0)}
                  color="text-red-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-lol-gold to-yellow-400 bg-clip-text text-transparent">
            Ranked Statistics
          </h3>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-lol-gold/50 to-transparent"></div>
        </div>

        {rankings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h4 className="text-xl font-semibold text-gray-300 mb-2">
              No Ranked Games
            </h4>
            <p className="text-gray-400">
              This summoner hasn't played any ranked games this season.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {rankings.map((ranking, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-lol-gold/10 transition-all duration-500 animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Queue Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getQueueIcon(ranking.queueType)}
                    </span>
                    <h4 className="text-lg font-semibold text-white">
                      {getQueueName(ranking.queueType)}
                    </h4>
                  </div>
                  <RankIcon tier={ranking.tier} rank={ranking.rank} size="md" />
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <StatCard
                    icon={<span className="text-lg">🏅</span>}
                    label="Rank"
                    value={`${ranking.tier} ${ranking.rank}`}
                    color={getTierColor(ranking.tier)}
                  />
                  <StatCard
                    icon={<span className="text-lg">💎</span>}
                    label="LP"
                    value={ranking.leaguePoints}
                    color="text-lol-gold"
                  />
                  <StatCard
                    icon={<span className="text-lg">✅</span>}
                    label="Wins"
                    value={ranking.wins}
                    color="text-green-400"
                  />
                  <StatCard
                    icon={<span className="text-lg">❌</span>}
                    label="Losses"
                    value={ranking.losses}
                    color="text-red-400"
                  />
                </div>

                {/* Win Rate Circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-20 h-20">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${Math.round(
                          (ranking.wins / (ranking.wins + ranking.losses)) *
                            251.32
                        )} 251.32`}
                        className="text-lol-gold transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {Math.round(
                          (ranking.wins / (ranking.wins + ranking.losses)) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                {(ranking.hotStreak ||
                  ranking.veteran ||
                  ranking.freshBlood ||
                  ranking.inactive) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ranking.hotStreak && (
                      <StatusBadge type="hotStreak">Hot Streak</StatusBadge>
                    )}
                    {ranking.veteran && (
                      <StatusBadge type="veteran">Veteran</StatusBadge>
                    )}
                    {ranking.freshBlood && (
                      <StatusBadge type="freshBlood">Fresh Blood</StatusBadge>
                    )}
                    {ranking.inactive && (
                      <StatusBadge type="inactive">Inactive</StatusBadge>
                    )}
                  </div>
                )}

                {/* Promotion Series */}
                {ranking.miniSeries && (
                  <div className="bg-gradient-to-r from-lol-gold/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-lol-gold/30">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">🚀</span>
                      <span className="text-lol-gold font-bold">
                        Promotion Series
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Progress</p>
                        <p className="text-lg font-bold text-white">
                          {ranking.miniSeries.progress}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Target</p>
                        <p className="text-lg font-bold text-lol-gold">
                          {ranking.miniSeries.target}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4 mt-2">
                      <span className="text-green-400">
                        W: {ranking.miniSeries.wins}
                      </span>
                      <span className="text-red-400">
                        L: {ranking.miniSeries.losses}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
