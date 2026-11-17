import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  MutableRefObject,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { CustomCellEditorProps } from 'ag-grid-react';
import type {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
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

const parseMoneyInput = (raw: unknown) => {
  const next =
    typeof raw === 'number'
      ? raw
      : Number(String(raw ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(next) && next >= 0 ? next : null;
};

type MoneyPointerDown = {
  clientX: number;
  cellLeft: number;
  paddingLeft: number;
  font: string;
  formattedText: string;
  at: number;
};

/** Captured on mousedown so the editor can place the caret at the click. */
let lastMoneyPointerDown: MoneyPointerDown | null = null;

const measureCaretIndex = (
  text: string,
  font: string,
  localX: number,
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return text.length;
  ctx.font = font;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i <= text.length; i += 1) {
    const width = ctx.measureText(text.slice(0, i)).width;
    const dist = Math.abs(width - localX);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
};

const caretIndexFromClick = (
  input: HTMLInputElement,
  pointer: MoneyPointerDown | null,
) => {
  const value = input.value;
  // Ignore stale pointers (e.g. F2 / Enter edit after an older click).
  if (!pointer || !value || Date.now() - pointer.at > 750) {
    return value.length;
  }

  // X relative to where the formatted cell text started.
  const localX = pointer.clientX - pointer.cellLeft - pointer.paddingLeft;
  const formatted = pointer.formattedText || value;
  const fmtIdx = measureCaretIndex(formatted, pointer.font, localX);

  // Map formatted caret → raw editor index (skip currency, commas, spaces).
  let rawIdx = 0;
  for (let i = 0; i < fmtIdx && i < formatted.length; i += 1) {
    if (/[0-9.-]/.test(formatted[i]!)) rawIdx += 1;
  }
  return Math.max(0, Math.min(value.length, rawIdx));
};

const captureMoneyPointerDown = (event: MouseEvent) => {
  const cell = (event.target as HTMLElement | null)?.closest?.(
    '.ag-cell',
  ) as HTMLElement | null;
  if (!cell) return;
  const colId = cell.getAttribute('col-id');
  if (colId !== 'salary' && colId !== 'netSalary') return;

  const rect = cell.getBoundingClientRect();
  const style = window.getComputedStyle(cell);
  lastMoneyPointerDown = {
    clientX: event.clientX,
    cellLeft: rect.left,
    paddingLeft: parseFloat(style.paddingLeft) || 0,
    font: style.font,
    formattedText: (cell.textContent || '').trim(),
    at: Date.now(),
  };
};

/**
 * AG Grid React 31 tracks editor value via onValueChange (not getValue/ref).
 * Keeps the existing amount and places a caret — no wipe-on-type replace.
 * Commits numbers (not strings) so number cellDataType accepts the value.
 */
const MoneyCellEditor = (
  props: CustomCellEditorProps<PayrollAgGridRow, number | string | null>,
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const display = props.value == null ? '' : String(props.value);
  const pointerAtOpen = useRef(lastMoneyPointerDown);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const pointer = pointerAtOpen.current;
    lastMoneyPointerDown = null;

    // Double rAF: wait until the input is laid out in the cell.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.focus();
        const caret = caretIndexFromClick(el, pointer);
        try {
          el.setSelectionRange(caret, caret);
        } catch {
          // Some browsers throw if the input type rejects selection.
        }
      });
    });
  }, []);

  return (
    <input
      ref={inputRef}
      className="payroll-ag-grid__money-editor"
      type="text"
      inputMode="decimal"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        // AG Grid number columns reject string values in setValue/checkType.
        if (raw.trim() === '') {
          props.onValueChange(null);
          return;
        }
        const parsed = parseMoneyInput(raw);
        props.onValueChange(parsed ?? raw);
      }}
    />
  );
};
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

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<PayrollAgGridRow>) => {
      const field = event.colDef.field;
      if (field !== 'salary' && field !== 'netSalary') return;
      const next = parseMoneyInput(event.newValue);
      if (next == null || !event.data) return;
      if (field === 'salary') {
        onSalaryChange?.(event.data.id, next);
      } else {
        onNetSalaryChange?.(event.data.id, next);
      }
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
        cellDataType: 'number',
        valueFormatter: moneyValue,
        valueParser: (p) => parseMoneyInput(p.newValue) ?? p.oldValue,
        editable: mode === 'create',
        singleClickEdit: mode === 'create',
        cellEditor: MoneyCellEditor,
        suppressKeyboardEvent: suppressMoneyReplaceOnKey,
        cellClass: mode === 'create' ? 'payroll-ag-grid__editable' : undefined,
      },
      {
        headerName: 'Net Salary',
        field: 'netSalary',
        minWidth: 130,
        cellDataType: 'number',
        valueFormatter: moneyValue,
        valueParser: (p) => parseMoneyInput(p.newValue) ?? p.oldValue,
        editable: mode === 'create',
        singleClickEdit: mode === 'create',
        cellEditor: MoneyCellEditor,
        suppressKeyboardEvent: suppressMoneyReplaceOnKey,
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

  const gridWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = gridWrapRef.current;
    if (!node || mode !== 'create') return undefined;
    // Capture before AG Grid handles the event so coordinates are reliable.
    node.addEventListener('mousedown', captureMoneyPointerDown, true);
    return () => {
      node.removeEventListener('mousedown', captureMoneyPointerDown, true);
    };
  }, [mode]);

  return (
    <div
      ref={gridWrapRef}
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
        // Required so React cell editors commit via onValueChange.
        reactiveCustomComponents
        stopEditingWhenCellsLoseFocus
        domLayout={useAutoHeight ? 'autoHeight' : 'normal'}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onCellValueChanged={onCellValueChanged}
        rowBuffer={20}
        suppressCellFocus={mode === 'view'}
      />
    </div>
  );
};
