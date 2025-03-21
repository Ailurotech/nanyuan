export class YinbaoSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YinbaoSystemError';
  }
}
