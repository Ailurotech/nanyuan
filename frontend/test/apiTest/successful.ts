import { mockRequestResponse } from '@/test/requestMock';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';

export const successfulTest = (
  apiHandler: any,
  validData: Record<string, any>,
  expectedResponse: Record<string, any>,
  apiType: 'stripe' | 'sanity' | 'default' = 'default'
) => {
  describe(`✅ Successful ${apiType.toUpperCase()} API Tests`, () => {
    beforeEach(() => {
      jest.clearAllMocks();

      const apiMocks: Record<string, () => void> = {
        stripe: () => {
          (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
            id: 'sess_123456',
            url: 'https://stripe-success-url.com',
            object: 'checkout.session',
            payment_status: 'unpaid',
            status: 'open',
          });
        },
        sanity: () => {
          (sanityClient.create as jest.Mock).mockResolvedValue({
            _id: 'sanity_doc_123',
            success: true,
          });
        },
        default: () => {},  
      };

      if (apiMocks[apiType]) {
        apiMocks[apiType]();
      }
    });

    it(`✅ should successfully call ${apiType.toUpperCase()} API`, async () => {
      const { req, res, status, json } = mockRequestResponse(validData);
      req.headers.origin = 'http://localhost:3000'; 

      await apiHandler(req, res);

      if (apiType === 'stripe') {
        expect(stripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
      } else if (apiType === 'sanity') {
        expect(sanityClient.create).toHaveBeenCalledTimes(1);
      }

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(expect.objectContaining(expectedResponse));
    });
  });
};
