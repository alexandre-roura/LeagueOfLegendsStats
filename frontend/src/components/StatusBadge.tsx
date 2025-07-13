interface StatusBadgeProps {
  type: "hotStreak" | "veteran" | "freshBlood" | "inactive";
  children: React.ReactNode;
}

export default function StatusBadge({ type, children }: StatusBadgeProps) {
  const getBadgeStyles = (type: string) => {
    const styles = {
      hotStreak: {
        bg: "bg-gradient-to-r from-red-500 to-orange-500",
        text: "text-white",
        border: "border-red-400/50",
        glow: "shadow-red-500/30",
        icon: "🔥",
      },
      veteran: {
        bg: "bg-gradient-to-r from-purple-600 to-indigo-600",
        text: "text-white",
        border: "border-purple-400/50",
        glow: "shadow-purple-500/30",
        icon: "⭐",
      },
      freshBlood: {
        bg: "bg-gradient-to-r from-green-500 to-emerald-500",
        text: "text-white",
        border: "border-green-400/50",
        glow: "shadow-green-500/30",
        icon: "🌱",
      },
      inactive: {
        bg: "bg-gradient-to-r from-gray-600 to-gray-700",
        text: "text-gray-200",
        border: "border-gray-500/50",
        glow: "shadow-gray-500/20",
        icon: "😴",
      },
    };
    return styles[type as keyof typeof styles];
  };

  const badgeStyle = getBadgeStyles(type);

  return (
    <span
      className={`
      inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
      ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${badgeStyle.glow}
      border shadow-lg backdrop-blur-sm
      hover:scale-105 transition-transform duration-200
    `}
    >
      <span className="text-sm">{badgeStyle.icon}</span>
      {children}
    </span>
  );
}
