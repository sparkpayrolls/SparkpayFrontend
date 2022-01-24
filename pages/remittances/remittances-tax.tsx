import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import { Radio } from 'antd';
import Image from 'next/image';
import RemittancesInbox from '../../public/svgs/inbox.svg';
import backicon from '../../public/svgs/back-icon.svg';
import Link from 'next/link';

const RemittancesTax: NextPage = () => {
  return (
    <DashboardLayout pageTitle="remittances-tax">
      <div className="remittances-tax-page">
        <div className="remittances-tax-section">
          <div className="group-details__header-content">
            <div className="group-details__group-detail-title-section">
              <Link href="/remittances">
                <a>
                  <Image
                    src={backicon}
                    alt="group-details-image"
                    className="group-details__prev-icon"
                  />
                </a>
              </Link>
              <h5 className="group-details__group-detail-title">Tax</h5>
            </div>
            <Button
              label={<>{'Proceed'}</>}
              element="a"
              className="payroll-section__submit-btn"
              primary
              type="submit"
            />
          </div>
          <div className="remittances-tax-page__tax-details">
          <div className="remittances-tax-page__remittances-options-details">
            <div className="remittances-tax-page__remittances-options-group">
            <div  className="remittances-tax-page__remittances-header">
              <h2>Required Actions</h2>
              <p>You can only select one at a time</p>
            </div>
              <div className="remittances-tax-page__remittances-options">
              <Radio.Group name="uploadType">
                <Radio value="Disable">Disable</Radio>
                <br />
                <Radio value="Calculate">Calculate</Radio>
                <br />
                <Radio value="Deduct">Deduct</Radio>
                <br />
                <Radio value="Remit">Remit</Radio>
              </Radio.Group>
              </div>
            </div>
          </div>
            <div className="remittances-tax-page__General-information">
            <div className="remittances-tax-page__General-information-header">
              <h2>General Info</h2>
              <p>Enter general info to calculate taxes</p>
            </div>
            <div className="remittances-tax-page__General-information-image">
              <div className="remittances-tax-page__remittances-inbox-image">
                <Image src={RemittancesInbox} alt="remittances-inbox" />
              </div>
                <p className="text-center">
                  Select one of the required Actions
                </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RemittancesTax;
