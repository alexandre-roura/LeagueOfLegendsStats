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
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {/* Outer ring */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-700 rounded-full animate-spin`}
        >
          <div
            className="absolute inset-0 border-4 border-transparent border-t-lol-gold rounded-full animate-spin"
            style={{ animationDuration: "1s" }}
          ></div>
        </div>

        {/* Inner ring */}
        <div
          className={`absolute inset-2 border-2 border-gray-600 rounded-full animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        >
          <div
            className="absolute inset-0 border-2 border-transparent border-r-lol-gold/70 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-lol-gold font-semibold animate-pulse">{text}</p>
        <p className="text-gray-400 text-sm mt-1">
          Summoning data from the Rift...
        </p>
      </div>
    </div>
  );
}
