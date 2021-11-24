import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { WalletBilling } from '../types';
import { FundDetailsModal } from './FundDetailsModal.component';
export const WalletBillingModal = NiceModal.create(() => { 
  return (
    <ModalLayout title="Fund Wallet">
      {(modal) => {
        return <WalletBillingForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const WalletBillingForm = ( {modal}:{ modal: NiceModalHandler }) => {
  return (
    <div className="add-employee-modal">
      <div className="add-employee-modal__upload-type-input">
        <label>Select Payment Method</label>
        <Radio.Group
          name="uploadType"
          className="add-employee-modal__upload-type-input__radio-group"
        >
          <Radio value="card">card</Radio>
          <Radio value="bank Transfer">Bank Transfer</Radio>
        </Radio.Group>
      </div>

      <Formik
      initialValues={{
        amount: '',
      }}
    //   // validationSchema={singleEmployeeUploadValidationSchema}
    
    >
      {(props: FormikProps<WalletBilling>) => {
        const {
          handleChange,
          handleSubmit,
        } = props;
        return (
          <form
            onSubmit={handleSubmit}
            className="single-employee-upload-form"
            autoComplete="off"
          >
            <div className="single-employee-upload-form__section">
              <Input
                type="text"
                label=" Amount (₦)"
                placeholder=" Amount (₦)"
                name="salary"
                onChange={handleChange}
              />
            </div>

            <div className="form__submit-button">
              <Button
            onClick={() => NiceModal.show(FundDetailsModal)}

                type="submit"
                label="Proceed"
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
