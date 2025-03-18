// errormap.ts
export const errorMap = new Map<string, { status: number; message: string }>([
  ['MissingFieldError', { status: 400, message: 'Missing required field' }],
  ['ValidationError', { status: 422, message: 'Format error' }],
  [
    'EmailError',
    {
      status: 201,
      message: 'Failed to send email, but the order has been created',
    },
  ],
]);
