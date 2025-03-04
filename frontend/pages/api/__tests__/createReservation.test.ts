import createReservations from '../createReservations';
import { testRequiredFields } from '@/test/requiredFieldsTest';
import { testValidation } from '@/test/validationTests';
import { sanityErrorTest } from '@/test/apiTest/ErrorTest';
import { DateTime } from 'luxon';
import { successfulTest } from '@/test/apiTest/Successful';

jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

const validReservation = {
  name: 'John Doe',
  phone: '+61412345678',
  email: 'john@example.com',
  time: DateTime.local().plus({ days: 1 }).toISO(),
  guests: '4',
  table: { _type: 'reference', _ref: 'table123' },
  preference: 'Window seat',
  notes: 'Extra napkins',
  confirmed: true,
};

const requiredFields = ['name', 'phone', 'email', 'time', 'guests', 'table'];

const validationCases = [
  {
    field: 'phone',
    invalidValue: '1234567890123456',
    expectedError: 'Format error',
  },
  { field: 'phone', invalidValue: '04123abc78', expectedError: 'Format error' },
  {
    field: 'email',
    invalidValue: 'invalid-email',
    expectedError: 'Format error',
  },
  { field: 'guests', invalidValue: '-1', expectedError: 'Format error' },
  { field: 'time', invalidValue: '21-02-2025', expectedError: 'Format error' },
  { field: 'table', invalidValue: {}, expectedError: 'Format error' },
];

testRequiredFields(requiredFields, validReservation, createReservations);
testValidation(validationCases, validReservation, createReservations);
sanityErrorTest(validReservation, createReservations);
successfulTest(createReservations, validReservation, { message: 'Reservation created successfully' }, 'sanity');