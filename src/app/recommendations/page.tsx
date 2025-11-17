import EventRecommendations from '@/components/event-recommendations';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
          Events For You
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Personalized recommendations based on your interests and activity.
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <EventRecommendations />
      </Suspense>
    </div>
  );
}

const PageSkeleton = () => (
  <section>
    <div className="relative">
      <div className="flex space-x-6 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full sm:w-1/2 lg:w-1/3 shrink-0">
            <Skeleton className="h-96 w-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
