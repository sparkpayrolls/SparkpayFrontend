import { Employee } from 'src/api/types';

/* eslint-disable no-unused-vars */
export type DebouncedFunc<T extends (...args: any) => any> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
};

export type IgetEmployeeMethod = {
  employeeId: string;
  apiCallStarted(): void;
  setEmployee(value?: Employee): void;
  setNotFound(value: boolean): void;
  apiCallDone(): void;
};
