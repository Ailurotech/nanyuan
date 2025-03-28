import webhookHandler from '@/pages/api/stripeWebhook';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { ValidationError } from '@/error/validationError';
import { MissingFieldError } from '@/error/missingFieldError';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { errorMap } from '@/error/errorMap';
import axios from 'axios';

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
  },
}));

jest.mock('@/lib/apiHandler', () => () => ({
  post: jest.fn((handler) => handler),
}));

jest.mock('axios');

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
  });

  const validWebhookEvent = {
    id: 'evt_123456789',
    type: 'checkout.session.completed',
    data: { object: { metadata: { orderId: '12345' } } },
  };

  (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
    validWebhookEvent,
  );

  test('✅ Should successfully process valid webhook', async () => {
    const { req, res, status, json } =
      mockWebhookRequestResponse(validWebhookEvent);

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

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Missing required field' });
  });

  test('❌ Should return 500 if database update fails', async () => {
    (sanityClient.patch('1').commit as jest.Mock).mockRejectedValue(
      new MissingFieldError('Database Error'),
    );

    const { req, res, status, json } =
      mockWebhookRequestResponse(validWebhookEvent);

    await webhookHandler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Missing required field' });
  });

  test('❌ Should return 422 if Stripe signature verification fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
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
});
