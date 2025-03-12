import { NextApiResponse, NextApiRequest } from 'next';
import handler from '@/pages/api/confirmationEmail';
import { sanityClient } from '@/lib/sanityClient';
import fs from 'fs';

// Helper function to generate mock request and response objects
const mockRequestResponse = (method: string, body: any) => {
  const req = {
    method,
    body,
    url: '/api/confirmationEmails',
  } as unknown as NextApiRequest;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;

  return { req, res };
};

// Mock Mailgun Client
const sendMock = jest.fn();
jest.mock('mailgun-js', () => {
  return jest.fn(() => ({
    messages: () => ({
      send: sendMock,
    }),
    Attachment: jest.fn(),
  }));
});

// Mock fs.readFileSync to always return a dummy buffer
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => Buffer.from('dummy-logo')),
}));

// Mock Sanity Client fetch
jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

describe('ConfirmationEmails API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if type is missing', async () => {
    const { req, res } = mockRequestResponse('POST', {});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required field: type',
    });
  });

  it('should return 400 if orderId is missing for TakeAwayOrder', async () => {
    const { req, res } = mockRequestResponse('POST', { type: 'TakeAwayOrder' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required field: orderId',
    });
  });

  it('should successfully send confirmation email for TakeAwayOrder', async () => {
    const orderId = '3du679wg';
    const orderDetailsMock = {
      customerName: 'Jerry',
      email: 'test@example.com',
      phone: '123456789',
      date: '2025-05-07T21:04:00Z',
      totalPrice: 87,
      paymentMethod: 'Online',
      status: 'Paid',
      notes: 'No spicy',
      items: [
        { menuItemName: 'Burger', price: 10, quantity: 2 },
        { menuItemName: 'Chicken', price: 12, quantity: 2 },
      ],
    };

    // Mock Sanity Client to fetch order details
    (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(orderDetailsMock);

    const { req, res } = mockRequestResponse('POST', {
      type: 'TakeAwayOrder',
      orderId,
    });
    await handler(req, res);

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully.',
    });
  });

  it('should successfully send confirmation email for Reservation', async () => {
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

    const { req, res } = mockRequestResponse('POST', {
      ...reservationInfo,
      type: 'Reservation',
    });
    await handler(req, res);

    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully.',
    });
  });

  it('should return 400 if an invalid type is provided', async () => {
    const { req, res } = mockRequestResponse('POST', {
      type: 'invalidType',
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid type provided.',
    });
  });

  it('should return 500 if an error occurs during email sending', async () => {
    // Simulate error in mailgunClient.messages().send()
    sendMock.mockImplementationOnce(() => {
      throw new Error('Failed to send email');
    });

    const reservationInfo = {
      name: 'Alice',
      phone: '111222333',
      email: 'alice@example.com',
      time: '2025-03-07T19:00:00Z',
      guests: '2',
      table: '2',
      preference: 'Near the window',
      notes: 'None',
    };

    const { req, res } = mockRequestResponse('POST', {
      ...reservationInfo,
      type: 'Reservation',
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to send email.' });
  });

  it('should return 500 if reading the logo image file fails', async () => {
    // Simulate fs.readFileSync throwing an error
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Read file failed');
    });

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

    const { req, res } = mockRequestResponse('POST', {
      ...reservationInfo,
      type: 'Reservation',
    });

    await handler(req, res);

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to read logo image file.',
    });
  });
});
