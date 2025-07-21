import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  description?: string;
  delay?: number;
}

export default function StatCard({
  icon,
  label,
  value,
  color = "text-lol-gold",
  description,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-lol-gold/30 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            "p-2 rounded-lg bg-gradient-to-br from-lol-gold/20 to-lol-gold/10",
            color.replace("text-", "text-")
          )}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.3 }}
            className={clsx(
              "text-xl font-bold group-hover:text-lol-gold transition-colors duration-300",
              color
            )}
          >
            {value}
          </motion.p>
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.3 }}
              className="text-gray-500 text-xs mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-lol-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        whileHover={{ scale: 1.02 }}
      />
    </motion.div>
  );
}
