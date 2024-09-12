import { Switch } from 'antd';
import { SelectInput } from '../Input/seletct-input';
import { DownArrow } from '../svg';
import { StatusChip } from '../StatusChip/status-chip.component';

import { Table } from '../Table/Table.component';

// export const Thead= ()=> return(

// ) ;
const ViewEmployeesTable = () => {
  return (
    <div className="view-employees__tax__bottom">
      <Table
        isNotSearchable
        headerRow={[
          <span key="name_th_content">Full names</span>,
          <span key="name_th_content">Salary</span>,
          <span key="name_th_content">Tax ID</span>,
          <span key="name_th_content">Tax State</span>,
          <span key="name_th_content">BVN</span>,
          <span key="name_th_content">Status</span>,
        ]}
      >
        {() => {
          return (
            <tbody>
              <tr>
                <td>
                  <div className="view-employees__tax__bottom__cont">
                    <input type="checkbox" />
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__cont">
                    <p>Bessie Cooper</p>
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__cont">
                    <p>₦ 40,000</p>
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__input">
                    <input
                      type="text"
                      defaultValue={'123-344-123'}
                      maxLength={11}
                    />
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__cont">
                    <div className="view-employees__tax__bottom__cont--drop">
                      <SelectInput
                        applyTableStyle={true}
                        customIcon={<DownArrow />}
                        placeholder="Nigeria"
                        showSearch
                        options={[
                          'Abia',
                          'Adamawa',
                          'Akwa Ibom',
                          'Anambra',
                          'Bauchi',
                          'Bayelsa',
                          'Benue',
                          'Borno',
                          'Cross River',
                          'Delta',
                          'Ebonyi',
                          'Edo',
                          'Ekiti',
                          'Enugu',
                          'Gombe',
                          'Imo',
                          'Jigawa',
                          'Kaduna',
                          'Kano',
                          'Katsina',
                          'Kebbi',
                          'Kogi',
                          'Kwara',
                          'Lagos',
                          'Nasarawa',
                          'Niger',
                          'Ogun',
                          'Ondo',
                          'Osun',
                          'Oyo',
                          'Plateau',
                          'Rivers',
                          'Sokoto',
                          'Taraba',
                          'Yobe',
                          'Zamfara',
                        ]}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__input">
                    <input
                      type="text"
                      defaultValue={'123-344-123'}
                      maxLength={11}
                    />
                  </div>
                </td>
                <td>
                  <div className="view-employees__tax__bottom__cont">
                    <div className="view-employees__tax__bottom-status">
                      <StatusChip status={'Enabled'} />
                      <Switch className="organization-menu__dropdown__item__switch" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          );
        }}
      </Table>
      {/* <table>
        <tr>
          <th colSpan={2}>
            <div className="view-employees__tax__bottom__cont--flex">
              <div className="view-employees__tax__bottom__cont--flex-space">
                <input type="checkbox" />
                <span>
                  <DownArrow />
                </span>
              </div>
              <p>Full names</p>
            </div>
          </th>
          <th>Salary</th>
          <th>Tax ID</th>
          <th>Tax State</th>
          <th>BVN</th>
          <th>Status</th>
        </tr>

        <tr>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <input type="checkbox" />
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <p>Bessie Cooper</p>
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <p>₦ 40,000</p>
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__input">
              <input type="text" defaultValue={'123-344-123'} maxLength={11} />
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <div className="view-employees__tax__bottom__cont--drop">
                <SelectInput
                  applyTableStyle={true}
                  customIcon={<DownArrow />}
                  placeholder="Nigeria"
                  showSearch
                  options={[
                    'Abia',
                    'Adamawa',
                    'Akwa Ibom',
                    'Anambra',
                    'Bauchi',
                    'Bayelsa',
                    'Benue',
                    'Borno',
                    'Cross River',
                    'Delta',
                    'Ebonyi',
                    'Edo',
                    'Ekiti',
                    'Enugu',
                    'Gombe',
                    'Imo',
                    'Jigawa',
                    'Kaduna',
                    'Kano',
                    'Katsina',
                    'Kebbi',
                    'Kogi',
                    'Kwara',
                    'Lagos',
                    'Nasarawa',
                    'Niger',
                    'Ogun',
                    'Ondo',
                    'Osun',
                    'Oyo',
                    'Plateau',
                    'Rivers',
                    'Sokoto',
                    'Taraba',
                    'Yobe',
                    'Zamfara',
                  ]}
                />
              </div>
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__input">
              <input type="text" defaultValue={'123-344-123'} maxLength={11} />
            </div>
          </td>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <div className="view-employees__tax__bottom-status">
                <StatusChip status={'Enabled'} />
                <Switch className="organization-menu__dropdown__item__switch" />
              </div>
            </div>
          </td>
        </tr>
      </table>
      <div>
        <p>showing</p> <p>next</p>{' '}
      </div> */}
    </div>
  );
};
export default ViewEmployeesTable;
