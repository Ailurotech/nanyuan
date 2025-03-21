export class yinbaoSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'yinbaoSystemError';
  }
}
