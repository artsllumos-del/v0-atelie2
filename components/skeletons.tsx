'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-end pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-10" />
      </div>
    </Card>
  )
}

export function OrderTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 border rounded-lg p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Card className="p-4 space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </Card>

      {/* Table */}
      <Card className="p-4">
        <Skeleton className="h-4 w-1/4 mb-4" />
        <OrderTableSkeleton rows={8} />
      </Card>
    </div>
  )
}
