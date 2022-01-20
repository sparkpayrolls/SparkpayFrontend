import DashboardLayoutV2 from '../../src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '@/components/Button/Button.component';
import {
  DeleteSVG,
  EditableSVG,
  PlusSvg,
} from '../../src/components/svg/index';

function EmployeeList() {
  return (
    <DashboardLayoutV2 itle="Employee list" href="/employees">
      <div className="employee-list">
        <div className="employee-list__header">
          <h3 className="employee-list__title">Employee List</h3>

          {/* //TODO Display Kebab menu on mobile screens */}
          <div className="employee-list__actions">
            <button className="employee-list__actions--del-btn">
              <DeleteSVG />
            </button>
            <button className="employee-list__actions--add-btn">
              <PlusSvg /> Add Row
            </button>
            <Button
              element="a"
              href="#"
              type="button"
              label="Proceed"
              primary
            />
          </div>
        </div>

        <div className="employee-list__table-container">
          <table className="employee-list__table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Salary Amount (₦)</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <EditableField type="text">Esther</EditableField>
                </td>

                <td>
                  <EditableField type="text">Howard</EditableField>
                </td>

                <td>
                  <EditableField type="email">
                    estherhoward@gmail.com
                  </EditableField>
                </td>
                <td>
                  <EditableField type="text">₦ 120,000</EditableField>
                </td>
                <td>kebab</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayoutV2>
  );
}

const EditableField = (props) => {
  const { children, type } = props;

  return (
    <div className="employee-list__input-container">
      <input type={type} value={children} />
      <span>
        <EditableSVG />
      </span>
    </div>
  );
};

export default EmployeeList;
