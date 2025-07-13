interface RankIconProps {
  tier: string;
  rank: string;
  size?: "sm" | "md" | "lg";
}

export default function RankIcon({ tier, rank, size = "md" }: RankIconProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-24 h-24 text-lg",
  };

  const getTierGradient = (tier: string) => {
    const gradients: { [key: string]: string } = {
      IRON: "from-gray-600 to-gray-800",
      BRONZE: "from-lol-bronze to-amber-800",
      SILVER: "from-lol-silver to-gray-500",
      GOLD: "from-lol-gold to-yellow-600",
      PLATINUM: "from-lol-platinum to-teal-400",
      EMERALD: "from-emerald-400 to-emerald-600",
      DIAMOND: "from-lol-diamond to-blue-400",
      MASTER: "from-lol-master to-purple-600",
      GRANDMASTER: "from-lol-grandmaster to-red-600",
      CHALLENGER: "from-lol-challenger to-yellow-500",
    };
    return gradients[tier] || "from-gray-400 to-gray-600";
  };

  const getTierShadow = (tier: string) => {
    const shadows: { [key: string]: string } = {
      IRON: "shadow-gray-500/30",
      BRONZE: "shadow-lol-bronze/30",
      SILVER: "shadow-lol-silver/30",
      GOLD: "shadow-lol-gold/50",
      PLATINUM: "shadow-teal-400/30",
      EMERALD: "shadow-emerald-400/30",
      DIAMOND: "shadow-blue-400/30",
      MASTER: "shadow-purple-500/30",
      GRANDMASTER: "shadow-red-500/40",
      CHALLENGER: "shadow-yellow-400/50",
    };
    return shadows[tier] || "shadow-gray-400/30";
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br ${getTierGradient(tier)} 
        rounded-full 
        ${getTierShadow(tier)} 
        shadow-lg 
        flex 
        flex-col 
        items-center 
        justify-center 
        border-2 
        border-white/20 
        relative 
        overflow-hidden
        group
        hover:scale-110
        transition-all
        duration-300
      `}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Tier text */}
      <div
        className={`font-bold text-white drop-shadow-lg ${
          size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs"
        }`}
      >
        {tier.slice(0, 3)}
      </div>

      {/* Rank text */}
      <div
        className={`font-semibold text-white/90 ${
          size === "lg" ? "text-sm" : "text-xs"
        }`}
      >
        {rank}
      </div>
    </div>
  );
}
