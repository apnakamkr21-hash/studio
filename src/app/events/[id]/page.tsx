import { events } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BookTicketButton } from './book-ticket-button';
import { formatCurrency } from '@/lib/utils';

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={event.image.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            data-ai-hint={event.image.imageHint}
            priority
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute bottom-0 left-0 p-6 md:p-8">
             <h1 className="text-4xl lg:text-5xl font-bold font-headline text-white shadow-lg">{event.name}</h1>
           </div>
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {event.description}
              </p>
              <div className="prose max-w-none text-foreground prose-p:mb-4">
                <p>{event.longDescription}</p>
              </div>
            </div>
            <div className="space-y-6 md:pt-10">
              <div className="bg-primary/5 rounded-lg p-4 space-y-4 border border-primary/10">
                <h3 className="font-bold font-headline text-xl text-primary">
                  Event Details
                </h3>
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
                    <p className="text-sm text-muted-foreground">
                      Campus Grounds
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">{event.committee}</p>
                    <p className="text-sm text-muted-foreground">
                      Organizing Committee
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {event.price > 0 ? formatCurrency(event.price) : 'Free'}
                    </p>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                  </div>
                </div>
              </div>
              <BookTicketButton event={event} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
