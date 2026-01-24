function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Image thumbnail skeleton */}
      <div className="h-16 w-24 shrink-0 animate-pulse rounded-md bg-muted" />

      {/* Event info skeleton */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Action button skeleton */}
      <div className="h-8 w-8 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function EventsTableSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="divide-y">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
