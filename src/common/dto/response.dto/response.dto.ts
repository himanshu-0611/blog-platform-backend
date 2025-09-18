export class ResponseDto<T> {
  timeStamp: Date;
  status: 'success' | 'failure';
  error: boolean | null;
  message: string | null;
  data: T | null;

  constructor(
    status: 'success' | 'failure',
    data: T | null = null,
    message: string | null = null,
    error: boolean | null = null,
  ) {
    this.timeStamp = new Date();
    this.status = status;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}
