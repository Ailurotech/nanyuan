import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/reservationEmail';
import { generateReservationEmailToCustomer } from '@/lib/emailTemplates/generateReservationEmailToCustomer';
import { generateReservationEmailToSeller } from '@/lib/emailTemplates/generateReservationEmailToSeller';
import fsPromises from 'fs/promises';

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
  generateReservationEmailToCustomer: jest.fn(() => '<html>Test Customer Email Content</html>'),
}));

jest.mock('@/lib/emailTemplates/generateReservationEmailToSeller', () => ({
  generateReservationEmailToSeller: jest.fn(() => '<html>Test Seller Email Content</html>'),
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
    readFileSpy = jest.spyOn(fsPromises, 'readFile');
  });

  it('should return 500 if reading the logo image fails', async () => {
    readFileSpy.mockRejectedValue(new Error('Read file error.'));

    const { req, res } = createMocks({ method: 'POST', body: reservationInfo });

    await handler(req, res);

    expect(readFileSpy).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to send email: Failed to read logo image file',
    });
  });

  it('should return 500 if Mailgun send email to customer fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock
      .mockRejectedValueOnce(new Error('Mailgun error.'))
      .mockResolvedValueOnce({});

    const { req, res } = createMocks({ method: 'POST', body: reservationInfo });

    await handler(req, res);

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(reservationInfo);
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(reservationInfo);
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to send reservation email',
    });
  });

  it('should return 500 if Mailgun send email to seller fails', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('Mailgun error.'));

    const { req, res } = createMocks({ method: 'POST', body: reservationInfo });

    await handler(req, res);

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(reservationInfo);
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(reservationInfo);
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to send reservation email',
    });
  });

  it('should send email successfully', async () => {
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock.mockResolvedValue({});

    const { req, res } = createMocks({ method: 'POST', body: reservationInfo });

    await handler(req, res);

    expect(readFileSpy).toHaveBeenCalled();
    expect(generateReservationEmailToCustomer).toHaveBeenCalledWith(reservationInfo);
    expect(generateReservationEmailToSeller).toHaveBeenCalledWith(reservationInfo);
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Email sent successfully',
    });
  });
});
