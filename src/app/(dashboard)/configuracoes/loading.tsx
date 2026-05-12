import { Skeleton } from "@/components/ui/skeleton"

export default function ConfiguracoesLoading() {
  return (
    <div className="max-w-xl space-y-10">
      <div className="space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    </div>
  )
}
