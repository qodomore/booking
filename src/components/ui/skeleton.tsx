import { cn } from "./utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Service card skeleton
function ServiceCardSkeleton() {
  return (
    <div className="clean-card p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-6 w-12 ml-3" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Slot grid skeleton
function SlotGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

// Calendar day skeleton
function CalendarDaySkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <SlotGridSkeleton count={8} />
    </div>
  );
}

// Master card skeleton
function MasterCardSkeleton() {
  return (
    <div className="clean-card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <SlotGridSkeleton count={6} />
      </div>
    </div>
  );
}

// History item skeleton
function HistoryItemSkeleton() {
  return (
    <div className="clean-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

// Loading states for different screens
function ServiceCatalogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter chips skeleton */}
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-18" />
      </div>
      
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full" />
      
      {/* Service cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function BookingCalendarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Date chips skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Masters with slots skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <MasterCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function ClientHistorySkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter bar skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      {/* History items skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <HistoryItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { 
  Skeleton,
  ServiceCardSkeleton,
  SlotGridSkeleton,
  CalendarDaySkeleton,
  MasterCardSkeleton,
  HistoryItemSkeleton,
  ServiceCatalogSkeleton,
  BookingCalendarSkeleton,
  ClientHistorySkeleton
}