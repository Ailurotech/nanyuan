import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../takeawayOrderEmail';
import * as sanityClient from '@/lib/sanityClient';
import * as mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    fetch: jest.fn()
  }))
}));

jest.mock('mailgun.js');
jest.mock('form-data');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

// Mock mailgunClient
jest.mock('@/lib/mailgunClient', () => ({
  mailgunClient: {
    messages: () => ({
      send: jest.fn()
    })
  }
}));

// Mock sendEmail
jest.mock('@/lib/sendEmail', () => ({
  sendEmail: jest.fn()
}));

// Mock generateTakeawayOrderEmail
jest.mock('@/lib/emailTemplates/generateTakeawayOrderEmail', () => ({
  generateTakeawayOrderEmail: jest.fn().mockImplementation(() => {
    throw new Error('Failed to read logo image');
  })
}));

// Mock apiHandler
jest.mock('@/lib/apiHandler', () => {
  return () => ({
    post: (handler: any) => handler
  });
});

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

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset sanityClient.patch to default implementation
    (sanityClient.patch as jest.Mock).mockImplementation(() => ({
      set: jest.fn().mockReturnThis(),
      commit: jest.fn(),
    }));
  });

  it('should return 500 when sanityClient.fetch throws error', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        orderId: 'test-order-id'
      }
    });

    // Mock sanityClient.fetch to throw error
    (sanityClient.sanityClient.fetch as jest.Mock).mockRejectedValue(new Error('Sanity error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to send email: Failed to fetch order details'
    });
  });

  it('should return 500 when logo image read fails', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        orderId: 'test-order-id'
      }
    });

    // Mock successful order fetch but failed logo read
    (sanityClient.sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock fs.promises.readFile to throw error
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('Failed to read logo'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to send takeaway order email'
    });
  });

  it('should return 500 when Mailgun send fails', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        orderId: 'test-order-id'
      }
    });

    // Mock successful order fetch and logo read
    (sanityClient.sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-logo'));

    // Mock sendEmail to throw error
    const { sendEmail } = require('@/lib/sendEmail');
    (sendEmail as jest.Mock).mockRejectedValue(new Error('Mailgun error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to send takeaway order email'
    });
  });

  it('should successfully send email', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        orderId: 'test-order-id'
      }
    });

    // Mock successful order fetch
    (sanityClient.sanityClient.fetch as jest.Mock).mockResolvedValue(orderDetails);

    // Mock successful logo read
    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-logo'));

    // Mock successful sendEmail
    const { sendEmail } = require('@/lib/sendEmail');
    (sendEmail as jest.Mock).mockResolvedValue({ id: 'test-id' });

    // Mock successful generateTakeawayOrderEmail
    const { generateTakeawayOrderEmail } = require('@/lib/emailTemplates/generateTakeawayOrderEmail');
    (generateTakeawayOrderEmail as jest.Mock).mockImplementation(() => '<html>Test Email</html>');

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Email sent successfully'
    });
  });

  it('❌ Should return 400 if orderId is missing', async () => {
    const invalidEvent = {
      id: 'evt_123456789',
      type: 'checkout.session.completed',
      data: { object: {} },
    };

    (sanityClient.patch as jest.Mock).mockImplementationOnce(() => {
      throw new MissingFieldError('Missing orderId');
    });
  });
});
