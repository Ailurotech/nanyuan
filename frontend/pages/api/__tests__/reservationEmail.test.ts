import { NextApiRequest, NextApiResponse } from 'next';

const mockRequestResponse = (method: string, body: any) => {
  const req = {
    method,
    body,
    url: '/api/reservationEmail',
  } as unknown as NextApiRequest;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;

  return { req, res };
};

const sendMock = jest.fn();
jest.mock('mailgun-js', () => {
  return jest.fn(() => ({
    messages: () => ({
      send: sendMock,
    }),
    Attachment: jest.fn(),
  }));
});

jest.mock('@/lib/emailTemplates/generateReservationEmailToCustomer', () => ({
  generateReservationEmailToCustomer: jest.fn(
    (reservationInfo) => '<html>Test Customer Email Content</html>',
  ),
}));

jest.mock('@/lib/emailTemplates/generateReservationEmailToSeller', () => ({
  generateReservationEmailToSeller: jest.fn(
    (reservationInfo) => '<html>Test Seller Email Content</html>',
  ),
}));

import handler from '@/pages/api/reservationEmail';
import { generateReservationEmailToCustomer } from '@/lib/emailTemplates/generateReservationEmailToCustomer';
import { generateReservationEmailToSeller } from '@/lib/emailTemplates/generateReservationEmailToSeller';

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
  let fsPromises: any;

  beforeEach(() => {
    jest.clearAllMocks();
    fsPromises = require('fs/promises');
    readFileSpy = jest.spyOn(fsPromises, 'readFile');
  });

  it('should return 500 if reading the logo image fails', async () => {
    readFileSpy.mockRejectedValue(new Error('Read file error.'));

    const { req, res } = mockRequestResponse('POST', reservationInfo);

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(readFileSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send email: Failed to read logo image file',
    });
  });

  it('should return 500 if Mailgun send email to customer fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock
      .mockImplementationOnce(() => Promise.reject(new Error('Mailgun error.')))
      .mockImplementationOnce(() => Promise.resolve({}));

    const { req, res } = mockRequestResponse('POST', reservationInfo);

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send reservation email',
    });
  });

  it('should return 500 if Mailgun send email to seller fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Mailgun error.')),
      );

    const { req, res } = mockRequestResponse('POST', reservationInfo);

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send reservation email',
    });
  });

  it('should send email successfully', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock.mockResolvedValue({}).mockResolvedValue({});

    const { req, res } = mockRequestResponse('POST', reservationInfo);

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(
      reservationInfo,
    );
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully',
    });
  });
});
