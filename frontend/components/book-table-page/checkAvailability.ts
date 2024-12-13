import { Table } from '@/types';
import { sanityClient } from '@/lib/sanityClient';
import { DateTime } from 'luxon';

interface ValidationResult {
  success: boolean;
  tableId?: string;
  errorMessage?: string;
}

export const validateInitialConditions = (
  otp: boolean,
  guests: string,
  tables: Table[]
): ValidationResult => {
  if (!otp) return { success: false, errorMessage: 'OTP not verified' };
  if (isNaN(parseInt(guests, 10)) || parseInt(guests, 10) <= 0) {
    return { success: false, errorMessage: 'Invalid guest count' };
  }
  if (!tables || tables.length === 0) {
    return { success: false, errorMessage: 'No tables available' };
  }
  return { success: true };
};

export const validateReservationTime = (
  reservationDate: string,
  reservationTime: string
): ValidationResult => {
  const now = DateTime.now();
  const reservationStart = DateTime.fromISO(`${reservationDate}T${reservationTime}`);

  if (reservationStart <= now) {
    return { success: false, errorMessage: 'Cannot book for a past date or time.' };
  }
  if (reservationStart < now.plus({ hours: 24 })) {
    return { success: false, errorMessage: 'Reservations must be made at least 24 hours in advance.' };
  }
  return { success: true };
};

export const validateTableAvailabilityAndConflicts = async (
  tables: Table[],
  guests: string,
  reservationDate: string,
  reservationTime: string
): Promise<ValidationResult> => {
  try {
    const guestCount = parseInt(guests, 10);
    const suitableTable = tables
      .filter((table) => parseInt(table.type, 10) >= guestCount)
      .sort((a, b) => parseInt(a.type, 10) - parseInt(b.type, 10))[0];

    if (!suitableTable) {
      return { success: false, errorMessage: 'No suitable table found for the given guest count.' };
    }

    const tableId = suitableTable._id;
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

    if (reservations.length >= (table?.quantity || 0)) {
      return { success: false, errorMessage: 'No availability for this table at this time.' };
    }

    return { success: true, tableId };
  } catch (error) {
    console.error('Error checking table availability and conflicts:', error);
    return { success: false, errorMessage: 'Error checking table availability.' };
  }
};

export const runValidations = async (
  validations: (() => ValidationResult | Promise<ValidationResult>)[]
): Promise<ValidationResult> => {
  let tableId: string | undefined;

  for (const validation of validations) {
    const result = await validation();
    if (!result.success) {
      alert(result.errorMessage || 'Validation failed.');
      throw new Error(result.errorMessage || 'Validation failed.');
    }
    if (result.tableId) tableId = result.tableId; // 更新 tableId
  }

  return { success: true, tableId };
};


