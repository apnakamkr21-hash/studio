import { EventCard } from '@/components/event-card';
import { events } from '@/lib/data';
import EventRecommendations from '@/components/event-recommendations';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
          Find Your Next Experience
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          AI-powered recommendations and a full list of campus happenings.
        </p>
      </div>

      <Suspense fallback={<RecommendationSkeleton />}>
        <EventRecommendations />
      </Suspense>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-6">All Events</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

const RecommendationSkeleton = () => (
  <section>
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/container" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);
