import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Cover skeleton */}
        <div className="h-64 bg-gray-200 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          {/* Header skeleton */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-gray-300 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Products skeleton */}
          <div className="bg-white rounded-2xl p-8">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
