import { mockRequestResponse } from '@/test/requestMock';
import checkoutStripe from '@/pages/api/checkoutStripe';
import { testRequiredFields } from '@/test/requiredFieldsTest';
import { stripeErrorTest } from '@/test/apiTest/error';
import { testValidation } from '@/test/validationTests';
import { v4 as uuidv4 } from 'uuid';
import { successfulTest } from '@/test/apiTest/successful';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

import Stripe from 'stripe';
const stripe = new Stripe('test-secret-key', {
  apiVersion: '2025-01-27.acacia',
});

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

const validOrder = {
  orderId: uuidv4(),
  customerName: 'John Doe',
  phone: '+61412345678',
  email: 'john@example.com',
  items: [
    {
      name: 'Item 1',
      price: 20,
      quantity: 2,
      menuItem: { _type: 'reference', _ref: 'menu123' },
    },
  ],
  totalPrice: 40,
};

const requiredFields = ['orderId', 'email', 'items', 'totalPrice'];

const validationCases = [
  {
    field: 'email',
    invalidValue: 'invalid-email',
    expectedError: 'Format error',
  },
  {
    field: 'phone',
    invalidValue: '1234567890123456',
    expectedError: 'Format error',
  },
  { field: 'totalPrice', invalidValue: 'forty', expectedError: 'Format error' },
  { field: 'items', invalidValue: [], expectedError: 'Format error' },
  {
    field: 'orderId',
    invalidValue: '1234567890123456789012345678901234567890',
    expectedError: 'Format error',
  },
];

describe('✅ API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      id: 'sess_123456',
      url: 'https://stripe-success-url.com',
      object: 'checkout.session',
      payment_status: 'unpaid',
      status: 'open',
    });
  });

  testRequiredFields(requiredFields, validOrder, checkoutStripe);
  testValidation(validationCases, validOrder, checkoutStripe);
  stripeErrorTest(validOrder, checkoutStripe);
  successfulTest(
    checkoutStripe,
    validOrder,
    { url: 'https://stripe-success-url.com' },
    'stripe',
  );
});
