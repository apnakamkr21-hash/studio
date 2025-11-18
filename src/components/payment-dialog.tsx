'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Event } from '@/lib/types';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Copy, CreditCard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface PaymentDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UPI_ID = 'harshadshewale213@okhdfcbank';

export function PaymentDialog({
  event,
  open,
  onOpenChange,
}: PaymentDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Campus%20Events%20Hub&am=${event.price}&cu=INR&tn=Ticket%20for%20${encodeURIComponent(event.title)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleBookingConfirmation = () => {
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
      qrCode: `tkt-${user.uid.slice(0, 4)}-${event.id.slice(0, 4)}`,
    };

    const bookingsCol = collection(firestore, 'users', user.uid, 'bookings');
    addDocumentNonBlocking(bookingsCol, bookingData)
      .then(() => {
        toast({
          title: 'Booking Confirmed!',
          description: `Your ticket for ${event.title} has been booked.`,
        });
        onOpenChange(false);
        router.push('/booking-success');
      })
      .catch(error => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Could not book ticket. Please try again.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({
      title: 'Copied to clipboard!',
      description: 'UPI ID has been copied.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Complete Your Payment
          </DialogTitle>
          <DialogDescription>
            Pay{' '}
            <span className="font-bold text-foreground">
              {formatCurrency(event.price)}
            </span>{' '}
            using your favorite UPI app.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {isMobile ? (
            <Button asChild size="lg" className="w-full">
               <Link href={upiLink}>
                <CreditCard className="mr-2" /> Pay with UPI App
              </Link>
            </Button>
          ) : (
            <div className="rounded-lg border-4 border-white bg-white p-2 shadow-lg">
              <Image
                src={qrCodeUrl}
                alt="UPI QR Code"
                width={200}
                height={200}
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {isMobile
              ? 'Tap the button above to pay securely.'
              : 'Scan with any UPI app'}
          </p>
          <div className="w-full text-center">
            <p className="text-sm text-muted-foreground mb-1">Or pay to this UPI ID:</p>
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-2">
              <span className="font-mono text-sm text-foreground">
                {UPI_ID}
              </span>
              <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookingConfirmation}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Confirming...' : 'I have paid, Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
