import { Table } from '@/types';
import { sanityClient } from '@/lib/sanityClient';
import { DateTime } from 'luxon';

interface CheckAvailabilityResult {
  status: 'success' | 'error';
  tableId?: string;
  message?: string;
}

const validateInitialConditions = (
  otp: boolean,
  guests: string,
  tables: Table[]
): CheckAvailabilityResult => {
  return !otp
    ? { status: 'error', message: 'OTP not verified' }
    : isNaN(parseInt(guests, 10)) || parseInt(guests, 10) <= 0
    ? { status: 'error', message: 'Invalid guest count' }
    : (!tables || tables.length === 0)
    ? { status: 'error', message: 'No tables available' }
    : { status: 'success' };
};


const validateReservationTime = (
  reservationDate: string,
  reservationTime: string
): CheckAvailabilityResult => {
  const now = DateTime.now();
  const reservationStart = DateTime.fromISO(`${reservationDate}T${reservationTime}`);

  return reservationStart <= now
    ? { status: 'error', message: 'Cannot book for a past date or time.' }
    : reservationStart < now.plus({ hours: 24 })
    ? { status: 'error', message: 'Reservations must be made at least 24 hours in advance.' }
    : { status: 'success' };
};


const findTable = (
  tables: Table[],
  guests: string
): CheckAvailabilityResult => {
  const guestCount = parseInt(guests, 10);
  const suitableTable = tables
    .filter((table) => parseInt(table.type, 10) >= guestCount)
    .sort((a, b) => parseInt(a.type, 10) - parseInt(b.type, 10))[0];

  return suitableTable
    ? { status: 'success', tableId: suitableTable._id }
    : { status: 'error', message: 'No suitable table found for the given guest count, please contact us for a larger table.' };
};


const checkTableConflicts = async (
  tableId: string,
  reservationDate: string,
  reservationTime: string
): Promise<CheckAvailabilityResult> => {
  try {
    const reservationStart = DateTime.fromISO(`${reservationDate}T${reservationTime}`);
    const bufferStart = reservationStart.minus({ hours: 1 }).toISO();
    const bufferEnd = reservationStart.plus({ hours: 1 }).toISO();

    const query = `
      *[_type == "reservation" && table._ref == $tableId && 
        time >= $bufferStart && time < $bufferEnd] {
          time
      }
    `;

    const reservations = await sanityClient.fetch<{ datetime: string }[]>(query, {
      tableId,
      bufferStart,
      bufferEnd,
    });

    const table = await sanityClient.getDocument(tableId);

    return reservations.length >= (table?.quantity || 0)
      ? { status: 'error', message: 'No availability for this table at this time, please contact us.' }
      : { status: 'success', tableId };
  } catch (error) {
    console.error('Error checking reservations:', error);
    return { status: 'error', message: 'Error checking availability.' };
  }
};


const checkAvailability = async (
  tables: Table[],
  guests: string,
  reservationDate: string,
  reservationTime: string,
  otp: boolean
): Promise<CheckAvailabilityResult> => {
  let result: CheckAvailabilityResult = { status: 'success' }; 

  const validations = [
    () => validateInitialConditions(otp, guests, tables),
    () => validateReservationTime(reservationDate, reservationTime),
    () => findTable(tables, guests),
    async () => checkTableConflicts(result.tableId!, reservationDate, reservationTime), 
  ];

  for (const validation of validations) {
    result = await validation(); 
    if (result.status === 'error') return result;
  }
  return { status: 'success', tableId: result.tableId }; 
};


export default checkAvailability;
