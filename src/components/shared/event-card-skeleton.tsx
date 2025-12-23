import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <Card className="flex w-full flex-col pt-0 sm:w-2xs md:aspect-[1] md:w-xs xl:aspect-auto xl:w-sm 2xl:w-md">
      {/* Image placeholder */}
      <div className="relative aspect-[21/9] max-h-48">
        <Skeleton className="absolute inset-0 rounded-t-lg rounded-b-none" />
        {/* Date badge placeholder */}
        <div className="bg-card absolute top-4 right-4 inline-grid size-12 place-items-center rounded-sm py-1.5">
          <Skeleton className="h-4 w-6 rounded-sm" />
          <Skeleton className="h-[0.875rem] w-8 rounded-sm" />
        </div>
      </div>
      <div className="flex-grow">
        <CardHeader>
          <Skeleton className="h-5 w-3/4" /> {/* title */}
          <div className="space-y-0.5">
            <Skeleton className="h-[0.875rem] w-1/2" /> {/* time */}
            <Skeleton className="h-[0.875rem] w-2/3" /> {/* location */}
          </div>
        </CardHeader>
      </div>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md" /> {/* button */}
      </CardFooter>
    </Card>
  );
}
