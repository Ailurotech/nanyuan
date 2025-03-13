import createContactUs from '@/pages/api/createContactUs';
import { testRequiredFields } from '@/test/requiredFieldsTest';
import { testValidation } from '@/test/validationTests';
import { sanityErrorTest } from '@/test/apiTest/error';
import { successfulTest } from '@/test/apiTest/successful';

jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

const validContact = {
  name: 'Alice',
  phone: '+61412345678',
  message: 'whats your opening time',
};

const requiredFields = ['name', 'phone', 'message'];

const validationCases = [
  {
    field: 'phone',
    invalidValue: '1234567890123456',
    expectedError: 'Invalid phone format',
  },
  {
    field: 'phone',
    invalidValue: '04123abc78',
    expectedError: 'Invalid phone format',
  },
  { field: 'message', invalidValue: '', expectedError: 'Message is required' },
  {
    field: 'message',
    invalidValue: 'abcde',
    expectedError: 'Message must be at least 10 characters',
  },
];

testRequiredFields(requiredFields, validContact, createContactUs);
testValidation(validationCases, validContact, createContactUs);
sanityErrorTest(validContact, createContactUs);
successfulTest(
  createContactUs,
  validContact,
  { message: 'Form submitted successfully' },
  'sanity',
);
