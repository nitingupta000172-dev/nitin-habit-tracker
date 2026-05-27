export function SkeletonLine({ className = '' }) {
  return (
    <div className={`bg-bg-elevated rounded-lg animate-pulse ${className}`} />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-4 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className={`h-4 ${i === 0 ? 'w-1/3' : i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
      ))}
    </div>
  );
}

export function HabitSkeleton() {
  return (
    <div className="space-y-2 px-4">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex items-center gap-3 py-3">
          <div className="w-6 h-6 rounded-full bg-bg-elevated animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonLine className={`h-3.5 ${i % 2 ? 'w-3/4' : 'w-1/2'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
