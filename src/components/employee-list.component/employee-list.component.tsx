import { PlusSvg } from '@/components/svg';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '../Button/Button.component';
import { useEmployeeListContext } from './hooks';

export const EmployeeList = () => {
  const {
    handleAddRowClick,
    handleSubmitClick,
    isSubmitting,
    loading,
    sheetRef,
  } = useEmployeeListContext();

  return (
    <DashboardLayoutV2
      loading={loading}
      title="Add employees"
      href="/employees"
    >
      <div className="employee-list__header">
        {/* <h3 className="employee-list__title">Add employees</h3> */}

        <div className="employee-list__actions">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAddRowClick}
            className="employee-list__actions--add-btn"
          >
            <PlusSvg /> Add Rows
          </button>
          <Button
            type="button"
            disabled={isSubmitting}
            showSpinner={isSubmitting}
            onClick={handleSubmitClick}
            label="Add Employees"
            primary
          />
        </div>
      </div>

      <div style={{ maxWidth: '100%', height: '100%' }} ref={sheetRef}></div>
    </DashboardLayoutV2>
  );
};
