// errormap.ts
export const errorMap = new Map<string, { status: number; message: string }>([
  ['MissingFieldError', { status: 400, message: 'Missing required field' }],
  ['ValidationError', { status: 422, message: 'Format error' }],
  [
    'SystemError',
    {
      status: 500,
      message:
        'The cash register system is faulty, please contact the store to place your order',
    },
  ],
]);
