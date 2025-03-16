import { NextApiRequest, NextApiResponse } from 'next';
import { BaseValidator } from '@/components/common/validations/BaseValidator';
import { MissingFieldError } from '@/error/missingFieldError';
import { ValidationError } from '@/error/validationError';

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
  generateTakeawayOrderEmail: jest.fn(
    (orderDetails, orderId) => '<html>Test Email Content</html>',
  ),
}));

// Mock Sanity Client fetch
jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

import { sanityClient } from '@/lib/sanityClient';
import handler from '@/pages/api/takeawayOrderEmail';
import { generateTakeawayOrderEmail } from '@/lib/emailTemplates/generateTakeawayOrderEmail';

describe('Takeaway Email API', () => {
  // Dummy order Id and details for testing
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

  it('should throw MissingFieldError if orderId is missing for TakeAwayOrder', async () => {
    const { req, res } = mockRequestResponse('POST', {});

    await handler(req, res);

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).toThrow(MissingFieldError);
  });

  it('should throw MissingFieldError if orderId is an empty string for TakeAwayOrder', async () => {
    const { req, res } = mockRequestResponse('POST', { orderId: '' });

    await handler(req, res);

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).toThrow(MissingFieldError);
  });

  it('should throw ValidationError if orderId is not a valid UUID for TakeAwayOrder', async () => {
    const { req, res } = mockRequestResponse('POST', {
      orderId: 'invalid-uuid',
    });

    await handler(req, res);

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).toThrow(
      ValidationError,
    );
  });

  it('should not throw an error if orderId is valid UUID for TakeAwayOrder', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
  });

  it('should return 500 when sanityClient.fetch throws an error', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    (sanityClient.fetch as jest.Mock).mockRejectedValue(
      new Error('Fetch error.'),
    );

    const { req, res } = mockRequestResponse('POST', { orderId });
    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to fetch order details.',
      error: 'Fetch error.',
    });
  });

  it('should return 404 if order is not found', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    const { req, res } = mockRequestResponse('POST', { orderId });

    (sanityClient.fetch as jest.Mock).mockResolvedValue(null);

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order not found.',
      error: 'Order not found.',
    });
  });

  it('should return 500 if reading the logo image fails', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    const { req, res } = mockRequestResponse('POST', { orderId });

    // Mock Sanity Client to fetch order details
    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock readFile failure
    readFileSpy.mockRejectedValue(new Error('Read file error.'));

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to read logo image file.',
      error: 'Read file error.',
    });
  });

  it('should return 500 if Mailgun send fails', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
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

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(generateTakeawayOrderEmail).toHaveBeenCalledWith(
      orderDetails,
      orderId,
    );
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to send email.',
      error: 'Mailgun error',
    });
  });

  it('should send email successfully', async () => {
    // Mock Sanity Client to fetch order details
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
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

    // Mock Mailgun send success
    sendMock.mockResolvedValue({});

    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve)); // Wait all async tasks to be completed

    expect(() =>
      BaseValidator.validateRequiredFields(req.body, ['orderId']),
    ).not.toThrow();
    expect(() => BaseValidator.validateOrderId(req.body.orderId)).not.toThrow();
    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(generateTakeawayOrderEmail).toHaveBeenCalledWith(
      orderDetails,
      orderId,
    );
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully.',
    });
  });
});
