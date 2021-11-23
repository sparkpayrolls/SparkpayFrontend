import Image from 'next/image';
import Link from 'next/link';
import SearchInput from '../../../public/svgs/search.svg';
import avatar from '../../../public/images/avatar-img.png';
import { MoreMenuSVG } from '../svg';

export const EmployeeGroup = () => {
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
                    src={avatar}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image src={avatar} alt="" className="employee-image" />
                  <Image
                    src={avatar}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image
                    src={avatar}
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
