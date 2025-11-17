import type { ImagePlaceholder } from './placeholder-images';

export interface Event {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  date: string;
  venue: string;
  price: number;
  committee: string;
  tags: string[];
  image: ImagePlaceholder;
}

export interface Ticket {
  id: string;
  event: Event;
  studentName: string;
  qrCodeUrl: string;
}
