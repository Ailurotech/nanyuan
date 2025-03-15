import { NextApiRequest, NextApiResponse } from 'next';

// Mock request and response
const mockRequestResponse = (method: string, body: any) => {
  const req = {
    method,
    body,
    url: '/api/takeAwayOrderEmail',
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

// Mock the generateTakeawayOrderEmail function to return a dummy HTML string.
jest.mock('@/lib/emailTemplates/generateTakeawayOrderEmail', () => ({
  generateTakeawayOrderEmail: jest.fn(() => '<html>Test Email Content</html>'),
}));

// Mock Sanity Client fetch
jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

import { sanityClient } from '@/lib/sanityClient';
import handler from '@/pages/api/takeawayOrderEmail';

describe('Takeaway Email API', () => {
  // Dummy order Id and details for testing
  const orderId = '123';
  const orderDetails = {
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

  let readFileSpy: jest.SpyInstance; // Mock readFile
  let fsPromises: any;

  beforeEach(() => {
    jest.clearAllMocks();
    fsPromises = require('fs/promises');
    readFileSpy = jest.spyOn(fsPromises, 'readFile'); // Mock readFile
  });

  it('should return 400 if orderId is missing for TakeAwayOrder', async () => {
    const { req, res } = mockRequestResponse('POST', {});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required field: orderId',
    });
  });

  it('should return 500 if reading the logo image fails', async () => {
    const { req, res } = mockRequestResponse('POST', { orderId });

    // Mock Sanity Client to fetch order details
    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock readFile failure
    readFileSpy.mockRejectedValue(new Error('Failed to read logo image file.'));

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to read logo image file.',
    });
  });

  it('should send email successfully', async () => {
    // Mock Sanity Client to fetch order details
    const orderId = '123';
    const orderDetails = {
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
    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock readFile
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully.',
    });
  });

  it('should return 500 if Mailgun send fails', async () => {
    // Mock Sanity Client to fetch order details
    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock readFile
    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    // Mock Mailgun send failure
    sendMock.mockRejectedValue(new Error('Mailgun error'));

    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to send email.' });
  });
});
