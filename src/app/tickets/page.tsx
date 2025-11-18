'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Calendar, MapPin, TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import type { Booking, Event } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'bookings')
        : null,
    [user, firestore]
  );
  
  const { data: bookings, isLoading } = useCollection<Omit<Booking, 'id'>>(bookingsQuery);
  const [enrichedBookings, setEnrichedBookings] = useState<Booking[]>([]);
  const [isEnriching, setIsEnriching] = useState(true);

  useEffect(() => {
    const enrichBookings = async () => {
      if (bookings && firestore) {
        setIsEnriching(true);
        const enriched = await Promise.all(
          bookings.map(async (booking) => {
            const eventRef = doc(firestore, 'events', booking.eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              return { ...booking, event: { id: eventSnap.id, ...eventSnap.data() } as Event };
            }
            return booking;
          })
        );
        setEnrichedBookings(enriched);
        setIsEnriching(false);
      }
    };
    enrichBookings();
  }, [bookings, firestore]);

  const finalIsLoading = isLoading || isEnriching;

  if (finalIsLoading) {
    return <TicketsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
        My Tickets
      </h1>

      {!finalIsLoading && enrichedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No tickets yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven't booked any tickets. Explore events to get started.
          </p>
          <Button asChild>
            <Link href="/">Explore Events</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrichedBookings.map(ticket => {
            if (!ticket.event) return null;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`;

            return (
              <Card
                key={ticket.id}
                className="flex flex-col md:flex-row overflow-hidden shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="p-6 flex flex-col justify-center items-center bg-muted/50 border-b md:border-b-0 md:border-r">
                  <div className="rounded-lg overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      width={150}
                      height={150}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan at entry
                  </p>
                </div>
                <div className="flex-1 p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="font-headline text-2xl">
                      {ticket.event.title}
                    </CardTitle>
                    <CardDescription>
                      {ticket.event.committeeId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 shrink-0" />
                      <span>
                        {new Date(ticket.event.date).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 shrink-0" />
                      <span>{ticket.event.venue}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


const TicketsSkeleton = () => (
  <div className="space-y-8">
    <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
      My Tickets
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="flex flex-col md:flex-row overflow-hidden shadow-md">
          <div className="p-6 flex justify-center items-center bg-muted/50">
            <Skeleton className="h-[150px] w-[150px]" />
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
