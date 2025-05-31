import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/reservationEmail';
import { generateReservationEmailToCustomer } from '@/lib/emailTemplates/generateReservationEmailToCustomer';
import { generateReservationEmailToSeller } from '@/lib/emailTemplates/generateReservationEmailToSeller';
import fsPromises from 'fs/promises';

// Mock express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn(() => (req: any, res: any, next: any) => next());
});

// Mock sendEmail
jest.mock('@/lib/sendEmail', () => ({
  sendEmail: jest.fn().mockImplementation(async () => {
    return Promise.resolve({ id: 'test-id' });
  }),
}));

jest.mock('@/lib/emailTemplates/generateReservationEmailToCustomer', () => ({
  generateReservationEmailToCustomer: jest.fn(
    () => '<html>Test Customer Email Content</html>',
  ),
}));

jest.mock('@/lib/emailTemplates/generateReservationEmailToSeller', () => ({
  generateReservationEmailToSeller: jest.fn(
    () => '<html>Test Seller Email Content</html>',
  ),
}));

jest.mock('@/lib/apiHandler', () => {
  return () => ({
    post: (handler: any) => handler,
  });
});

describe('Reservation Email API', () => {
  const reservationInfo = {
    name: 'Alice',
    phone: '111222333',
    email: 'alice@example.com',
    time: '2025-05-07T21:03:00Z',
    guests: '6',
    table: '10',
    preference: 'No preference',
    notes: 'test notes',
  };

  let readFileSpy: jest.SpyInstance;
  let sendEmailMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    readFileSpy = jest.spyOn(fsPromises, 'readFile');
    sendEmailMock = require('@/lib/sendEmail').sendEmail;
  });

  it('should return 500 if Mailgun send email to customer fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendEmailMock
      .mockRejectedValueOnce(new Error('Mailgun error.'))
      .mockResolvedValueOnce({ id: 'test-id' });

    const { req, res } = createMocks({
      method: 'POST',
      body: reservationInfo,
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    });

    await handler(req, res);

    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to send reservation email',
    });
  }, 10000);

  it('should return 500 if Mailgun send email to seller fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendEmailMock
      .mockResolvedValueOnce({ id: 'test-id' })
      .mockRejectedValueOnce(new Error('Mailgun error.'));

    const { req, res } = createMocks({
      method: 'POST',
      body: reservationInfo,
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    });

    await handler(req, res);

    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to send reservation email',
    });
  }, 10000);

  it('should send email successfully', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendEmailMock.mockResolvedValue({ id: 'test-id' });

    const { req, res } = createMocks({
      method: 'POST',
      body: reservationInfo,
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    });

    await handler(req, res);

    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Email sent successfully',
    });
  }, 10000);
});
