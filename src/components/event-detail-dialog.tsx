'use client';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, MapPin, IndianRupee, Users } from 'lucide-react';
import type { Event } from '@/lib/types';
import { BookTicketButton } from '@/app/events/[id]/book-ticket-button';
import { formatCurrency } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
}: EventDetailDialogProps) {
  if (!event) {
    return null;
  }

  const image = event.imageUrl
    ? { imageUrl: event.imageUrl, imageHint: 'event image' }
    : PlaceHolderImages['event-music-concert'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-full w-full">
            <Image
              src={image.imageUrl}
              alt={event.title}
              fill
              className="object-cover rounded-l-lg"
              data-ai-hint={image.imageHint}
            />
          </div>
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-headline text-3xl">
                {event.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex-1">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">
                    {new Date(event.date).toDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">{event.committeeId}</p>
                  <p className="text-sm text-muted-foreground">
                    Organizing Committee
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <IndianRupee className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">
                    {event.price > 0 ? formatCurrency(event.price) : 'Free'}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                {event.description}
              </p>
            </div>
            <div className="mt-6">
              <BookTicketButton event={event} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
