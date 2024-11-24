import { Table } from '@/types';
import { sanityClient } from '@/lib/sanityClient';

interface SuitableTableResult {
  status: 'success' | 'error';
  table?: string; 
  message?: string; 
}

async function findSuitableTable(
  tables: Table[],
  guests: string,
  reservationDate: string,
  reservationTime: string
): Promise<SuitableTableResult> {
  const guestCount = parseInt(guests, 10);

  if (isNaN(guestCount) || guestCount <= 0) {
    return { status: 'error', message: 'Invalid guest count' };
  }

  if (!tables || tables.length === 0) {
    return { status: 'error', message: 'No tables available' };
  }

  const suitableTable = tables
    .filter((table) => parseInt(table.type, 10) >= guestCount)
    .sort((a, b) => parseInt(a.type, 10) - parseInt(b.type, 10))[0];

  if (!suitableTable) {
    return { status: 'error', message: 'No suitable table found for the given guest count, please contact us for a larger table.' };
  }

  try {
    const reservationStart = new Date(`${reservationDate}T${reservationTime}`);
    const reservationBefore = new Date(reservationStart);
    reservationBefore.setHours(reservationStart.getHours() - 2);

    const query = `
      *[_type == "reservation" && table._ref == $tableId && date == $date] {
        time
      }
    `;

    const reservations = await sanityClient.fetch<{ time: string }[]>(query, {
      tableId: suitableTable._id,
      date: reservationDate,
    });

    const conflicts = reservations.filter((reservation) => {
      const resTime = new Date(`${reservationDate}T${reservation.time}`);
      return resTime >= reservationBefore && resTime <= reservationStart;
    });

    if (conflicts.length >= suitableTable.quantity) {
      return {
        status: 'error',
        message: `No availability for this table at ${reservationTime}.`,
      };
    }
  } catch (error) {
    console.error('Error checking reservations:', error);
    return { status: 'error', message: 'Error checking availability.' };
  }

  return { status: 'success', table: suitableTable._id };
}

export default findSuitableTable;
