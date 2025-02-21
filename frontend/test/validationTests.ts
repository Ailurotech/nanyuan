import { mockRequestResponse } from './requestMock';

export const testValidation = (
  cases: { field: string; invalidValue: any; expectedError: string }[],
  validOrder: Record<string, any>,
  createTakeawayOrder: (req: any, res: any) => Promise<void>,
) => {
  describe('❌ Data Validation Errors', () => {
    cases.forEach(({ field, invalidValue, expectedError }) => {
      it(`❌ should return 422 if "${field}" is invalid`, async () => {
        const invalidOrder = { ...validOrder, [field]: invalidValue };

        const { req, res, status, json } = mockRequestResponse(invalidOrder);
        await createTakeawayOrder(req, res);

        expect(status).toHaveBeenCalledWith(422);
        expect(json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.stringContaining(expectedError),
          }),
        );
      });
    });
  });
};
