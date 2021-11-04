import type { NextPage } from 'next';
import Image from 'next/image';
import SuccessfulIcon from '../../public/svgs/successful.svg';
import BackIcon from '../../public/svgs/backicon.svg';

// TODO please fix page styling
const payDetails: NextPage = () => {
  return (
    <div className="payroll-details-section">
      <aside className="payroll-details-section__payroll-details-sidebar"></aside>

      <section className=" payroll-details-section__payroll-details-settings">
        <section className=" payroll-details-section__back-icon">
          <a href="/payroll">
            <Image src={BackIcon} alt="back-icon" />
          </a>
          <div className="payroll-details-section__payroll-details-header">
            <p className="payroll-details-section__payroll-header">
              Payroll Details{' '}
              <span className="payroll-details-section__payroll-wallet">
                (wallet balance ₦ 120,000)
              </span>
            </p>
            <p className="payroll-details-section__payroll-cost">
              Total Payroll Cost:{' '}
              <span className="payroll-details-section__payroll-amount">
                ₦ 120,000
              </span>
            </p>
          </div>
        </section>
        <div className="payroll-details-section__payroll-settings-details">
          <section className="employee-details__employee-settings-flex">
            <div>
              <p className="employee-details__employee-details-text">
                Payroll Size
              </p>
              <p className="employee-details__employee-details-text-one">20</p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Unit Cost
              </p>
              <p className="employee-details__employee-details-text-one">
                ₦ 50
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Wallet Balance
              </p>
              <p className="employee-details__employee-details-text-one">
                ₦ 500,000
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Payout Date
              </p>
              <p className="employee-details__employee-details-text-one">
                May 27, 2020 |{' '}
                <span className="payroll-section__employee_pay-time">
                  12:38 PM
                </span>
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">Month</p>
              <p className="employee-details__employee-details-text-one">
                october
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">Status</p>
              <div className="payroll-details-section__employee-status">
                <Image src={SuccessfulIcon} alt="successful-icon" />
                <p className="payroll-section__payroll-success-text">
                  Successful
                </p>
              </div>
            </div>
          </section>

          <section className="payroll-details-section__payroll-breakdown">
            <p className="payroll-details-section__payroll-breakdown-text">
              Payroll Breakdown
            </p>
            <table>
              <tr className="payroll-section__employeeTitle">
                <span>
                  <input
                    type="checkbox"
                    className="payroll-section__employee_Input"
                    value="checkinputOne"
                  />
                  <th>Name</th>
                </span>
                <th>Salary Amount (₦) </th>
                <th>Net Amount (₦) </th>
                <th>Bonus Amount (₦) </th>
                <th>Amount Taxed (₦) </th>
                <th>Pension Amount (₦) </th>
                <th>Other Deductions (₦) </th>
              </tr>
              <tr className="employee-section__employeeData">
                <span>
                  <input
                    type="checkbox"
                    className="employee-section__employee_Input"
                    value="checkInputThree"
                  />
                  <td>Name here</td>
                </span>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
              </tr>
              <tr className="employee-section__employeeData">
                <span>
                  <input
                    type="checkbox"
                    className="employee-section__employee_Input"
                    value="checkInputThree"
                  />
                  <td>Name here</td>
                </span>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
              </tr>
              <tr className="employee-section__employeeData">
                <span>
                  <input
                    type="checkbox"
                    className="employee-section__employee_Input"
                    value="checkInputThree"
                  />
                  <td>Name here</td>
                </span>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
              </tr>
              <tr className="employee-section__employeeData">
                <span>
                  <input
                    type="checkbox"
                    className="employee-section__employee_Input"
                    value="checkInputThree"
                  />
                  <td>Name here</td>
                </span>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
              </tr>
              {/* <hr /> */}

              <tr className="payroll-details-section__payroll-sum-total">
                <td>Total</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
              </tr>
              <p className="payroll-details-section__payroll-cost-total">
                Total Payroll Cost:
                <span className="payroll-details-section__payroll-cost-amount">
                  ₦ 120,000
                </span>
              </p>
            </table>
          </section>
        </div>
      </section>
    </div>
  );
};

export default payDetails;
