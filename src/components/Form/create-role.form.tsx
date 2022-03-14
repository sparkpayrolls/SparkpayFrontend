import { Button } from '../Button/Button.component';
import { InputV2 } from '../Input/Input.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export const CreateRoleForm = () => {
  return (
    <form className="create-role-form">
      <InputV2 label="Name" placeholder="Name" />

      <div className="create-role-form__permissions">
        <p>Permissions</p>
        <TableLayout>
          <TableV2>
            <thead>
              <tr>
                <th></th>
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Payroll</td>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            </tbody>
          </TableV2>
        </TableLayout>
      </div>

      <Button type="submit" label="Save Role" primary />
    </form>
  );
};
