import { mockRequestResponse } from '@/test/requestMock';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';

export const apiErrorTest = (
  apiName: string,
  mockFunction: jest.Mock,
  validOrder: Record<string, any>,
  apiHandler: (req: any, res: any) => Promise<void>,
) => {
  describe(`❌ ${apiName} API Error Handling`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockFunction.mockRejectedValue(new Error(`${apiName} API error`));
    });

    it(`❌ should return 500 if ${apiName} API throws an error`, async () => {
      const { req, res, status, json } = mockRequestResponse(validOrder);
      await apiHandler(req, res);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Internal server error' }),
      );
    });
  });
};

export const stripeErrorTest = (validOrder: any, apiHandler: any) =>
  apiErrorTest(
    'Stripe',
    stripe.checkout.sessions.create as jest.Mock,
    validOrder,
    apiHandler,
  );

export const sanityErrorTest = (validOrder: any, apiHandler: any) =>
  apiErrorTest(
    'Sanity',
    sanityClient.create as jest.Mock,
    validOrder,
    apiHandler,
  );

export const webhookErrorTest = (validOrder: any, apiHandler: any) =>
  apiErrorTest(
    'Webhook',
    stripe.webhooks.constructEvent as jest.Mock,
    validOrder,
    apiHandler,
  );
