export class ClientError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}