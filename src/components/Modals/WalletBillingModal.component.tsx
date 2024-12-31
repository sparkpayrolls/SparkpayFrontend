/* eslint-disable no-undef */
import React, { useState } from 'react';
import Head from 'next/head';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
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
import 'react-loading-skeleton/dist/skeleton.css';
import { SelectInput } from '../Input/seletct-input';
import { Radio } from 'antd';
import { BackSVG, CopySVG } from '../svg';
import { CompanyWallet } from 'src/api/types';

type WalletBillingModalProps = {
  wallet?: CompanyWallet;
};
export const WalletBillingModal = NiceModal.create(
  (props: WalletBillingModalProps) => {
    const [form, setForm] = useState<'NGMoreInfo'>();
    return (
      <ModalLayout title="Fund Payroll">
        {(modal) => {
          let Component = WalletBillingForm;

          if (form === 'NGMoreInfo') {
            Component = NGMoreInfoForm;
          }

          return (
            <Component
              modal={modal}
              wallet={props.wallet}
              switchForm={setForm}
            />
          );
        }}
      </ModalLayout>
    );
  },
);

const WalletBillingForm = (walletBillingFormProps: IWalletBillingForm) => {
  const { wallet } = walletBillingFormProps;
  const {
    handleWalletBillingFormSubmit,
    currency,
    dva,
    expiry,
    back,
  } = useWalletBillingFormLogic(walletBillingFormProps);

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
          channel: 'Bank Transfer',
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

          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              {!dva && (
                <div className="add-employee-modal__upload-type-input">
                  <label>Select Payment Method</label>
                  <Radio.Group
                    name="channel"
                    onChange={handleChange}
                    value={values.channel}
                    className="add-employee-modal__upload-type-input__radio-group"
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '56px',
                      }}
                    >
                      <Radio value="Bank Transfer">Bank Transfer</Radio>
                      <Radio value="Card">Card</Radio>
                    </div>
                  </Radio.Group>
                </div>
              )}

              {!!dva && (
                <div className="single-employee-upload-form__section">
                  <button
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '18px',
                      background: 'none',
                      border: 'none',
                      alignItems: 'center',
                      lineHeight: '16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onClick={back}
                  >
                    <BackSVG /> <span>Back</span>
                  </button>
                </div>
              )}

              <div className="single-employee-upload-form__section">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div hidden={values.channel === 'Bank Transfer'}>
                    <InputV2
                      type="number"
                      label="Amount"
                      placeholder={`Amount (${currency})`}
                      name="amount"
                      value={values.amount}
                      transformValue={Util.formatMoneyString(currency)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!!dva}
                      error={touched.amount && errors.amount}
                    />
                  </div>

                  {(!!dva || !!wallet?.account) &&
                    values.channel === 'Bank Transfer' && (
                      <>
                        <div hidden>
                          <p style={{ color: '#6D7A98', fontSize: '14px' }}>
                            Transfer this exact amount into this account number
                            via your Internet/Mobile Banking platform.
                          </p>
                        </div>

                        <div
                          style={{
                            padding: '20px',
                            borderRadius: '4px',
                            background: '#F7F9FB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              color: '#162A56',
                            }}
                          >
                            <p
                              style={{
                                color: 'rgba(22,42,86,.6)',
                                fontWeight: 'bold',
                              }}
                            >
                              {dva?.accountName || wallet?.account?.accountName}
                            </p>
                            <p style={{ fontSize: '24px' }}>
                              {Util.formatAccountNumber(
                                dva?.accountNumber ||
                                  wallet?.account?.accountNumber,
                              )}
                            </p>
                            <p>{dva?.bankName || wallet?.account?.bankName}</p>
                          </div>

                          <button
                            style={{
                              display: 'flex',
                              gap: '4px',
                              background: '#ECF2FD',
                              border: 'none',
                              alignItems: 'center',
                              lineHeight: '16px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              color: '#0F42A4',
                            }}
                            onClick={Util.copyToClipboard(
                              dva?.accountNumber ||
                                wallet?.account?.accountNumber,
                            )}
                            type="button"
                          >
                            <CopySVG /> <span>Copy</span>
                          </button>
                        </div>
                      </>
                    )}
                </div>
              </div>

              {!!dva && (
                <div className="single-employee-upload-form__section">
                  <p
                    className="text-center"
                    style={{ color: '#6D7A98', fontSize: '14px' }}
                  >
                    Expires in {expiry.minute.toString().padStart(2, '0')}:
                    {expiry.seconds.toString().padStart(2, '0')}
                  </p>
                </div>
              )}

              {!wallet?.account && values.channel === 'Bank Transfer' && (
                <NGMoreInfoForm {...walletBillingFormProps} />
              )}

              <div
                className="form__submit-button"
                hidden={values.channel === 'Bank Transfer'}
              >
                <Button
                  type="submit"
                  label={dva ? 'I have paid' : 'Proceed'}
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
              To create a transaction account for bank transfers, the
              information below is required. Please ensure the details are
              correct before proceeding.
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
                type="text"
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
