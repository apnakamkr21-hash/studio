'use client';
import { useState, useEffect } from 'react';
import {
  getPersonalizedEventRecommendations,
  type PersonalizedEventRecommendationsOutput,
} from '@/ai/flows/personalized-event-recommendations';
import type { Event } from '@/lib/types';
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

export default function EventRecommendations({ allEvents }: { allEvents: Event[] }) {
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      setLoading(false);
      return;
    }
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const allEventNames = allEvents.map(event => event.title);
        const input = {
          studentId: 'student123',
          interests: ['music', 'technology', 'art'],
          pastActivity: ['Tech Conference 2023', 'Art in Bloom Exhibition'],
          allEvents: allEventNames,
        };

        const result: PersonalizedEventRecommendationsOutput =
          await getPersonalizedEventRecommendations(input);
        const recommendedEvents = allEvents.filter(event =>
          result.recommendedEvents.includes(event.title)
        );
        setRecommendations(recommendedEvents);
      } catch (error) {
        console.error('Failed to get recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [allEvents]);

  if (loading) {
    return <RecommendationSkeleton />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-headline font-bold mb-6">For You</h2>
      <Carousel opts={{ align: 'start' }} className="w-full">
        <CarouselContent className="-ml-2">
          {recommendations.map(event => (
            <CarouselItem
              key={event.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <EventCard event={event} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14" />
        <CarouselNext className="mr-14" />
      </Carousel>
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
