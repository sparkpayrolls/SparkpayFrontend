import { IWalletBillingForm, WalletBilling } from '@/components/types';
import { FormikHelpers } from 'formik';
import { $api } from 'src/api';
import { Company, Country } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { config } from '../config';
import { Util } from '../util';
// import { usePaymentMethods } from './use-payment-methods.hooks';

export const useWalletBillingFormLogic = (params: IWalletBillingForm) => {
  const { modal } = params;
  const { administrator, user } = useAppSelector(({ administrator, user }) => ({
    user,
    administrator,
  }));
  // const {
  //   paymentMethods,
  //   loading: loadingPaymentMethods,
  // } = usePaymentMethods();
  const company = administrator?.company as Company;
  const country = company.country as Country;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const triggerPaystackNGCheckout = (
    amount: number,
    ref: string,
    // channels: string[],
  ) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: config().paystackKey,
        email: company.email,
        amount: amount * 100,
        currency: 'NGN',
        // channels,
        ref,
        callback: resolve,
        onClose: () => reject(new Error()),
      });

      handler.openIframe();
    });
  };

  const triggerCollectCheckout = (amount: number, reference: string) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const checkout = new window.CollectCheckout({
        publicKey: config().collectKey,
        email: company.email,
        amount: amount * 100,
        currency: 'NGN',
        reference,
        firstName: user?.firstname,
        lastName: user?.lastname,
        onSuccess: resolve,
        onClose: () => reject(new Error()),
      });

      checkout.setup();
      checkout.open();
    });
  };

  const providers = {
    Paystack: triggerPaystackNGCheckout,
    Collect: triggerCollectCheckout,
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
    // let channel: string;
    // switch (values.channel) {
    //   case 'Bank Transfer': {
    //     channel = 'bank';
    //     break;
    //   }
    //   default:
    //     channel = 'card';
    // }

    $api.payment
      .getPaymentReference({
        amount,
        country: country.name,
        metadata: {
          companyId: company.id,
          userId: administrator?.user,
          chargeType: 'wallet-topup',
        },
      })
      .then((result) => {
        const [reference, provider] = result.split('::');
        const providerFunc = providers[provider as 'Paystack'];
        if (providerFunc) {
          return providerFunc(amount, reference);
        }
      })
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
    // paymentMethods,
    handleWalletBillingFormSubmit,
    currency,
    // loadingPaymentMethods,
  };
};
