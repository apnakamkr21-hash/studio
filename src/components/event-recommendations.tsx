'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  getPersonalizedEventRecommendations,
  type PersonalizedEventRecommendationsOutput,
} from '@/ai/flows/personalized-event-recommendations';
import type { Event, Booking } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EventCard } from './event-card';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import { EventDetailDialog } from './event-detail-dialog';

export default function EventRecommendations({
  allEvents,
}: {
  allEvents: Event[];
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const bookingsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'bookings')
        : null,
    [user, firestore]
  );
  const { data: bookings } = useCollection<Booking>(bookingsQuery);

  const fetchRecommendations = useCallback(async () => {
    if (!allEvents || allEvents.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const allEventTitles = allEvents.map(event => event.title);

      let pastActivityTitles: string[] = [];
      if (bookings && bookings.length > 0) {
        pastActivityTitles = allEvents
          .filter(event => bookings.some(b => b.eventId === event.id))
          .map(event => event.title);
      } else {
        // For new/anonymous users, use a few popular events as a baseline
        pastActivityTitles = allEvents
          .slice(0, 2)
          .map(event => event.title);
      }
      
      const userInterests = user?.isAnonymous ? ['music', 'art'] : ['technology', 'workshops', 'music'];

      const input = {
        studentId: user?.uid || 'anonymous_user',
        interests: userInterests,
        pastActivity: pastActivityTitles,
        allEvents: allEventTitles,
      };

      const result: PersonalizedEventRecommendationsOutput =
        await getPersonalizedEventRecommendations(input);
        
      const recommendedEvents = allEvents.filter(event =>
        result.recommendedEvents.includes(event.title)
      );
      setRecommendations(recommendedEvents);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // Fallback: show the 3 most recent events
      setRecommendations(allEvents.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, [allEvents, bookings, user]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);
  
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };

  if (loading) {
    return <RecommendationSkeleton />;
  }

  if (recommendations.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <section>
      <h2 className="text-2xl font-headline font-bold mb-6">For You</h2>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recommendations.map(event => (
            <CarouselItem
              key={event.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full p-1">
                <EventCard
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14" />
        <CarouselNext className="mr-14" />
      </Carousel>
       <EventDetailDialog
        event={selectedEvent}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </section>
  );
}

const RecommendationSkeleton = () => (
  <section>
    <h2 className="text-2xl font-headline font-bold mb-6">For You</h2>
    <div className="relative">
      <div className="flex space-x-6 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full sm:w-1/2 lg:w-1/3 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
);
