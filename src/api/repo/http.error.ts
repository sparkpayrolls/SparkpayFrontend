import { AxiosError } from 'axios';

export class HttpError extends Error {
  public isHttpException = true;
  public name = 'HttpException';

  constructor(
    public message: string,
    // eslint-disable-next-line no-unused-vars
    public status: number,
    // eslint-disable-next-line no-unused-vars
    public errors: Record<string, string>,
  ) {
    super(message);
  }

  static parse(error: AxiosError) {
    if (error.isAxiosError) {
      // axios 0.28 types response.data as unknown
      const data = error?.response?.data as
        | { message?: string; errors?: Record<string, string> }
        | undefined;

      return new HttpError(
        data?.message || error.message,
        error?.response?.status || 0,
        data?.errors || {},
      );
    }

    return error;
  }
}
