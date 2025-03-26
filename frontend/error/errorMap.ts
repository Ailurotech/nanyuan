// errorMap.ts
export const errorMap = new Map<string, { status: number; message: string }>([
  ['MissingFieldError', { status: 400, message: 'Missing required field' }],
  ['ValidationError', { status: 422, message: 'Format error' }],
  ['ZodError', { status: 422, message: 'Validation failed' }],
  ['EmailError', { status: 201, message: 'Failed to send email, but the order has been created' }],
  ['ReadFileError', { status: 500, message: 'Failed to send email: Failed to read logo image file' }],
  ['SanityError', { status: 500, message: 'Failed to send email: Failed to fetch order details' }],
  ['SystemError', {
    status: 500,
    message: 'The cash register system is faulty, please contact the store to place your order',
  }],
]);