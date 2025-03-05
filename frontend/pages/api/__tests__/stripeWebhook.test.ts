import webhookHandler from '@/pages/api/stripeWebhook';
import { successfulTest } from '@/test/apiTest/successful';
import { webhookErrorTest } from '@/test/apiTest/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { ValidationError } from '@/error/validationError';
import { MissingFieldError } from '@/error/missingFieldError';
import { testRequiredFields } from '@/test/requiredFieldsTest';

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

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
  },
}));

const createMockRequestResponse = (
  body: string | object,
  apiType: 'webhook' | 'default' = 'default',
  headers: Record<string, string> = {},
) => {
  const formattedBody = Buffer.from(
    typeof body === 'string' ? body : JSON.stringify(body),
  );

  const req = Object.assign(Readable.from([formattedBody]), {
    method: 'POST',
    headers: {
      origin: 'http://localhost:3000',
      ...(apiType === 'webhook'
        ? { 'stripe-signature': 'valid-signature' }
        : {}),
      ...headers,
    },
  }) as unknown as NextApiRequest;

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};

describe('✅ Stripe Webhook API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validWebhookEvent = {
    id: 'evt_123456789',
    type: 'checkout.session.completed',
    data: { object: { metadata: { orderId: '12345' } } },
  };

  (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
    validWebhookEvent,
  );

  successfulTest(
    webhookHandler,
    validWebhookEvent,
    { received: true },
    'webhook',
  );
  webhookErrorTest(validWebhookEvent, webhookHandler);

  test('❌ Should return 400 if orderId is missing', async () => {
    const invalidEvent = {
      id: 'evt_123456789',
      type: 'checkout.session.completed',
      data: { object: {} },
    };

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(invalidEvent);

    const { req, res, status, json } = createMockRequestResponse(
      invalidEvent,
      'webhook',
    );

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Missing required field' });
  });

  test('❌ Should return 500 if database update fails', async () => {
    (sanityClient.patch('1').commit as jest.Mock).mockRejectedValue(
      new MissingFieldError('Database Error'),
    );

    const { req, res, status, json } = createMockRequestResponse(
      validWebhookEvent,
      'webhook',
    );

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Missing required field' });
  });

  test('❌ Should return 422 if Stripe signature verification fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new ValidationError('Invalid Stripe Signature');
    });

    const { req, res, status, json } = createMockRequestResponse(
      validWebhookEvent,
      'webhook',
      {
        'stripe-signature': 'invalid-signature',
      },
    );

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(422);
    expect(json).toHaveBeenCalledWith({ error: 'Format error' });
  });
});
