
const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 animate-pulse ${className}`}
          />
        ))}
    </>
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 md:h-56 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  </div>
);

export const LoadingSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

export default Skeleton;
