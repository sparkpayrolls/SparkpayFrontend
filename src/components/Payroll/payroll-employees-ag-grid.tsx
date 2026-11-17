import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellEditorParams,
  ICellRendererParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
  ValueSetterParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Util } from 'src/helpers/util';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { PayrollEmployeePayoutStatus } from 'src/api/types';
import type {
  PayrollAgGridMode,
  PayrollAgGridRow,
} from './payroll-employees-ag-grid.types';

export type { PayrollAgGridMode, PayrollAgGridRow };

type Props = {
  mode: PayrollAgGridMode;
  rows: PayrollAgGridRow[];
  currency: string;
  search: string;
  loading?: boolean;
  selectedIds: string[];
  onSelectedIdsChange: (_ids: string[]) => void;
  onNameClick?: (_row: PayrollAgGridRow) => void;
  onAddonClick?: (
    _row: PayrollAgGridRow,
    _type: 'Bonus' | 'Deduction',
  ) => void;
  onSalaryChange?: (_id: string, _salary: number) => void;
  onNetSalaryChange?: (_id: string, _netSalary: number) => void;
  onSendPayslip?: (_id: string) => void;
  onDownloadPayslip?: (_id: string) => void;
  height?: string | number;
  /** Size the grid to its rows (capped by maxHeight). Best for view pages. */
  fitToContent?: boolean;
  maxHeight?: string | number;
  gridApiRef?: MutableRefObject<GridApi | null>;
};

const GRID_HEADER_HEIGHT = 48;
const GRID_ROW_HEIGHT = 42;
const FIT_CONTENT_ROW_CAP = 20;

const moneyValue = (params: ValueFormatterParams) => {
  const value = Number(params.value || 0);
  const currency = (params.context?.currency as string) || '';
  return `${currency} ${Util.formatMoneyNumber(value)}`.trim();
};

/** Keeps the existing amount and places a caret — no wipe-on-type replace. */
const MoneyCellEditor = forwardRef(
  (props: ICellEditorParams<PayrollAgGridRow, number>, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(() =>
      props.value == null ? '' : String(props.value),
    );

    useImperativeHandle(ref, () => ({
      getValue() {
        return value;
      },
    }));

    useEffect(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, []);

    return (
      <input
        ref={inputRef}
        className="payroll-ag-grid__money-editor"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
);
MoneyCellEditor.displayName = 'MoneyCellEditor';

const suppressMoneyReplaceOnKey = (
  params: SuppressKeyboardEventParams<PayrollAgGridRow>,
) => {
  if (params.editing) return false;
  const { key, ctrlKey, metaKey, altKey } = params.event;
  if (key === 'Enter' || key === 'F2' || key === 'Tab' || key === 'Escape') {
    return false;
  }
  // Block printable / Backspace / Delete from clearing the cell to type afresh.
  if (key === 'Backspace' || key === 'Delete') return true;
  if (key.length === 1 && !ctrlKey && !metaKey && !altKey) return true;
  return false;
};

const NameCell = (
  props: ICellRendererParams<PayrollAgGridRow> & {
    onNameClick?: (_row: PayrollAgGridRow) => void;
  },
) => {
  const row = props.data;
  if (!row) return null;
  if (!props.onNameClick) {
    return <span>{row.name}</span>;
  }
  return (
    <button
      type="button"
      className="create-payroll-page__employee-name"
      onClick={() => props.onNameClick?.(row)}
    >
      {row.name}
    </button>
  );
};

const AddonMoneyCell = (
  props: ICellRendererParams<PayrollAgGridRow> & {
    addonType?: 'Bonus' | 'Deduction';
    onAddonClick?: (
      _row: PayrollAgGridRow,
      _type: 'Bonus' | 'Deduction',
    ) => void;
  },
) => {
  const row = props.data;
  if (!row) return null;
  const label = moneyValue(props as ValueFormatterParams);
  if (!props.onAddonClick || !props.addonType) {
    return <span>{label}</span>;
  }
  return (
    <button
      type="button"
      className="payroll-ag-grid__addon-cell"
      onClick={() => props.onAddonClick?.(row, props.addonType!)}
    >
      {label}
    </button>
  );
};

const PayoutStatusCell = (
  props: ICellRendererParams<PayrollAgGridRow> & {
    onSendPayslip?: (_id: string) => void;
    onDownloadPayslip?: (_id: string) => void;
  },
) => {
  const row = props.data;
  if (!row) return null;
  return (
    <div className="d-flex align-items-center justify-content-space-between">
      <StatusChip status={row.payoutStatus as PayrollEmployeePayoutStatus} />
      <KebabMenu
        items={[
          {
            action() {
              props.onSendPayslip?.(row.id);
            },
            value: 'Send payslip',
          },
          {
            action() {
              props.onDownloadPayslip?.(row.id);
            },
            value: 'Download payslip',
          },
        ]}
      />
    </div>
  );
};

export const PayrollEmployeesAgGrid = (props: Props) => {
  const {
    mode,
    rows,
    currency,
    search,
    loading,
    selectedIds,
    onSelectedIdsChange,
    onNameClick,
    onAddonClick,
    onSalaryChange,
    onNetSalaryChange,
    onSendPayslip,
    onDownloadPayslip,
    height = 'calc(100vh - 280px)',
    fitToContent = false,
    maxHeight = 'min(70vh, calc(100vh - 360px))',
    gridApiRef,
  } = props;

  const apiRef = useRef<GridApi | null>(null);
  const syncingSelection = useRef(false);
  const ignoreSelectionEvents = useRef(true);
  const lastSelectionSyncAt = useRef(0);
  const searchRef = useRef(search);
  searchRef.current = search;

  const applySelectionToGrid = useCallback((api: GridApi, ids: Set<string>) => {
    syncingSelection.current = true;
    ignoreSelectionEvents.current = true;
    api.forEachNode((node) => {
      const id = node.data?.id;
      if (!id) return;
      const shouldSelect = ids.has(id);
      if (node.isSelected() !== shouldSelect) {
        node.setSelected(shouldSelect, false);
      }
    });
    // Double rAF: wait until AG Grid finishes emitting selectionChanged.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lastSelectionSyncAt.current = Date.now();
        syncingSelection.current = false;
        ignoreSelectionEvents.current = false;
      });
    });
  }, []);

  const moneySetter = useCallback(
    (
      params: ValueSetterParams<PayrollAgGridRow>,
      field: 'salary' | 'netSalary',
    ) => {
      const raw = params.newValue;
      const next =
        typeof raw === 'number'
          ? raw
          : Number(String(raw).replace(/[^0-9.-]/g, ''));
      if (!Number.isFinite(next) || next < 0) {
        return false;
      }
      if (!params.data) return false;
      if (params.data[field] === next) return false;
      params.data[field] = next;
      if (field === 'salary') {
        onSalaryChange?.(params.data.id, next);
      } else {
        onNetSalaryChange?.(params.data.id, next);
      }
      return true;
    },
    [onNetSalaryChange, onSalaryChange],
  );

  const columnDefs = useMemo<ColDef<PayrollAgGridRow>[]>(() => {
    const cols: ColDef<PayrollAgGridRow>[] = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: false,
        width: 48,
        maxWidth: 48,
        pinned: 'left',
        sortable: false,
        filter: false,
        resizable: false,
        suppressMenu: true,
      },
      {
        headerName: '#',
        width: 56,
        maxWidth: 64,
        pinned: 'left',
        sortable: false,
        filter: false,
        resizable: false,
        suppressMenu: true,
        valueGetter: (params) =>
          params.node?.rowIndex != null ? params.node.rowIndex + 1 : '',
        cellClass: 'payroll-ag-grid__row-number',
      },
      {
        headerName: 'Name',
        field: 'name',
        pinned: 'left',
        minWidth: 180,
        flex: 1.2,
        cellRenderer: NameCell,
        cellRendererParams: { onNameClick },
      },
      {
        headerName: 'Salary',
        field: 'salary',
        minWidth: 130,
        valueFormatter: moneyValue,
        editable: mode === 'create',
        singleClickEdit: mode === 'create',
        cellEditor: MoneyCellEditor,
        suppressKeyboardEvent: suppressMoneyReplaceOnKey,
        valueSetter: (params) => moneySetter(params, 'salary'),
        cellClass: mode === 'create' ? 'payroll-ag-grid__editable' : undefined,
      },
      {
        headerName: 'Net Salary',
        field: 'netSalary',
        minWidth: 130,
        valueFormatter: moneyValue,
        editable: mode === 'create',
        singleClickEdit: mode === 'create',
        cellEditor: MoneyCellEditor,
        suppressKeyboardEvent: suppressMoneyReplaceOnKey,
        valueSetter: (params) => moneySetter(params, 'netSalary'),
        cellClass: mode === 'create' ? 'payroll-ag-grid__editable' : undefined,
      },
      {
        headerName: mode === 'create' ? 'Bonus' : 'Bonuses',
        field: 'bonus',
        minWidth: 110,
        ...(mode === 'create' && onAddonClick
          ? {
              cellRenderer: AddonMoneyCell,
              cellRendererParams: {
                addonType: 'Bonus' as const,
                onAddonClick,
              },
              cellClass: 'payroll-ag-grid__clickable',
            }
          : { valueFormatter: moneyValue }),
      },
      {
        headerName: mode === 'create' ? 'Deduction' : 'Deductions',
        field: 'deduction',
        minWidth: 120,
        ...(mode === 'create' && onAddonClick
          ? {
              cellRenderer: AddonMoneyCell,
              cellRendererParams: {
                addonType: 'Deduction' as const,
                onAddonClick,
              },
              cellClass: 'payroll-ag-grid__clickable',
            }
          : { valueFormatter: moneyValue }),
      },
      {
        headerName: 'Tax',
        field: 'tax',
        minWidth: 110,
        valueFormatter: moneyValue,
      },
    ];

    if (mode === 'create') {
      cols.push(
        {
          headerName: 'Employer Pension',
          field: 'employerPension',
          minWidth: 140,
          valueFormatter: moneyValue,
        },
        {
          headerName: 'Employee Pension',
          field: 'employeePension',
          minWidth: 140,
          valueFormatter: moneyValue,
        },
        {
          headerName: 'Voluntary Pension',
          field: 'voluntaryPension',
          minWidth: 140,
          valueFormatter: moneyValue,
        },
      );
    } else {
      cols.push({
        headerName: 'Pension',
        field: 'pension',
        minWidth: 120,
        valueFormatter: moneyValue,
      });
    }

    cols.push(
      {
        headerName: 'NHF',
        field: 'nhf',
        minWidth: 100,
        valueFormatter: moneyValue,
      },
      {
        headerName: 'NSITF',
        field: 'nsitf',
        minWidth: 100,
        valueFormatter: moneyValue,
      },
      {
        headerName: 'NHIS',
        field: 'nhis',
        minWidth: 100,
        valueFormatter: moneyValue,
      },
    );

    if (mode === 'view') {
      cols.push({
        headerName: 'Payout Status',
        field: 'payoutStatus',
        minWidth: 180,
        pinned: 'right',
        cellRenderer: PayoutStatusCell,
        cellRendererParams: { onSendPayslip, onDownloadPayslip },
        sortable: false,
      });
    }

    return cols;
  }, [
    mode,
    moneySetter,
    onAddonClick,
    onDownloadPayslip,
    onNameClick,
    onSendPayslip,
  ]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      suppressMovable: true,
    }),
    [],
  );

  const isExternalFilterPresent = useCallback(
    () => Boolean(searchRef.current),
    [],
  );
  const doesExternalFilterPass = useCallback(
    (node: { data?: PayrollAgGridRow }) => {
      const q = searchRef.current.trim().toLowerCase();
      if (!q) return true;
      return String(node.data?.name || '')
        .toLowerCase()
        .includes(q);
    },
    [],
  );

  const selectedIdsKey = selectedIds.join('\0');
  const selectedIdSet = useMemo(
    () => new Set(selectedIds),
    // selectedIdsKey tracks content; selectedIds identity alone is unstable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIdsKey],
  );

  useEffect(() => {
    apiRef.current?.onFilterChanged();
  }, [search]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api || api.isDestroyed?.()) return;
    applySelectionToGrid(api, selectedIdSet);
  }, [selectedIdSet, applySelectionToGrid]);

  // Re-apply when row data arrives after selectedIds (common on first load).
  useEffect(() => {
    const api = apiRef.current;
    if (!api || api.isDestroyed?.() || !rows.length) return;
    applySelectionToGrid(api, selectedIdSet);
  }, [rows.length, applySelectionToGrid, selectedIdSet]);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      apiRef.current = event.api;
      if (gridApiRef) {
        gridApiRef.current = event.api;
      }
      applySelectionToGrid(event.api, selectedIdSet);
    },
    [gridApiRef, selectedIdSet, applySelectionToGrid],
  );

  const onSelectionChanged = useCallback(() => {
    if (syncingSelection.current || ignoreSelectionEvents.current) return;
    const api = apiRef.current;
    if (!api) return;
    // headerCheckboxSelectionFilteredOnly=false selects every row node,
    // including those hidden by the external name search.
    const nextIds = api.getSelectedRows().map((row) => row.id);
    const nextSet = new Set(nextIds);
    if (
      nextIds.length === selectedIds.length &&
      selectedIds.every((id) => nextSet.has(id))
    ) {
      return;
    }
    // AG Grid often emits an empty selection while rebuilding row nodes
    // right after we programmatically sync. Don't clobber real selection.
    if (
      nextIds.length === 0 &&
      selectedIds.length > 0 &&
      Date.now() - lastSelectionSyncAt.current < 750
    ) {
      return;
    }
    onSelectedIdsChange(nextIds);
  }, [onSelectedIdsChange, selectedIds]);

  const useAutoHeight =
    fitToContent && rows.length > 0 && rows.length <= FIT_CONTENT_ROW_CAP;
  const fittedHeight = useMemo(() => {
    if (!fitToContent || useAutoHeight) return undefined;
    const content =
      GRID_HEADER_HEIGHT + Math.max(rows.length, 1) * GRID_ROW_HEIGHT + 2;
    return content;
  }, [fitToContent, rows.length, useAutoHeight]);

  const containerStyle = useMemo(() => {
    if (fitToContent) {
      if (useAutoHeight) {
        return {
          width: '100%',
          maxHeight: maxHeight,
        } as const;
      }
      return {
        width: '100%',
        height: fittedHeight,
        maxHeight,
      } as const;
    }
    return { width: '100%', height } as const;
  }, [fitToContent, useAutoHeight, fittedHeight, maxHeight, height]);

  return (
    <div
      className={`ag-theme-alpine sparkpay-payroll-ag-grid ${
        loading ? 'sparkpay-payroll-ag-grid--loading' : ''
      }${fitToContent ? ' sparkpay-payroll-ag-grid--fit' : ''}`}
      style={containerStyle}
    >
      <AgGridReact<PayrollAgGridRow>
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={(p) => p.data.id}
        context={{ currency }}
        rowSelection="multiple"
        suppressRowClickSelection
        animateRows={false}
        domLayout={useAutoHeight ? 'autoHeight' : 'normal'}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        rowBuffer={20}
        suppressCellFocus={mode === 'view'}
      />
    </div>
  );
};
