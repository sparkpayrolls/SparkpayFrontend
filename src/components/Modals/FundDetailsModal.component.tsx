import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import Image from 'next/image';
import { ModalLayout } from './ModalLayout.component';
import FundCopyImage from '../../../public/svgs/copy.svg';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import BackIcon from '../../../public/svgs/backicon.svg';
import { WalletBilling } from '../types';
// import { singleEmployeeUploadValidationSchema } from 'src/helpers/validation';
// import { AddEmployee, ISingleEmployeeUpload } from '../types';
// import { HttpError } from 'src/api/repo/http.error';
// import { toast } from 'react-toastify';
// import { $api } from 'src/api';

export const FundDetailsModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Fund Wallet">
      {() => {
        return <FundDetailsForm />;
      }}
    </ModalLayout>
  );
});

const WalletCard = ({
  title,
  amount,
  bank,
}: {
  title: string;
  amount: string;
  bank: string;
}) => {
  return (
    <div className="fund-wallet-modal">
      <div className="fund-wallet-modal__fund-card">
        <div className="fund-wallet-modal__fund-title-text">
          <p className="fund-wallet-modal__fund-amount-title">{title}</p>
          <p className="fund-wallet-modal__fund-amount-transfer">{amount}</p>
          <p className="fund-wallet-modal__fund-bank-transfer">{bank}</p>
        </div>
        <div className="fund-wallet-modal__fund-bank-copy-image">
          <Image src={FundCopyImage} alt="back-icon" />
          <p className="fund-wallet-modal__fund-bank-copy-text">copy</p>
        </div>
      </div>
      <p className="fund-wallet-modal__fund-bank-expire">Expire in 19:50</p>
    </div>
  );
};
const FundDetailsForm = () => {
  return (
    <div className="fund-wallet-modal">
      <div className="fund-wallet-modal__backIcon">
        <a href="./wallet">
          <Image src={BackIcon} alt="back-icon" />
        </a>
        <p className="fund-wallet-modal__back-text">Back</p>
      </div>

      <Formik
        initialValues={{
          amount: '',
        }}
        onSubmit={(...args) => {
          console.log(args);
        }}
        //   // validationSchema={singleEmployeeUploadValidationSchema}
      >
        {(props: FormikProps<WalletBilling>) => {
          const { handleChange, handleSubmit } = props;
          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              <div className="single-employee-upload-form__section fund-wallet-modal__fund-amount">
                <Input
                  type="text"
                  label=" Amount"
                  placeholder=" Amount (₦)"
                  name="salary"
                  onChange={handleChange}
                />
              </div>
              <p className="fund-wallet-modal__fund-transfer-text">
                Transfer this exact amount into this account number via your
                Internet/Mobile Banking platform.
              </p>

              <WalletCard
                title="Pay with Bank Transfer"
                amount="000 3330 222"
                bank="Access Bank"
              />
              <div className="form__submit-button">
                <Button
                  type="submit"
                  label="I have Paid"
                  className="form__submit-button form__submit-button--full-width"
                  primary
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
