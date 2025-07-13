interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
      <div className="bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-lg rounded-2xl p-6 border border-red-500/50 shadow-xl">
        <div className="flex items-start space-x-4">
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          
          {/* Error Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-200 mb-2">
              Summoner Not Found
            </h3>
            <p className="text-red-300 mb-4">{message}</p>
            
            <div className="space-y-2 text-sm text-red-200/80">
              <p>• Make sure the summoner name is spelled correctly</p>
              <p>• Verify the tag line matches the region</p>
              <p>• The account might be inactive or renamed</p>
            </div>

            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
