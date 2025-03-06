import webhookHandler from '@/pages/api/stripeWebhook';
import { successfulTest } from '@/test/apiTest/successful';
import { webhookErrorTest } from '@/test/apiTest/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { ValidationError } from '@/error/validationError';
import { MissingFieldError } from '@/error/missingFieldError';
import { mockRequestResponse } from '@/test/requestMock';

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

    const { req, res, status, json } = mockRequestResponse(
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

    const { req, res, status, json } = mockRequestResponse(
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

    const { req, res, status, json } = mockRequestResponse(
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
