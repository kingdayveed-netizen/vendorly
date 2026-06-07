export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="flex gap-4 mt-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
