/* eslint-disable no-undef */
import React from 'react';
import Head from 'next/head';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import {
  IWalletBillingForm,
  IWalletBillingModal,
  WalletBilling,
} from '../types';
import { fundWalletValidationSchema } from 'src/helpers/validation';
import { config } from '../../helpers/config';
import { Company, Country } from 'src/api/types';
import { Util } from 'src/helpers/util';

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
  const { administrator, modal, paymentMethods } = props;
  const company = administrator.company as Company;
  const country = company.country as Country;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const triggerPaystackNGCheckout = (amount: number, channels: string[]) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: config().paystackKey,
        email: company.email,
        amount: amount * 100,
        currency: 'NGN',
        channels,
        metadata: {
          companyId: company.id,
          userId: administrator.user,
          chargeType: 'wallet-topup',
        },
        callback: resolve,
        onClose: () => reject(new Error()),
      });

      handler.openIframe();
    });
  };

  const handleNigeriaSubmit = (
    values: WalletBilling,
    helpers: FormikHelpers<WalletBilling>,
  ) => {
    const amount = +values.amount;
    if (amount < 100) {
      helpers.setErrors({
        amount: `amount must be at least ${currency} 100`,
      });
      helpers.setSubmitting(false);
      return;
    }
    let channel: string;
    switch (values.channel) {
      case 'Bank Transfer': {
        channel = 'bank';
        break;
      }
      default:
        channel = 'card';
    }

    triggerPaystackNGCheckout(amount, [channel])
      .then(() => {
        modal.resolve(true);
        setTimeout(modal.hide, 100);
      })
      .catch(() => helpers.setSubmitting(false));
  };

  const handleSubmit = (
    values: WalletBilling,
    helpers: FormikHelpers<WalletBilling>,
  ) => {
    helpers.setSubmitting(true);

    switch (country.name) {
      case 'Nigeria': {
        handleNigeriaSubmit(values, helpers);
        break;
      }
      default:
        console.log(`unsupported country - ${country.name}`);
    }
  };

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
        onSubmit={handleSubmit}
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
          } = props;
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
                  transformValue={(val) => {
                    const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
                    if (!valTransformed) return '';

                    return `${currency} ${valTransformed.toLocaleString()}`;
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    ((errors.amount && touched.amount) ||
                      (errors.channel && touched.channel)) &&
                    [errors.amount, errors.channel]
                      .filter((e) => !!e)
                      .join(' and ')
                  }
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
