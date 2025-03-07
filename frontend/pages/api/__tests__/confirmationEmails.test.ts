import { NextApiResponse, NextApiRequest } from 'next';
import handler from '@/pages/api/confirmationEmail';
import { sanityClient } from '@/lib/sanityClient';

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
  }));
});

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

  it('should return 400 if email content is missing even with a valid type (simulated)', async () => {
    // Although "ReservationX" isn't handled at runtime, we cast it as "Reservation"
    // to satisfy the TypeScript union ("TakeAwayOrder" | "Reservation").
    const { req, res } = mockRequestResponse('POST', {
      type: 'ReservationX' as 'Reservation',
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email content is missing.',
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
});
