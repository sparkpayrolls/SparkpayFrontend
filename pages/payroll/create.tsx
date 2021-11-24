import { EditSVG } from '@/components/svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { NextPage } from 'next';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';

const CreatePayroll: NextPage = () => {
  return (
    <DashboardLayoutV2 title="Create payroll" href="/payroll">
      <div className="create-payroll-page">
        <TableLayout
          title={<WalletBalanceChip title="Payroll" balance="₦ 120,000" />}
          buttons={[{ label: 'Proceed', href: '/payroll', primary: true }]}
        >
          <table className="table payroll-create-table">
            <thead>
              <tr>
                <CheckboxTableColumn element="th">Name</CheckboxTableColumn>
                <th>Salary (₦)</th>
                <th>Net Pay (₦)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <CheckboxTableColumn element="td">
                  Opeyemi Peter
                </CheckboxTableColumn>

                <td>
                  <span className="input-table-column">
                    <input type="text" className="input-table-column__input" />

                    <span className="input-table-column__icon">
                      <EditSVG />
                    </span>
                  </span>
                </td>

                <td>₦ 120,000</td>
              </tr>
            </tbody>
          </table>
        </TableLayout>

        <div className="create-payroll-page__totals">
          <div className="create-payroll-page__totals__items">
            <div className="create-payroll-page__totals__items__item">
              Total
            </div>
            <div className="create-payroll-page__totals__items__item">
              ₦ 120,000
            </div>
            <div className="create-payroll-page__totals__items__item">
              ₦ 120,000
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(CreatePayroll, ['Payroll', 'write']);
