import React, { ChangeEvent, useState } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import * as XLSX from 'xlsx';
import { ModalLayout } from './ModalLayout.component';
import { IF } from '../Misc/if.component';
import { AddFileSVG } from '../svg';

export type UploadedEmployeeRow = {
  firstname: string;
  lastname: string;
  salary: string;
  yearlyRentAmount: string;
  email: string;
  phoneNumber: string;
  bank: string;
  accountNumber: string;
};

const SAMPLE_HEADERS = [
  'First Name',
  'Last Name',
  'Salary',
  'Yearly Rent Amount',
  'Email (optional)',
  'Phone (optional)',
  'Bank',
  'Account Number',
];

export const UploadEmployeesModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Upload Employees">
      {(modal) => {
        return <UploadEmployeesForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const UploadEmployeesForm = ({ modal }: { modal: NiceModalHandler }) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadSampleSheet = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([SAMPLE_HEADERS]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

    const output = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx',
    });

    const blob = new Blob([output], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee-upload-sample.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const mapRows = (rows: Array<Array<string | number>>) => {
    const [firstRow = []] = rows;
    const isHeaderRow = SAMPLE_HEADERS.every((header, index) => {
      return (
        ((firstRow[index] as string) || '').toString().trim().toLowerCase() ===
        header.toLowerCase()
      );
    });
    const startIndex = isHeaderRow ? 1 : 0;

    return rows
      .slice(startIndex)
      .map((row) => ({
        firstname: (row[0] || '').toString().trim(),
        lastname: (row[1] || '').toString().trim(),
        salary: (row[2] || '').toString().trim(),
        yearlyRentAmount: (row[3] || '').toString().trim(),
        email: (row[4] || '').toString().trim(),
        phoneNumber: (row[5] || '').toString().trim(),
        bank: (row[6] || '').toString().trim(),
        accountNumber: (row[7] || '').toString().trim(),
      }))
      .filter((employee) =>
        Object.values(employee).some((value) => value.length > 0),
      );
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError('Please upload a valid .xlsx file.');
      return;
    }
    if (file.size * 1e-6 > 10) {
      setError('File size is greater than 10mb.');
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];

      if (!firstSheet) {
        setError('Could not read worksheet from file.');
        return;
      }

      const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1');
      for (let row = range.s.r; row <= range.e.r; row++) {
        const phoneCell =
          firstSheet[XLSX.utils.encode_cell({ r: row, c: 5 })];
        const accountCell =
          firstSheet[XLSX.utils.encode_cell({ r: row, c: 7 })];

        [phoneCell, accountCell].forEach((cell) => {
          if (cell && cell.t === 'n') {
            cell.t = 's';
            cell.v = String(cell.v);
            cell.w = cell.v;
          }
        });
      }

      const rows = XLSX.utils.sheet_to_json<Array<string | number>>(firstSheet, {
        header: 1,
        raw: false,
      });
      const employees = mapRows(rows);

      if (!employees.length) {
        setError('No employee rows found in uploaded file.');
        return;
      }

      modal.resolve(employees);
      modal.hide();
    } catch (err) {
      setError('Could not parse uploaded file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-modal">
      <p style={{ fontSize: '14px', color: '#6D7A98', marginBottom: '1.5rem' }}>
        Download the sample sheet, fill in employee records, then upload the
        completed file to populate the table.
      </p>

      <label
        className={`form__file-upload${fileName ? ' active' : ''}`}
        onDragOver={(e) => e.preventDefault()}
      >
        <AddFileSVG />

        <p className="form__file-upload--text" style={{ marginTop: '0.75rem' }}>
          <IF condition={!!fileName}>{fileName}</IF>
          <IF condition={!fileName}>
            <span className="form__file-upload-text--highlight">
              Upload a file
            </span>{' '}
            or drag and drop
          </IF>
        </p>

        <span className="form__file-upload-subtext">
          <IF condition={!!fileName}>Change File</IF>
          <IF condition={!fileName}>Spreadsheet (.xlsx) up to 10MB</IF>
        </span>

        <input
          type="file"
          name="employeeUploadXlsx"
          accept=".xlsx"
          onChange={handleFileSelect}
          disabled={loading}
        />
      </label>

      <button
        type="button"
        onClick={downloadSampleSheet}
        className="form__sample-btn"
      >
        Download Sample Sheet
      </button>

      <IF condition={!!error}>
        <p className="text__danger text__text-sm" style={{ marginTop: '0.5rem' }}>
          {error}
        </p>
      </IF>
    </div>
  );
};
