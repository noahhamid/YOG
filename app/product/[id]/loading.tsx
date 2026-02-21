export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="h-4 bg-gray-200 rounded w-32" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-16" />
            </div>

            {/* Price */}
            <div className="h-12 bg-gray-200 rounded w-48" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 w-12 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-12 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <div className="h-14 bg-gray-200 rounded-full" />
              <div className="h-14 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-20">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
