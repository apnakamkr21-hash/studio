'use client';
import { events as allEvents } from '@/lib/data';
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

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>(allEvents.slice(0, 5));

  const onEventUpdated = (updatedEvent: Event) => {
    const eventIndex = events.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex !== -1) {
      setEvents(prev =>
        prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } else {
      setEvents(prev => [updatedEvent, ...prev]);
    }
  };

  const onEventDeleted = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
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
        <CreateEventDialog onEventUpdated={onEventUpdated}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </CreateEventDialog>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-4">
          <EventTable
            events={events}
            onEventUpdated={onEventUpdated}
            onEventDeleted={onEventDeleted}
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
  onEventUpdated: (event: Event) => void;
  onEventDeleted: (eventId: string) => void;
}

function EventTable({
  events,
  onEventUpdated,
  onEventDeleted,
}: EventTableProps) {
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { toast } = useToast();
  const [clientReady, setClientReady] = useState(false);

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
    if (eventToDelete) {
      onEventDeleted(eventToDelete.id);
      toast({
        title: 'Event Deleted',
        description: `${eventToDelete.name} has been successfully deleted.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
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
                <TableCell className="font-medium">{event.name}</TableCell>
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
                  {clientReady ? `${Math.floor(Math.random() * 200)} / 200` : '...'}
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
                      <DropdownMenuItem>Duplicate Event</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Manage Attendees</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
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
        onEventUpdated={onEventUpdated}
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
              event "{eventToDelete?.name}".
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