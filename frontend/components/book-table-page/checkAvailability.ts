import { Table } from '@/types';
import { sanityClient } from '@/lib/sanityClient';
import { DateTime } from 'luxon';

interface CheckAvailabilityResult {
  status: 'success' | 'error';
  table?: string;
  message?: string;
}

function validateOtp(otp: boolean): CheckAvailabilityResult {
  return otp
    ? { status: 'success' }
    : { status: 'error', message: 'OTP not verified' };
}

function validateGuestCount(guests: string): CheckAvailabilityResult {
  const guestCount = parseInt(guests, 10);
  return isNaN(guestCount) || guestCount <= 0
    ? { status: 'error', message: 'Invalid guest count' }
    : { status: 'success' };
}

function validateAvailableTables(tables: Table[]): CheckAvailabilityResult {
  return tables && tables.length > 0
    ? { status: 'success' }
    : { status: 'error', message: 'No tables available' };
}

function validateReservationTime(reservationDate: string, reservationTime: string): CheckAvailabilityResult {
  const now = DateTime.now();
  const reservationStart = DateTime.fromISO(`${reservationDate}T${reservationTime}`);
  
  if (reservationStart <= now) {
    return { status: 'error', message: 'Cannot book for a past date or time.' };
  }

  const minAllowedDateTime = now.plus({ hours: 24 }); 
  return reservationStart < minAllowedDateTime
    ? { status: 'error', message: 'Reservations must be made at least 24 hours in advance.' }
    : { status: 'success' };
}

function findTable(tables: Table[], guests: string): CheckAvailabilityResult {
  const guestCount = parseInt(guests, 10);
  const suitableTable = tables
    .filter((table) => parseInt(table.type, 10) >= guestCount)
    .sort((a, b) => parseInt(a.type, 10) - parseInt(b.type, 10))[0];

  return suitableTable
    ? { status: 'success', table: suitableTable._id }
    : { status: 'error', message: 'No suitable table found for the given guest count, please contact us for a larger table.' };
}

async function checkTableConflicts(
  tableId: string,
  reservationDate: string,
  reservationTime: string
): Promise<CheckAvailabilityResult> {
  try {
    const reservationStart = DateTime.fromISO(`${reservationDate}T${reservationTime}`);
    const bufferStart = reservationStart.minus({ hours: 2 }); // 提前 2 小时

  
    const bufferStartISO = bufferStart.toISO();
    const bufferEndISO = reservationStart.toISO();

    
    const query = `
      *[_type == "reservation" && table._ref == $tableId && date == $date && 
        time >= $start && time < $end] {
          time
      }
    `;

    const reservations = await sanityClient.fetch<{ time: string }[]>(query, {
      tableId,
      date: reservationDate,
      start: bufferStartISO,
      end: bufferEndISO,
    });

    const table = await sanityClient.getDocument(tableId);
    if (reservations.length >= (table?.quantity || 0)) {
      return { status: 'error', message: `No availability for this table at this time, please contact us.` };
    }
  } catch (error) {
    console.error('Error checking reservations:', error);
    return { status: 'error', message: 'Error checking availability.' };
  }

  return { status: 'success', table: tableId };
}


async function checkAvailability(
  tables: Table[],
  guests: string,
  reservationDate: string,
  reservationTime: string,
  otp: boolean
): Promise<CheckAvailabilityResult> {
  let result: CheckAvailabilityResult = { status: 'success' }; 
  
  result = validateOtp(otp);
  if (result.status === 'error') return result;

  result = validateGuestCount(guests);
  if (result.status === 'error') return result;

  result = validateAvailableTables(tables);
  if (result.status === 'error') return result;

  result = validateReservationTime(reservationDate, reservationTime);
  if (result.status === 'error') return result;

  result = findTable(tables, guests);
  if (result.status === 'error') return result;


  result = await checkTableConflicts(
    result.table!,
    reservationDate,
    reservationTime
  );
  if (result.status === 'error') return result;

  return result;
}

export default checkAvailability;
