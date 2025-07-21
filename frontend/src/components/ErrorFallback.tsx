import { motion } from "framer-motion";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-lol-gradient p-4"
    >
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 text-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-6"
        >
          ⚠️
        </motion.div>

        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-300 mb-6">
          An unexpected error occurred while loading the application.
        </p>

        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-red-300 bg-gray-800/50 p-3 rounded-lg overflow-auto">
            {error.message}
          </pre>
        </details>

        <div className="space-y-3">
          <Button
            color="warning"
            variant="solid"
            onPress={resetErrorBoundary}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            color="default"
            variant="light"
            onPress={() => (window.location.href = "/")}
            className="w-full"
          >
            Go Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
