import { mockRequestResponse } from '@/test/requestMock';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';

const apiErrorTest = (
  name: string,
  mockFunction: jest.Mock,
  validData: Record<string, any>,
  apiHandler: (req: any, res: any) => Promise<void>,
) => {
  describe(`❌ ${name} API Error Handling`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockFunction.mockRejectedValue(new Error(`${name} API error`));
    });

    it(`❌ should return 500 if ${name} API throws an error`, async () => {
      const { req, res, status, json } = mockRequestResponse(validData);
      await apiHandler(req, res);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Internal server error' }),
      );
    });
  });
};

export const sanityErrorTest = (validData: any, apiHandler: any) =>
  apiErrorTest(
    'Sanity',
    jest.spyOn(sanityClient, 'create') as jest.Mock, 
    validData,
    apiHandler,
  );

export const stripeErrorTest = (validData: any, apiHandler: any) =>
  apiErrorTest(
    'Stripe',
    jest.spyOn(stripe.checkout.sessions, 'create') as jest.Mock, 
    validData,
    apiHandler,
  );
