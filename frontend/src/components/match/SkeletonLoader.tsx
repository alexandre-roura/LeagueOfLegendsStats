export default function SkeletonLoader() {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Skeleton Header */}
      <div className="bg-gray-800/40 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-3 bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-6 bg-gray-600 rounded animate-pulse"></div>
      </div>

      {/* Skeleton Content */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Champion Avatar Skeleton */}
          <div className="w-16 h-16 bg-gray-600 rounded-lg animate-pulse relative">
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-500 rounded-full"></div>
          </div>

          {/* KDA Skeleton */}
          <div className="text-center min-w-[80px] space-y-2">
            <div className="w-20 h-5 bg-gray-600 rounded animate-pulse mx-auto"></div>
            <div className="w-16 h-4 bg-gray-600 rounded animate-pulse mx-auto"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="text-center min-w-[80px] space-y-2">
            <div className="w-24 h-4 bg-gray-600 rounded animate-pulse mx-auto"></div>
            <div className="w-16 h-3 bg-gray-600 rounded animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Players List Skeleton - Arena mode with placements */}
        <div className="flex items-center space-x-2 mx-4">
          <div className="flex flex-col space-y-1">
            {Array.from({ length: 4 }).map((_, teamIndex) => (
              <div key={teamIndex} className="flex items-center space-x-2">
                {/* Placement skeleton */}
                <div className="w-6 h-4 bg-gray-600 rounded animate-pulse"></div>

                {/* Two players skeleton */}
                <div className="flex space-x-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="w-5 h-2 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="w-5 h-2 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Skeleton */}
        <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
