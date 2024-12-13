import { sanityClient } from '@/lib/sanityClient';

export interface ReservationData {
  name: string;
  phone: string;
  email: string;
  guests: string;
  preference: string;
  notes: string;
  date: string;
  time: string;
}

export const createReservation = async (
  data: ReservationData,
  tableId: string
): Promise<void> => {
  try {
    await sanityClient.create({
      _type: 'reservation',
      name: data.name,
      phone: data.phone,
      email: data.email,
      guests: data.guests,
      preference: data.preference,
      notes: data.notes,
      time: `${data.date}T${data.time}`,
      table: {
        _type: 'reference',
        _ref: tableId,
      },
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation.');
  }
};
