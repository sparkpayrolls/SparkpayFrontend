import { IWalletBillingForm, WalletBilling } from '@/components/types';
import { FormikHelpers } from 'formik';
import { Company, Country } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { config } from '../config';
import { Util } from '../util';
import { usePaymentMethods } from './use-payment-methods.hooks';

export const useWalletBillingFormLogic = (params: IWalletBillingForm) => {
  const { modal } = params;
  const administrator = useAppSelector((state) => state.administrator);
  const {
    paymentMethods,
    loading: loadingPaymentMethods,
  } = usePaymentMethods();
  const company = administrator?.company as Company;
  const country = company.country as Country;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const triggerPaystackNGCheckout = (amount: number, channels: string[]) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: config().paystackKey,
        email: company.email,
        amount: amount * 100,
        currency: 'NGN',
        channels,
        metadata: {
          companyId: company.id,
          userId: administrator?.user,
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

  const handleWalletBillingFormSubmit = (
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

  return {
    paymentMethods,
    handleWalletBillingFormSubmit,
    currency,
    loadingPaymentMethods,
  };
};
