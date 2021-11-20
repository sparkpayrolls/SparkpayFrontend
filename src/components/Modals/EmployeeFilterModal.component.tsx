import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { MultiSelectInput } from '../Input/seletct-input';
import { ModalLayout } from './ModalLayout.component';
import { Range } from 'react-input-range';
import { useState } from 'react';
import { Button } from '../Button/Button.component';
import { RangeInput } from '../Input/range-input.component';
import { IEmployeeFilter, IEmployeeFilterModal } from '../types';
import { Util } from 'src/helpers/util';

export const EmployeeFilterModal = NiceModal.create(
  (props: IEmployeeFilterModal) => {
    const [salaryRange, setSalaryRange] = useState(
      props.filter?.salaryRange?.split('-')?.reduce(
        (acc, cur) => {
          if (acc.min > 0) {
            acc.max = +cur;
          } else {
            acc.max = +cur;
          }

          return acc;
        },
        { min: 0, max: 0 },
      ) || {
        min: 100000,
        max: 750000,
      },
    );
    const [salaryRangeMax, setSalaryRangeMax] = useState(1000000);
    const [filter, setFilter] = useState<IEmployeeFilter>({});

    const handleSelect = (selectedItems: Record<string, unknown>[]) => {
      if (!selectedItems.length) {
        // eslint-disable-next-line no-unused-vars
        const { status, ...others } = filter;
        return setFilter({ ...others });
      }

      setFilter({
        ...filter,
        status: selectedItems.map((item) => item.value as string).join(','),
      });
    };

    const handleExit = (modal: NiceModalHandler) => {
      if (props.onFilter) {
        props.onFilter(filter);
      }
      modal.hide();
      setTimeout(modal.remove, 500);
    };

    return (
      <ModalLayout title="Filter by">
        {(modal) => {
          return (
            <div className="employee-filter-modal">
              <div className="employee-filter-modal__section">
                <MultiSelectInput
                  label="Employee status"
                  options={[
                    { displayValue: 'Active', id: 1, value: 'active' },
                    {
                      displayValue: 'Deactivated',
                      id: 2,
                      value: 'deactivated',
                    },
                  ]}
                  onSelect={handleSelect}
                  onRemove={handleSelect}
                  selectedValues={
                    props.filter?.status?.split(',').map((value, id) => ({
                      displayValue: Util.capitalize(value),
                      id,
                      value,
                    })) || []
                  }
                  displayValue="displayValue"
                />
              </div>

              <div className="employee-filter-modal__section">
                <RangeInput
                  label="Salary range"
                  maxValue={salaryRangeMax}
                  minValue={100}
                  formatLabel={(val) => val.toLocaleString()}
                  value={salaryRange}
                  onChange={(val) => {
                    const value = val as Range;
                    if (value.max >= salaryRangeMax - 150000) {
                      setSalaryRangeMax(salaryRangeMax + 500000);
                    }
                    if (value.max < 1000000 - 150000) {
                      setSalaryRangeMax(1000000);
                    }
                    setSalaryRange(value as Range);
                    setFilter({
                      ...filter,
                      salaryRange: `${value.min}-${value.max}`,
                    });
                  }}
                />
              </div>

              <div className="employee-filter-modal__btn">
                <Button
                  label="Apply filter"
                  onClick={() => {
                    handleExit(modal);
                  }}
                  type="button"
                  primary
                />
                <Button
                  label="Clear filter"
                  onClick={() => {
                    setFilter({});
                    handleExit(modal);
                  }}
                  type="button"
                />
              </div>
            </div>
          );
        }}
      </ModalLayout>
    );
  },
);

NiceModal.register('employee-filter-modal', EmployeeFilterModal);
