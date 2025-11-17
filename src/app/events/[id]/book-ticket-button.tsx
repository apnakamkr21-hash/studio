'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/types';
import { Ticket } from 'lucide-react';
import { useState } from 'react';

export function BookTicketButton({ event }: { event: Event }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Booking Confirmed!',
        description: `Your ticket for ${event.name} has been booked.`,
        variant: 'default',
      });
      setIsLoading(false);
      router.push('/tickets');
    }, 1000);
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
