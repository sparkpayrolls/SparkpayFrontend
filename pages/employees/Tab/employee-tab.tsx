import { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import SearchInput from '../../../public/svgs/search.svg';
import Filter from '../../../public/svgs/filter.svg';
import EmployeeInfo from '../../../public/svgs/employeeIcon.svg';
import Inbox from '../../../public/svgs/employee-inbox.svg';
// import { toast } from 'react-toastify';

const EmployeeTab: NextPage = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>Employee Tab</title>
      </Head>
      <div className="employee-section">
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

export default EmployeeTab;
