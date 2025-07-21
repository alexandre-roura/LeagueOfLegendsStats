import { motion } from "framer-motion";
import clsx from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 space-y-4"
    >
      {/* Outer ring with Framer Motion */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={clsx(
            sizeClasses[size],
            "border-4 border-gray-700 rounded-full"
          )}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-transparent border-t-lol-gold rounded-full"
          />
        </motion.div>

        {/* Inner ring with counter-rotation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={clsx(
            "absolute inset-2 border-2 border-transparent border-b-lol-gold rounded-full",
            size === "sm" && "inset-1 border-1",
            size === "lg" && "inset-3 border-3"
          )}
        />

        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-lol-gold rounded-full" />
        </motion.div>
      </div>

      {/* Loading text with breathing animation */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-center"
      >
        <p className="text-lol-gold font-semibold">{text}</p>
        <p className="text-gray-400 text-sm mt-1">
          Summoning data from the Rift...
        </p>
      </motion.div>
    </motion.div>
  );
}
