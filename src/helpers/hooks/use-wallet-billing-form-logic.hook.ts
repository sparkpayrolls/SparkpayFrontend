import { IWalletBillingForm, WalletBilling } from '@/components/types';
import { FormikHelpers } from 'formik';
import { $api } from 'src/api';
import { Company, Country } from 'src/api/types';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { config } from '../config';
import { Util } from '../util';
import { useBanks } from './use-banks.hook';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useWallet } from './use-wallet-balance.hook';
// import { usePaymentMethods } from './use-payment-methods.hooks';

export const useWalletBillingFormLogic = (params: IWalletBillingForm) => {
  const { modal /* , switchForm */ } = params;
  const { administrator, user } = useAppSelector(({ administrator, user }) => ({
    user,
    administrator,
  }));
  const [dva, setDVA] = useState<any>(null);
  const [expiry, setExpiry] = useState({
    minute: 0,
    seconds: 0,
  });
  // const {
  //   paymentMethods,
  //   loading: loadingPaymentMethods,
  // } = usePaymentMethods();
  const company = administrator?.company as Company;
  const country = company.country as Country;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const { wallet, loading: loadingWallet, reloadWallet } = useWallet(
    params.wallet,
  );

  useEffect(() => {
    if (dva) {
      const interval = setInterval(() => {
        setExpiry({
          minute: Math.max(moment(dva?.expiresAt).diff(moment(), 'minutes'), 0),
          seconds:
            Math.max(moment(dva?.expiresAt).diff(moment(), 'seconds'), 0) % 60,
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [dva]);

  const triggerPaystackNGCheckout = (amount: number, ref: string) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: config().paystackKey,
        email: company.email,
        amount: amount * 100,
        currency: 'NGN',
        channels: ['card'],
        ref,
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
    // if (amount > 5e5) {
    //   switchForm('NGMoreInfo');
    //   helpers.setSubmitting(false);
    //   return;
    // }
    if (amount > 5e5 && values.channel === 'Card') {
      helpers.setErrors({
        amount:
          "Use the 'Bank Transfer' option for amounts greater than 500,000",
      });
      helpers.setSubmitting(false);
      return;
    }

    if (values.channel === 'Card') {
      triggerPaystackNGCheckout(
        +values.amount,
        `funding-${company?.id}-${user?.id}-${Math.random().toString(36)}`,
      )
        .then(() => modal.hide())
        .then(() => modal.remove())
        .catch(() => {
          helpers.setSubmitting(false);
        });
    }

    if (values.channel === 'Bank Transfer') {
      $api.payment
        .generateDynamicVirtualAccount({
          amount,
          country: country.name,
        })
        .then((result) => {
          setDVA(result);
          helpers.setSubmitting(false);
        })
        .catch(() => helpers.setSubmitting(false));
    }
  };

  const handleWalletBillingFormSubmit = (
    values: WalletBilling,
    helpers: FormikHelpers<WalletBilling>,
  ) => {
    helpers.setSubmitting(true);
    if (dva) {
      toast.info(
        'Transaction balance will be updated immediately funding is confirmed.',
      );
      modal.hide();
      return;
    }

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
    dva,
    copyDVA() {
      navigator.clipboard.writeText(dva?.accountNumber);
    },
    back() {
      setDVA(null);
    },
    expiry,
    wallet,
    loadingWallet,
    reloadWallet,
  };
};

export const useNGMoreInfoFormContext = (params: IWalletBillingForm) => {
  const { administrator } = useAppSelector(({ administrator }) => ({
    administrator,
  }));
  const dispatch = useAppDispatch();
  const company = administrator?.company as Company;
  const { banks, loading: loadingBanks } = useBanks({
    country: (company.country as Country).id,
    all: true,
  });
  const [resolutionResult, setResolutionResult] = useState<
    Record<string, string>
  >({});

  const resolveAccount = useMemo(() => {
    return debounce(async (bankId?: string, accountNumber?: string) => {
      if (bankId && accountNumber) {
        setResolutionResult({});
        $api.payout
          .resolveAccount<typeof resolutionResult>({
            provider: 'paystack',
            bankId,
            accountNumber,
          })
          .then(setResolutionResult)
          .catch(() =>
            setResolutionResult({ error: 'Could not resolve account' }),
          );
      }
    }, 500);
  }, []);

  useEffect(() => {
    resolveAccount(company.bank, company.accountNumber);
  }, [company, resolveAccount]);

  const initialValues = {
    accountNumber: company.accountNumber,
    bank: company.bank,
    bvn: company.bvn,
    bvnName: company.bvnName,
  };

  const handleSubmit = (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    $api.company
      .updateCompanyById(company.id, values)
      .then(() => {
        return $api.companyWallet.createTransactionAccount({
          provider: 'anchor',
        });
      })
      .then(() => {
        dispatch(
          commitAministrator({
            ...(administrator as any),
            company: { ...company, ...values },
          }),
        );

        params.callBack && params.callBack();
      })

      .catch((error) => {
        toast.error(error.message);
        helpers.setSubmitting(false);
      });
  };

  return {
    company,
    initialValues,
    banks,
    loadingBanks,
    resolveAccount,
    resolutionResult,
    handleSubmit,
  };
};
