import { $api } from 'src/api';
import { ParseSavedEmployeeUploadXlsxResponseEmployee } from 'src/api/types';

export type Values = {
  employees: ParseSavedEmployeeUploadXlsxResponseEmployee[];
};

// eslint-disable-next-line no-undef
export type Parsed = Awaited<
  ReturnType<typeof $api.file.parseSavedEmployeeUploadXlsx>
>;
