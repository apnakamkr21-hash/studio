import type { ImagePlaceholder } from './placeholder-images';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  committeeId: string;
  imageUrl?: string;
}

export interface Ticket {
  id: string;
  event: Event;
  studentName: string;
  qrCodeUrl: string;
}


export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: string;
  qrCode: string;
  event?: Event; 
}
