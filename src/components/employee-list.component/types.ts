import { $api } from 'src/api';

export interface BulkEmployeeUploadList {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  salary: string;
  payoutDetails: string[];
  payoutMethod: string;
}

export type Values = { employees: BulkEmployeeUploadList[] };

// eslint-disable-next-line no-undef
export type Parsed = Awaited<
  ReturnType<typeof $api.file.parseSavedEmployeeUploadXlsx>
>;
