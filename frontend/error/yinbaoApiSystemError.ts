export class YinbaoApiSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YinbaoApiSystemError';
  }
}
