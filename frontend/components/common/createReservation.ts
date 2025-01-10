import { ReservationData } from '@/types';

export const createReservation = async (
  data: ReservationData,
  tableId: string | undefined
): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_CREATE_RESERVATION_URL;

  if (!apiUrl) {
    throw new Error('Environment variable NEXT_PUBLIC_CREATE_RESERVATION_URL is missing');
  }

  try {
    console.log('Creating reservation with data:', data);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        tableId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create reservation. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Reservation created successfully:', result);
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
