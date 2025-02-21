import { mockRequestResponse } from './requestMock';
import { sanityClient } from '@/lib/sanityClient';

export const testApiErrorHandling = (
  validOrder: Record<string, any>,
  createTakeawayOrder: (req: any, res: any) => Promise<void>,
) => {
  describe('❌ API Error Handling', () => {
    it('❌ should return 500 if Sanity API throws an error', async () => {
      (sanityClient.create as jest.Mock).mockRejectedValue(
        new Error('Sanity error'),
      );

      const { req, res, status, json } = mockRequestResponse(validOrder);
      await createTakeawayOrder(req, res);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Internal server error',
        }),
      );
    });
  });
};
