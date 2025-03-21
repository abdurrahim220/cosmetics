export class EmailSendingError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'EmailSendingError';
    }
  }