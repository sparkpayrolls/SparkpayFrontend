import { Employee } from 'src/api/types';

export type DebouncedFunc<T extends (..._args: any) => any> = {
  (..._args: Parameters<T>): ReturnType<T> | undefined;
};

export type IgetEmployeeMethod = {
  employeeId: string;
  apiCallStarted(): void;
  setEmployee(_value?: Employee): void;
  setNotFound(_value: boolean): void;
  apiCallDone(): void;
};

export type IgetCustomBlurHandler<T extends Record<string, unknown>> = {
  name: string;
  setTouched(_touched: T): unknown;
  touched: T;
};

export type IgetCustomChangeHandler<T extends Record<string, unknown>> = {
  values: T;
  name: string;
  setValues(_values: T): unknown;
};
