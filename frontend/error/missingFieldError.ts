export class MissingFieldError extends Error {
  constructor(field: string) {
    super(`Missing required field: ${field}`);
    this.name = 'MissingFieldError';
  }
}
