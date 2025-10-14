import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <Card className="flex w-full flex-col pt-0 sm:w-2xs md:aspect-[8/9] md:w-xs xl:w-sm">
      {/* Image placeholder */}
      <div className="relative aspect-[21/9] max-h-48">
        <Skeleton className="absolute inset-0 rounded-t-lg rounded-b-none" />
        {/* Date badge placeholder */}
        <div className="bg-card absolute top-4 right-4 inline-grid size-12 place-items-center rounded-sm py-1.5">
          <Skeleton className="h-4 w-6 rounded-sm" />
          <Skeleton className="h-4 w-8 rounded-sm" />
        </div>
      </div>

      <CardHeader>
        <Skeleton className="mb-2 h-5 w-3/4" /> {/* title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" /> {/* time */}
          <Skeleton className="h-4 w-2/3" /> {/* location */}
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-3/6" />
      </CardContent>

      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md" /> {/* button */}
      </CardFooter>
    </Card>
  );
}
