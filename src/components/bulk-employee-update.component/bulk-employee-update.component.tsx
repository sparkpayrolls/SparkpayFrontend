import 'jspreadsheet-ce/dist/jspreadsheet.css';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '../Button/Button.component';
import { SearchForm } from '../Form/search.form';
import { useBulkEmployeeUpdateContext } from './hooks';

export const BulkEmployeeUpdate = () => {
  const {
    handleSubmitClick,
    isSubmitting,
    hasChanges,
    loading,
    sheetRef,
    searchQuery,
    setSearchQuery,
  } = useBulkEmployeeUpdateContext();

  return (
    <DashboardLayoutV2
      loading={loading}
      title="Update employees"
      href="/employees"
    >
      <div className="employee-list__header">
        <div className="employee-list__actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <SearchForm
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="button"
            disabled={isSubmitting || !hasChanges}
            showSpinner={isSubmitting}
            onClick={handleSubmitClick}
            label="Update Employees"
            primary
          />
        </div>
      </div>

      <div style={{ maxWidth: '100%', height: '100%' }} ref={sheetRef}></div>
    </DashboardLayoutV2>
  );
};
