import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  description?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  color = "text-lol-gold",
  description,
}: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-lol-gold/30 transition-all duration-300 group hover:scale-105">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg bg-gradient-to-br from-lol-gold/20 to-lol-gold/10 ${color.replace(
            "text-",
            "text-"
          )}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p
            className={`text-xl font-bold ${color} group-hover:text-lol-gold transition-colors duration-300`}
          >
            {value}
          </p>
          {description && (
            <p className="text-gray-500 text-xs mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
