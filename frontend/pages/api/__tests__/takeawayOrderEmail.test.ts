import { NextApiRequest, NextApiResponse } from 'next';

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

const sendMock = jest.fn();
jest.mock('mailgun-js', () => {
  return jest.fn(() => ({
    messages: () => ({
      send: sendMock,
    }),
    Attachment: jest.fn(),
  }));
});

jest.mock('@/lib/emailTemplates/generateTakeawayOrderEmail', () => ({
  generateTakeawayOrderEmail: jest.fn(
    (orderDetails, orderId) => '<html>Test Email Content</html>',
  ),
}));

jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

import { sanityClient } from '@/lib/sanityClient';
import handler from '@/pages/api/takeawayOrderEmail';
import { generateTakeawayOrderEmail } from '@/lib/emailTemplates/generateTakeawayOrderEmail';

describe('Takeaway Email API', () => {
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

  let readFileSpy: jest.SpyInstance;
  let fsPromises: any;

  beforeEach(() => {
    jest.clearAllMocks();
    fsPromises = require('fs/promises');
    readFileSpy = jest.spyOn(fsPromises, 'readFile');
  });

  it('should return 500 when sanityClient.fetch throws an error', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    (sanityClient.fetch as jest.Mock).mockRejectedValue(
      new Error('Fetch error'),
    );

    const { req, res } = mockRequestResponse('POST', { orderId });
    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send email: Failed to fetch order details',
    });
  });

  it('should return 500 if reading the logo image fails', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    const { req, res } = mockRequestResponse('POST', { orderId });

    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    readFileSpy.mockRejectedValue(new Error('Read file error.'));

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send email: Failed to read logo image file',
    });
  });

  it('should return 500 if Mailgun send fails', async () => {
    const orderId = '85943fcb-3eb6-42fc-bf1f-2cffb1870b1c';
    (sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock.mockRejectedValue(new Error('Mailgun error'));

    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(generateTakeawayOrderEmail).toHaveBeenCalledWith(
      orderDetails,
      orderId,
    );
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to send takeaway order email',
    });
  });

  it('should send email successfully', async () => {
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

    const mockBuffer = Buffer.from('dummy-logo');
    readFileSpy.mockResolvedValue(mockBuffer);

    sendMock.mockResolvedValue({});

    const { req, res } = mockRequestResponse('POST', { orderId });

    await handler(req, res);
    await new Promise((resolve) => setImmediate(resolve));

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
    expect(generateTakeawayOrderEmail).toHaveBeenCalledWith(
      orderDetails,
      orderId,
    );
    expect(sendMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email sent successfully',
    });
  });
});
