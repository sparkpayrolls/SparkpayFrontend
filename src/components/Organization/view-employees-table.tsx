import { Switch } from 'antd';
import { SelectInput } from '../Input/seletct-input';
import { DownArrow } from '../svg';

const ViewEmployeesTable = () => {
  return (
    <div className="view-employees__tax__bottom">
      <table>
        <tr>
          <th>
            <div>
              <div className="view-employees__tax__bottom__check-box">
                <input type="checkbox" name="" id="" />
              </div>
            </div>
          </th>
          <th>FullName</th>
          <th>Salary</th>
          <th>Tax ID</th>
          <th>Tax State</th>
          <th>BVN</th>
          <th>Status</th>
        </tr>

        <tr>
          <td>
            <div className="view-employees__tax__bottom__cont">
              <div className="view-employees__tax__bottom__check-box">
                <input type="checkbox" name="" id="" />
              </div>
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
              <SelectInput
                applyTableStyle={true}
                customIcon={<DownArrow />}
                placeholder="Nigeria"
                options={['hooder', 'looder']}
              />
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
                <p>Enabled</p>
                <Switch className="organization-menu__dropdown__item__switch" />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
export default ViewEmployeesTable;
