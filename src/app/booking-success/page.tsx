'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, Ticket } from 'lucide-react';
import { PartyPopper } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8 text-center shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center">
          <PartyPopper className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold font-headline text-primary">
            Booking Successful!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you! Your ticket has been generated and is available in your
            account.
          </p>

          <div className="w-full my-8">
            <div className="relative flex items-center justify-between w-full">
              <div
                className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200"
              >
                <div className="h-full w-full bg-primary"></div>
              </div>
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle className="h-5 w-5" />
              </div>
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle className="h-5 w-5" />
              </div>
              <div
                 className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
                <span className="text-left">Event</span>
                <span className="text-center">Payment</span>
                <span className="text-right">Ticket</span>
            </div>
          </div>

          <div className="flex w-full gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2" /> Back to Home
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/tickets">
                <Ticket className="mr-2" /> View My Tickets
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}