'use client';
import type { Event } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateEventDialog } from './create-event-dialog';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, writeBatch } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sampleEvents: Omit<Event, 'id'>[] = [
  {
    title: 'Campus Music Fest',
    description: 'A massive music festival featuring student bands and local artists. Get ready for a day of incredible music, food, and fun under the sun!',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Main Quad',
    price: 150,
    committeeId: 'music-committee',
    imageUrl: PlaceHolderImages['event-music-concert'].imageUrl,
  },
  {
    title: 'Tech Summit 2024',
    description: 'Join us for the annual Tech Summit, where industry leaders and innovators discuss the future of technology. Includes workshops and networking sessions.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Engineering Hall',
    price: 50,
    committeeId: 'tech-club',
    imageUrl: PlaceHolderImages['event-tech-conference'].imageUrl,
  },
  {
    title: 'Art in Bloom',
    description: 'An immersive art exhibition showcasing stunning floral arrangements and student artwork. A beautiful fusion of nature and creativity.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Fine Arts Gallery',
    price: 0,
    committeeId: 'art-society',
    imageUrl: PlaceHolderImages['event-art-exhibition'].imageUrl,
  },
  {
    title: 'Annual Sports Day',
    description: 'Compete for glory in a variety of track and field events. A day of friendly competition and campus-wide spirit.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'University Stadium',
    price: 0,
    committeeId: 'sports-union',
    imageUrl: PlaceHolderImages['event-sports-day'].imageUrl,
  },
  {
    title: 'Hackathon 2024',
    description: 'A 24-hour coding marathon. Build innovative solutions, compete for prizes, and collaborate with fellow tech enthusiasts.',
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Computer Science Dept.',
    price: 25,
    committeeId: 'coding-club',
    imageUrl: PlaceHolderImages['event-hackathon'].imageUrl,
  },
];


export default function DashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const eventsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'events'), orderBy('date', 'desc'))
        : null,
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Omit<Event, 'id'>>(eventsQuery);

  const handleSeed = async () => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    const eventsCol = collection(firestore, 'events');
    sampleEvents.forEach(eventData => {
      const docRef = doc(eventsCol); // Create a new doc with a random ID
      batch.set(docRef, eventData);
    });
    try {
      await batch.commit();
      toast({
        title: 'Events Seeded!',
        description: `${sampleEvents.length} demo events have been added.`,
      });
    } catch(e) {
       toast({
        variant: "destructive",
        title: 'Error seeding events',
        description: 'Could not add demo events to the database.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Organizer Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your events and track performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={handleSeed} disabled={isLoading || (events && events.length > 0)}>Seed Events</Button>
          <CreateEventDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </CreateEventDialog>
        </div>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-4">
          <EventTable
            events={events || []}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A full-featured analytics dashboard is coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventTableProps {
  events: Event[];
  isLoading: boolean;
}

function EventTable({
  events,
  isLoading,
}: EventTableProps) {
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { toast } = useToast();
  const [clientReady, setClientReady] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const handleEdit = (event: Event) => {
    setEventToEdit(event);
    setIsEditDialogOpen(true);
  };

  const handleDeleteInitiate = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete && firestore) {
      const eventRef = doc(firestore, 'events', eventToDelete.id);
      deleteDocumentNonBlocking(eventRef);
      toast({
        title: 'Event Deleted',
        description: `${eventToDelete.title} has been successfully deleted.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
  if (isLoading) {
    return <p>Loading events...</p>
  }

  if (!isLoading && events.length === 0) {
    return (
      <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
        <h3 className="text-lg font-semibold">No events found.</h3>
        <p>Click "Seed Events" to add some demo data or create a new event.</p>
      </div>
    )
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {clientReady ? new Date(event.date).toLocaleDateString() : '...'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {event.price > 0 ? (
                    formatCurrency(event.price)
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {clientReady ? 'N/A' : '...'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(event)}>
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => handleDeleteInitiate(event)}
                      >
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <CreateEventDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        event={eventToEdit}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event "{eventToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Yes, delete event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
