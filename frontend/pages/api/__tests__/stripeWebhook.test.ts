import webhookHandler from '@/pages/api/stripeWebhook';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { ValidationError } from '@/error/validationError';
import { MissingFieldError } from '@/error/missingFieldError';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { errorMap } from '@/error/errorMap';
import axios from 'axios';
import { EmailError } from '@/error/emailError';
import { SanityError } from '@/error/sanityError';

// Mock stripe and sanity client
jest.mock('@/lib/stripeClient', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

jest.mock('@/lib/sanityClient', () => ({
  sanityClient: {
    patch: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      commit: jest.fn(),
    })),
    fetch: jest.fn(),
  },
}));

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

jest.mock('axios');

// Mock submitOrderToYinbao
jest.mock('@/components/common/utils/submitOrderToYinbao', () => ({
  submitOrderToYinbao: jest.fn(),
}));

// Mock WebhookValidator
jest.mock('@/components/common/validations/webhookValidator', () => ({
  WebhookValidator: {
    validateAll: jest.fn(),
  },
}));

export const mockWebhookRequestResponse = (
  body: string | object,
  customHeaders: Record<string, string> = {},
): {
  req: NextApiRequest;
  res: NextApiResponse;
  status: jest.Mock;
  json: jest.Mock;
} => {
  const BASE_ORIGIN = process.env.BASE_ORIGIN || 'http://localhost:3000';

  const headers = {
    origin: BASE_ORIGIN,
    'stripe-signature': 'valid-signature',
    ...customHeaders,
  };

  const formattedBody = Buffer.from(
    typeof body === 'string' ? body : JSON.stringify(body),
  );

  const req = Object.assign(Readable.from([formattedBody]), {
    method: 'POST',
    headers,
  }) as unknown as NextApiRequest;

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};

describe('✅ Stripe Webhook API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset sanityClient.patch to default implementation
    (sanityClient.patch as jest.Mock).mockImplementation(() => ({
      set: jest.fn().mockReturnThis(),
      commit: jest.fn(),
    }));
  });

  const validWebhookEvent = {
    id: 'evt_123456789',
    type: 'checkout.session.completed',
    data: { object: { metadata: { orderId: '12345' } } },
  };

  const mockOrder = {
    orderId: '12345',
    customerName: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    date: '2024-03-20T12:00:00Z',
    totalPrice: 100,
    paymentMethod: 'Online',
    status: 'Pending',
    notes: 'Test notes',
    items: [
      { menuItemName: 'Item 1', price: 50, quantity: 2 },
    ],
  };

  test('✅ Should successfully process valid webhook', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
      validWebhookEvent,
    );

    const { req, res, status, json } =
      mockWebhookRequestResponse(validWebhookEvent);

    // Mock successful database operations
    (sanityClient.patch('12345').commit as jest.Mock).mockResolvedValue({});
    (sanityClient.fetch as jest.Mock).mockResolvedValue(mockOrder);
    (axios.post as jest.Mock).mockResolvedValue({});

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ received: true });
  });

  test('❌ Should return 400 if orderId is missing', async () => {
    const invalidEvent = {
      id: 'evt_123456789',
      type: 'checkout.session.completed',
      data: { object: {} },
    };

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(invalidEvent);

    const { req, res, status, json } = mockWebhookRequestResponse(invalidEvent);

    // Mock sanityClient.patch to throw MissingFieldError
    (sanityClient.patch as jest.Mock).mockImplementationOnce(() => {
      throw new MissingFieldError('Missing orderId');
    });

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Missing required field' });
  });

  test('❌ Should return 500 if database update fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
      validWebhookEvent,
    );

    const { req, res, status, json } =
      mockWebhookRequestResponse(validWebhookEvent);

    // Mock database update failure
    (sanityClient.patch as jest.Mock).mockImplementationOnce(() => ({
      set: jest.fn().mockReturnThis(),
      commit: jest.fn().mockRejectedValue(new SanityError('Failed to update order status')),
    }));

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Failed to send email: Failed to fetch order details' });
  });

  test('❌ Should return 422 if Stripe signature verification fails', async () => {
    const { WebhookValidator } = require('@/components/common/validations/webhookValidator');
    (WebhookValidator.validateAll as jest.Mock).mockImplementation(() => {
      throw new ValidationError('Invalid Stripe Signature');
    });

    const { req, res, status, json } = mockWebhookRequestResponse(
      validWebhookEvent,
      {
        'stripe-signature': 'invalid-signature',
      },
    );

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(422);
    expect(json).toHaveBeenCalledWith({ error: 'Format error' });
  });

  test('❌ Should return 201 if email sending fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
      validWebhookEvent,
    );

    const { req, res, status, json } =
      mockWebhookRequestResponse(validWebhookEvent);

    // Mock successful database operations
    (sanityClient.patch as jest.Mock).mockImplementationOnce(() => ({
      set: jest.fn().mockReturnThis(),
      commit: jest.fn().mockResolvedValue({}),
    }));
    (sanityClient.fetch as jest.Mock).mockResolvedValue(mockOrder);
    
    // Mock WebhookValidator to pass validation
    const { WebhookValidator } = require('@/components/common/validations/webhookValidator');
    (WebhookValidator.validateAll as jest.Mock).mockImplementation(() => validWebhookEvent);
    
    // Mock email sending failure
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to send email'));

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ error: 'Failed to send email, but the order has been created' });
  });
});
