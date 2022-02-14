import Image from 'next/image';
import PurpleImage from '../../../public/svgs/purplewallet.svg';
import YellowImage from '../../../public/svgs/yellowsvg.svg';
import { Button } from '../Button/Button.component';
import NiceModal from '@ebay/nice-modal-react';
import { WalletBillingModal } from '@/components/Modals/WalletBillingModal.component';
import { IWalletCard } from '../types';

export const WalletCard = (props: IWalletCard) => {
  const {
    title,
    amount,
    administrator,
    refreshBalance,
    paymentMethods,
  } = props;
  const pollRefreshBalance = (times = 0, duration = 0) => {
    if (times < 5) {
      refreshBalance();
      setTimeout(pollRefreshBalance, duration + 3000, times + 1);
    }
  };

  return (
    <>
      <div className="wallet-billing-page__wallet-amount">
        <div className="wallet-billing-page__wallet-purple-image">
          <Image src={PurpleImage} alt="purple image" />
        </div>

        <div className="wallet-billing-page__wallet-text">
          <p>{title}</p>
          <p className="wallet-billing-page__wallet-amount-text">{amount}</p>
        </div>

        <Button
          label={<>{'Fund Wallet'}</>}
          onClick={() => {
            NiceModal.show(WalletBillingModal, {
              administrator,
              paymentMethods,
            }).then(() => pollRefreshBalance());
          }}
          className="wallet-billing-page__submit-btn"
          primary
          type="submit"
        />

        <div className="wallet-billing-page__wallet-yellow-image">
          <Image src={YellowImage} alt="yellowImage" />
        </div>
      </div>
    </>
  );
};
