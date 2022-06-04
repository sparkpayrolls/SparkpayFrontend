/* eslint-disable no-undef */
import React from 'react';
import Head from 'next/head';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Formik, FormikProps } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import {
  IWalletBillingForm,
  IWalletBillingModal,
  WalletBilling,
} from '../types';
import { fundWalletValidationSchema } from 'src/helpers/validation';
import { Util } from 'src/helpers/util';
import { useWalletBillingFormLogic } from 'src/helpers/hooks/use-wallet-billing-form-logic.hook';

export const WalletBillingModal = NiceModal.create(
  (props: IWalletBillingModal) => {
    return (
      <ModalLayout title="Fund Payroll">
        {(modal) => {
          return (
            <WalletBillingForm
              modal={modal}
              administrator={props.administrator}
              paymentMethods={props.paymentMethods}
            />
          );
        }}
      </ModalLayout>
    );
  },
);

const WalletBillingForm = (props: IWalletBillingForm) => {
  const {
    paymentMethods,
    handleWalletBillingFormSubmit,
    currency,
  } = useWalletBillingFormLogic(props);

  return (
    <div className="add-employee-modal">
      <Head>
        <script src="https://js.paystack.co/v1/inline.js" defer></script>
      </Head>

      <Formik
        initialValues={{
          amount: '',
          // @ts-ignore
          channel: '',
        }}
        onSubmit={handleWalletBillingFormSubmit}
        validationSchema={fundWalletValidationSchema}
      >
        {(props: FormikProps<WalletBilling>) => {
          const {
            handleChange,
            handleSubmit,
            isSubmitting,
            errors,
            touched,
            handleBlur,
            values,
          } = props;
          const error =
            ((errors.amount && touched.amount) ||
              (errors.channel && touched.channel)) &&
            [errors.amount, errors.channel].filter((e) => !!e).join(' and ');

          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              <div className="add-employee-modal__upload-type-input">
                <label>Select Payment Method</label>
                <Radio.Group
                  name="channel"
                  onChange={handleChange}
                  value={values.channel}
                  className="add-employee-modal__upload-type-input__radio-group"
                >
                  {paymentMethods.map((paymentMethod) => {
                    return (
                      <Radio key={paymentMethod.id} value={paymentMethod.name}>
                        {paymentMethod.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>

              <div className="single-employee-upload-form__section">
                <InputV2
                  type="number"
                  label={`Amount (${currency})`}
                  placeholder={`Amount (${currency})`}
                  name="amount"
                  value={values.amount}
                  transformValue={Util.formatMoneyString(currency)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={error}
                />
              </div>

              <div className="form__submit-button">
                <Button
                  type="submit"
                  label="Proceed"
                  className="form__submit-button form__submit-button--full-width"
                  primary
                  showSpinner={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
