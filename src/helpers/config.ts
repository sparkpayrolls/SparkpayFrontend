import getConfig from 'next/config';

export const config = (): {
  apiUrl: string;
  paystackKey: string;
  isDev: boolean;
  employeeUploadSample: string;
} => getConfig().publicRuntimeConfig;
