import { mockRequestResponse } from '@/test/requestMock';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { Stripe } from 'stripe';

export const successfulTest = (
  apiHandler: any,
  validData: Record<string, any>,
  expectedResponse: Record<string, any>,
  apiType: 'stripe' | 'sanity' | 'webhook' | 'default' = 'default',
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
        webhook: () => {
          (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
            id: 'evt_123456789',
            type: 'checkout.session.completed',
            data: { object: { metadata: { orderId: '12345' } } },
          } as unknown as Stripe.Event);
        },
        default: () => {},
      };

      apiMocks[apiType]?.();
    });

    afterEach(() => {
      jest.restoreAllMocks(); // ✅ 清除所有 Mock 避免影响其他测试
    });

    it(`✅ should successfully call ${apiType.toUpperCase()} API`, async () => {
      const { req, res, status, json } = mockRequestResponse(
        validData,
        apiType,
      );
      req.headers.origin = 'http://localhost:3000';

      await apiHandler(req, res);

      const callAssertions: Record<string, () => void> = {
        stripe: () =>
          expect(stripe.checkout.sessions.create).toHaveBeenCalledTimes(1),
        sanity: () => expect(sanityClient.create).toHaveBeenCalledTimes(1),
        webhook: () =>
          expect(stripe.webhooks.constructEvent).toHaveBeenCalledTimes(2),
        default: () => {},
      };

      callAssertions[apiType]?.();

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining(expectedResponse),
      );
    });
  });
};
