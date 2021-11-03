import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '../../src/components/Button/Button';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';

import Plus from '../../public/svgs/add-fill.svg';
import SearchInput from '../../public/svgs/search.svg';
import Filter from '../../public/svgs/filter.svg';
import EmployeeInfo from '../../public/svgs/employeeIcon.svg';
import Inbox from '../../public/svgs/employee-inbox.svg';
import avatar1 from '../../public/svgs/Avatar1.svg';
import avatar2 from '../../public/svgs/Avatar2.svg';
import avatar3 from '../../public/svgs/Avatar3.svg';
import avatar4 from '../../public/svgs/Avatar4.svg';

const Employee: NextPage = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const handleTab1 = () => {
    setActiveTab('tab1');
  };
  const handleTab2 = () => {
    setActiveTab('tab2');
  };
  return (
    <DashboardLayout pageTitle="Employees">
      <div className="employee-section">
        <div className=" employee-section__details">
          <div className="employee-section__head">
            <h1 className="employee-section__title">Employee Settings</h1>

            <div className="employee-section__employee-button">
              <Button
                label=" Create Employee group"
                onClick={() => {}}
                className="employee-section__employee-button1"
                type="submit"
              />
              <Button
                label={
                  <>
                    <Image src={Plus} alt="plus icon"></Image> {'Add Employee'}
                  </>
                }
                onClick={() => {}}
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>
          </div>
          <div className="employee-section__tabs">
            {/* Tab nav */}
            <ul className="employee-section__tab-nav">
              <li
                className={
                  activeTab === 'tab1' ? 'employee-section__active' : ''
                }
                onClick={handleTab1}
              >
                Employees
              </li>
              <li
                className={
                  activeTab === 'tab2' ? 'employee-section__active' : ''
                }
                onClick={handleTab2}
              >
                Group
              </li>
            </ul>
          </div>
          <div className="employee-section__tab-content">
            {activeTab === 'tab1' ? <EmployeeTab /> : <EmployeeGroup />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const EmployeeTab = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <div className="payroll-section">
        <div className="employee-section__employee-tab">
          <div className="employee-section__employeeSearch">
            <div className="employee-section__employeeHeader">
              {/* <p>30 Employee(s)</p> */}
              <p>0 Employee(s)</p>
            </div>
            <div className="employee-section__searchInput">
              <div className="employee-section__searchIcon">
                <div>
                  <input
                    type="text"
                    placeholder="Search by name"
                    className="employee-section__search"
                  />
                </div>
                <div className="employee-section__searchImage">
                  <Image src={SearchInput} alt="search-image" />
                </div>
                <div className="employee-section__searchIcon">
                  <div>
                    <input
                      type="text"
                      placeholder="Filter"
                      className="employee-section__filter"
                    />
                  </div>
                  <div className="employee-section__searchImage">
                    <Image src={Filter} alt="filter-image" />
                  </div>
                  <span className="employee-section__employeeInfo">
                    <Image src={EmployeeInfo} alt="info-image" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <table>
            <tr className="employee-section__employeeTitle">
              <span>
                <input
                  type="checkbox"
                  className="employee-section__employee_Input"
                  value="checkinputOne"
                />
                <span className="employee-section__employee-name">
                  {' '}
                  <th>Name</th>
                </span>
              </span>
              <th>Email Address</th>
              <th>Amount (₦) </th>
              <th>Payout Method</th>
              <th>Group</th>
              <th>Date Added</th>
            </tr>
          </table>

          <div className="employee-section__employee-inbox">
            <Image src={Inbox} alt="inbox icon" />
            <p>No employee yet</p>
          </div>

          <div className="employee-section__nextPages">
            <p>
              Showing <span className="employee">Page 1 of 10</span>
            </p>

            <div className="employee-section__prev_next_pages">
              <p>Prev</p>
              <p>1</p>
              <p>2</p>
              <p>Next</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EmployeeGroup = () => {
  return (
    <div className="employee-group">
      <div className="employee-section__employeeSearch">
        <div className="employee-section__employeeHeader">
          {/* <p>30 Employee(s)</p> */}
          <p>0 Employee(s)</p>
        </div>
        <div className="employee-section__searchInput">
          <div className="employee-section__searchIcon">
            <div>
              <input
                type="text"
                placeholder="Search by name"
                className="employee-section__search"
              />
            </div>
            <div className="employee-section__searchImage">
              <Image src={SearchInput} alt="search-image" />
            </div>
          </div>
        </div>
      </div>

      <section className="employee-group__employee-group-cards">
        <div className="employee-group__section">
          <div className="employee-group__group-title">
            <h5 className="employee-group__header-title">Group Name Here</h5>

            <button className="employee-group__more-menu">
              <MoreMenuSVG />
            </button>
          </div>

          <Link href="/employees/group-details">
            <a className="employee-group__content">
              <p className="employee-group__date-created-name">Date Created</p>
              <p className="employee-group__date-time-created">
                September 16, 2021 | 12:40 PM{' '}
              </p>
              <hr />

              <p className="employee-group__salary-title">Common Salary</p>

              <div className="employee-group__salary-amount-section">
                <p className="employee-group__salary-amount">₦ 200,000</p>
                <div className="employee-group__group-images">
                  <Image
                    src={avatar1}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image src={avatar2} alt="" className="employee-image" />
                  <Image
                    src={avatar3}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image
                    src={avatar4}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                </div>
              </div>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};
export default withAuth(Employee);

const MoreMenuSVG = () => (
  <svg
    width="3"
    height="12"
    viewBox="0 0 3 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.30621 0.5C0.633984 0.5 0.0839844 1.05 0.0839844 1.72222C0.0839844 2.39444 0.633984 2.94444 1.30621 2.94444C1.97843 2.94444 2.52843 2.39444 2.52843 1.72222C2.52843 1.05 1.97843 0.5 1.30621 0.5ZM1.30621 9.05556C0.633984 9.05556 0.0839844 9.60556 0.0839844 10.2778C0.0839844 10.95 0.633984 11.5 1.30621 11.5C1.97843 11.5 2.52843 10.95 2.52843 10.2778C2.52843 9.60556 1.97843 9.05556 1.30621 9.05556ZM1.30621 4.77778C0.633984 4.77778 0.0839844 5.32778 0.0839844 6C0.0839844 6.67222 0.633984 7.22222 1.30621 7.22222C1.97843 7.22222 2.52843 6.67222 2.52843 6C2.52843 5.32778 1.97843 4.77778 1.30621 4.77778Z"
      fill="#0D0F11"
    />
  </svg>
);
