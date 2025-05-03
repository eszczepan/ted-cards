import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLoaderProps = {
  count?: number;
  height?: number | string;
  className?: string;
  width?: number | string;
};

export function SkeletonLoader({ count = 3, height = 80, width = "100%", className }: SkeletonLoaderProps) {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className={cn(
            "rounded-lg",
            typeof height === "number" ? `h-[${height}px]` : `h-${height}`,
            typeof width === "number" ? `w-[${width}px]` : `w-${width}`,
            className,
          )}
        />
      ))}
    </div>
  );
}
