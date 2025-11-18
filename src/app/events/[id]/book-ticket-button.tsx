'use client';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { Ticket } from 'lucide-react';
import { useState } from 'react';
import { PaymentDialog } from '@/components/payment-dialog';

export function BookTicketButton({ event }: { event: Event }) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent-foreground"
        onClick={() => setIsPaymentDialogOpen(true)}
      >
        <Ticket className="mr-2 h-5 w-5" />
        {event.price > 0 ? 'Book Your Ticket' : 'Register for Free'}
      </Button>
      <PaymentDialog
        event={event}
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />
    </>
  );
}
