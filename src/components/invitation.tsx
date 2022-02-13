import type { NextPage } from 'next';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { StatusChip } from '../../src/components/StatusChip/status-chip.component';
import {KebabMenu } from '../../src/components/KebabMenu/KebabMenu.component';
import withPermission from 'src/helpers/HOC/withPermission';
import {Pagination} from "../../src/components/Pagination/pagination.component";

const InvitationTab: NextPage = () => {
  const KebabWithPermissions = withPermission(KebabMenu, ['Employee', 'write']);

  return (
    <>
    <div>
    <p className="table-component__table-title"> 4 Invitations</p>
    <div className="organisation__invitation-table">
      <TableLayout>
        <TableV2>
          <thead>
            <tr>
              <th>Organization</th>
              <th>Role</th>
              <th>Email Adress</th>
              <th>Phone Number</th>
              <th>Country</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="identity">
                  <span className="identity__initial">c</span>
                  <span className="">christechnology</span>
                </span>
              </td>
              <td>owner</td>
              <td>kolajoelizabeth@gmail.com</td>
              <td>0708 888 2202</td>
              <td>Nigeria</td>
              <td>
                <span className="d-flex justify-content-space-between align-items-center">
                  <StatusChip status="successful" />
                  <KebabWithPermissions
                    items={[
                      {
                        value: "accept",
                      },
                      {
                        value: "decline",
                      },
                      {
                        value: "delete",
                      },
                    ]}
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </TableV2>
      </TableLayout>
    </div>
      <Pagination/>
    </div>
    </>
  );
};

export default InvitationTab;
