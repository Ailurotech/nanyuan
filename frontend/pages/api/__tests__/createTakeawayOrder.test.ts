import createTakeawayOrder from '../createTakeawayOrder';
import { testRequiredFields } from '@/test/requiredFieldsTest';
import { testValidation } from '@/test/validationTests';
import { sanityErrorTest } from '@/test/apiTest/error';
import { DateTime } from 'luxon';
import { successfulTest } from '@/test/apiTest/successful';

jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

const validOrder = {
  orderId: '12345',
  customerName: 'John Doe',
  phone: '+61412345678',
  email: 'john@example.com',
  items: [
    {
      _key: 'abc123',
      name: 'Burger',
      quantity: 2,
      price: 9.99,
      menuItem: { _type: 'reference', _ref: 'menu123' },
    },
  ],
  date: DateTime.local().plus({ days: 10 }).toISO(),
  status: 'Pending',
  totalPrice: 29.99,
  paymentMethod: 'online',
  notes: 'Extra cheese',
};

const requiredFields = [
  'orderId',
  'customerName',
  'phone',
  'email',
  'items',
  'date',
  'status',
  'totalPrice',
  'paymentMethod',
];

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
  { field: 'items', invalidValue: [], expectedError: 'Format error' },
  { field: 'totalPrice', invalidValue: -5, expectedError: 'Format error' },
  { field: 'date', invalidValue: '21-02-2025', expectedError: 'Format error' },
  {
    field: 'date',
    invalidValue: '2023-01-01T12:00:00',
    expectedError: 'Format error',
  },
  {
    field: 'paymentMethod',
    invalidValue: 'cash',
    expectedError: 'Format error',
  },
  {
    field: 'items',
    invalidValue: [{ _key: '123', price: 10, quantity: 1 }],
    expectedError: 'Format error',
  },
  {
    field: 'notes',
    invalidValue: 'a'.repeat(1001),
    expectedError: 'Format error',
  },
];

testRequiredFields(requiredFields, validOrder, createTakeawayOrder);
testValidation(validationCases, validOrder, createTakeawayOrder);
sanityErrorTest(validOrder, createTakeawayOrder);
successfulTest(
  createTakeawayOrder,
  validOrder,
  { message: 'Order created successfully' },
  'sanity',
);
