import { mockRequestResponse } from './requestMock';

export const testRequiredFields = (
  requiredFields: string[],
  validOrder: Record<string, any>,
  apiHandler: (req: any, res: any) => Promise<void>,
) => {
  describe('❌ Required Fields Validation', () => {
    requiredFields.forEach((field) => {
      it(`❌ should return 400 if required field "${field}" is missing`, async () => {
        const invalidOrder = { ...validOrder };
        delete (invalidOrder as any)[field];

        const { req, res, status, json } = mockRequestResponse(invalidOrder);
        await apiHandler(req, res);

        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.stringContaining('Missing required field'),
          }),
        );
      });
    });
  });
};
