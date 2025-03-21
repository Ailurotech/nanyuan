export class yinBaoSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'yinbaoSystemError';
  }
}
