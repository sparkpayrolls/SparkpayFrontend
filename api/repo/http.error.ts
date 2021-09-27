import { AxiosError } from "axios";

export class HttpError extends Error {
  public isHttpException = true;
  public name = "HttpException";

  constructor(
    public message: string,
    public status: number,
    public errors: Record<string, string>
  ) {
    super(message);
  }

  static parse(error: AxiosError) {
    if (error.isAxiosError) {
      return new HttpError(
        error?.response?.data?.message || error.message,
        error?.response?.status || 0,
        error?.response?.data?.errors || {}
      );
    }

    return error;
  }
}
