export class GenericError extends Error {
  status?: string;
  title?: string;
  message: string;

  constructor({ title, message }: { title?: string; message: string }) {
    super(message);
    this.status = 'error';
    this.title = title;
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
