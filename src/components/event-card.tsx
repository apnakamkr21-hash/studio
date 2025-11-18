import Link from 'next/link';
import Image from 'next/image';
import type { Event } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function EventCard({ event }: { event: Event }) {
  const image = event.imageUrl ? { imageUrl: event.imageUrl, imageHint: 'event image' } : PlaceHolderImages['event-music-concert'];
  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={image.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
             <div className="absolute bottom-2 right-2 rounded-md bg-accent px-2 py-1 text-sm font-bold text-accent-foreground">
              {event.price > 0 ? formatCurrency(event.price) : 'Free'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 p-4">
          <CardTitle className="font-headline text-xl leading-tight">
            {event.title}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 shrink-0" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            <span>{event.venue}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-primary/90 hover:bg-primary"
            variant="default"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
