/* eslint-disable no-undef */
import React, { useState } from 'react';
import Head from 'next/head';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
// import { Radio } from 'antd';
import { Formik, FormikProps } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { IWalletBillingForm, WalletBilling } from '../types';
import {
  fundWalletValidationSchema,
  ngMoreInfoValidation,
} from 'src/helpers/validation';
import { Util } from 'src/helpers/util';
import {
  useNGMoreInfoFormContext,
  useWalletBillingFormLogic,
} from 'src/helpers/hooks/use-wallet-billing-form-logic.hook';
// import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SelectInput } from '../Input/seletct-input';

export const WalletBillingModal = NiceModal.create(() => {
  const [form, switchForm] = useState<'NGMoreInfo'>();
  return (
    <ModalLayout title="Fund Payroll">
      {(modal) => {
        let Component = WalletBillingForm;

        switch (form) {
          case 'NGMoreInfo':
            Component = NGMoreInfoForm;
        }

        return <Component modal={modal} switchForm={switchForm} />;
      }}
    </ModalLayout>
  );
});

const WalletBillingForm = (props: IWalletBillingForm) => {
  const {
    // paymentMethods,
    // loadingPaymentMethods,
    handleWalletBillingFormSubmit,
    currency,
  } = useWalletBillingFormLogic(props);

  return (
    <div className="add-employee-modal">
      <Head>
        <script src="https://js.paystack.co/v1/inline.js" defer></script>
        <script
          src="https://cdn.collect.africa/collect-widget.js"
          defer
        ></script>
      </Head>

      <Formik
        initialValues={{
          amount: '',
          // @ts-ignore
          // channel: '',
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
          // const error =
          //   ((errors.amount && touched.amount) ||
          //     (errors.channel && touched.channel)) &&
          //   [errors.amount, errors.channel].filter((e) => !!e).join(' and ');

          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              {/* <div className="add-employee-modal__upload-type-input">
                {loadingPaymentMethods ? (
                  <>
                    <Skeleton width={100} borderRadius={4} count={1} />
                    <Skeleton width={200} borderRadius={4} count={1} />
                  </>
                ) : (
                  <>
                    <label>Select Payment Method</label>
                    <Radio.Group
                      name="channel"
                      onChange={handleChange}
                      value={values.channel}
                      className="add-employee-modal__upload-type-input__radio-group"
                    >
                      {paymentMethods.map((paymentMethod) => {
                        return (
                          <Radio
                            key={paymentMethod.id}
                            value={paymentMethod.name}
                          >
                            {paymentMethod.name}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </>
                )}
              </div> */}

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
                  error={touched.amount && errors.amount}
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

const NGMoreInfoForm = (props: IWalletBillingForm) => {
  const {
    initialValues,
    banks,
    loadingBanks,
    resolveAccount,
    resolutionResult,
    handleSubmit,
  } = useNGMoreInfoFormContext(props);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ngMoreInfoValidation}
    >
      {(props) => {
        const {
          handleChange,
          handleSubmit,
          isSubmitting,
          errors,
          touched,
          handleBlur,
          values,
        } = props;

        const handleBankDetailsBlur = (ev: any) => {
          handleBlur(ev);
          const _values = { ...values, [ev.target.name]: ev.target.value };

          console.log(_values.bank, _values.accountNumber);
          resolveAccount(_values.bank, _values.accountNumber);
        };

        return (
          <form
            onSubmit={handleSubmit}
            className="single-employee-upload-form"
            autoComplete="off"
          >
            <p className="employee-onboard__subtext">
              A transaction account is required for amounts greater than
              ₦500,000 and the information below is required for account
              creation. Please ensure the details are correct before proceeding.
            </p>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="tel"
                label="BVN"
                placeholder="Enter BVN"
                value={values.bvn}
                name="bvn"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.bvn && errors.bvn}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="tel"
                label="BVN Name"
                placeholder="Enter BVN Name"
                value={values.bvnName}
                name="bvnName"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.bvnName && errors.bvnName}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <SelectInput
                label="Bank Name"
                name="bank"
                placeholder="Select Bank Name"
                onBlur={handleBankDetailsBlur}
                onChange={handleChange}
                value={values.bank}
                loading={loadingBanks}
                error={touched.bank && errors.bank}
                options={banks}
                showSearch="Enter bank name"
              />
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="tel"
                label="Account Number"
                placeholder="Enter Account Number"
                helper={resolutionResult.accountName}
                value={values.accountNumber}
                name="accountNumber"
                onChange={handleChange}
                onBlur={handleBankDetailsBlur}
                error={
                  resolutionResult.error ||
                  (touched.accountNumber && errors.accountNumber)
                }
              />
            </div>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Create Transaction Account"
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
  );
};
