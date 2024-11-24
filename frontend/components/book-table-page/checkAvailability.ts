import { Table } from '@/types';
import { sanityClient } from '@/lib/sanityClient';

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
  const now = new Date();
  const reservationStart = new Date(`${reservationDate}T${reservationTime}`);
  
  if (reservationStart <= now) {
    return { status: 'error', message: 'Cannot book for a past date or time.' };
  }

  const minAllowedDateTime = new Date(now);
  minAllowedDateTime.setHours(now.getHours() + 24);

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
    const reservationStart = new Date(`${reservationDate}T${reservationTime}`);

    const query = `
      *[_type == "reservation" && table._ref == $tableId && date == $date] {
        time
      }
    `;

    const reservations = await sanityClient.fetch<{ time: string }[]>(query, {
      tableId,
      date: reservationDate,
    });

    const conflicts = reservations.filter((reservation) => {
      const resStart = new Date(`${reservationDate}T${reservation.time}`);
      const resEnd = new Date(resStart);
      resEnd.setHours(resEnd.getHours() + 3); 

      return (
        (reservationStart >= resStart && reservationStart < resEnd) || 
        (resStart >= reservationStart && resStart < new Date(reservationStart.getTime() + 3 * 60 * 60 * 1000)) // 已有订单开始时间在目标时间内
      );
    });

    const table = await sanityClient.getDocument(tableId);
    if (conflicts.length >= (table?.quantity || 0)) {
      return { status: 'error', message: `No availability for this table at this time, please contact us.` };
    }
  } catch (error) {
    console.error('Error checking reservations:', error);
    return { status: 'error', message: 'Error checking availability.' };
  }

  return { status: 'success' };
}


async function checkAvailability(
  tables: Table[],
  guests: string,
  reservationDate: string,
  reservationTime: string,
  otp: boolean
): Promise<CheckAvailabilityResult> {
  const otpValidation = validateOtp(otp);
  if (otpValidation.status === 'error') return otpValidation;

  const guestValidation = validateGuestCount(guests);
  if (guestValidation.status === 'error') return guestValidation;

  const tableValidation = validateAvailableTables(tables);
  if (tableValidation.status === 'error') return tableValidation;

  const timeValidation = validateReservationTime(reservationDate, reservationTime);
  if (timeValidation.status === 'error') return timeValidation;

  const tableResult = findTable(tables, guests);
  if (tableResult.status === 'error') return tableResult;

  const conflictValidation = await checkTableConflicts(
    tableResult.table!,
    reservationDate,
    reservationTime
  );
  if (conflictValidation.status === 'error') return conflictValidation;

  return tableResult;
}

export default checkAvailability;
