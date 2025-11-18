'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/types';
import { Ticket } from 'lucide-react';
import { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export function BookTicketButton({ event }: { event: Event }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const handleBooking = () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be signed in to book a ticket.',
      });
      return;
    }

    setIsLoading(true);
    
    const bookingData = {
      eventId: event.id,
      userId: user.uid,
      bookingDate: new Date().toISOString(),
      qrCode: `tkt-${user.uid.slice(0,4)}-${event.id}`,
    };
    
    const bookingsCol = collection(firestore, 'users', user.uid, 'bookings');
    addDocumentNonBlocking(bookingsCol, bookingData)
      .then(() => {
        toast({
          title: 'Booking Confirmed!',
          description: `Your ticket for ${event.title} has been booked.`,
          variant: 'default',
        });
        router.push('/tickets');
      })
      .catch((error) => {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not book ticket.",
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Button
      size="lg"
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent-foreground"
      onClick={handleBooking}
      disabled={isLoading}
    >
      <Ticket className="mr-2 h-5 w-5" />
      {isLoading ? 'Booking...' : 'Book Your Ticket'}
    </Button>
  );
}
