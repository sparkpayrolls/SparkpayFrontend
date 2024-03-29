import Image from 'next/image';
import PurpleImage from '../../../public/svgs/purplewallet.svg';
import YellowImage from '../../../public/svgs/yellowsvg.svg';
import { Button } from '../Button/Button.component';
import NiceModal from '@ebay/nice-modal-react';
import { WalletBillingModal } from '@/components/Modals/WalletBillingModal.component';
import { IWalletCard } from '../types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';

export const WalletCard = (props: IWalletCard) => {
  const { title, amount, loading } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const [_amount, setAmount] = useState({ amount, lastAmount: amount });
  let countUpDuration = Math.abs(
    (_amount.amount - _amount.lastAmount) / 333333,
  );
  if (countUpDuration > 10) {
    countUpDuration = 10;
  }

  useEffect(() => {
    if (amount !== _amount.amount) {
      setAmount({ lastAmount: _amount.amount || amount, amount });
    }
  }, [_amount.amount, amount]);

  return (
    <>
      <div className="wallet-billing-page__wallet-amount">
        <div className="wallet-billing-page__wallet-purple-image">
          <Image src={PurpleImage} alt="purple image" />
        </div>

        <div className="wallet-billing-page__wallet-text">
          <p>{title}</p>
          {loading ? (
            <Skeleton
              className="wallet-billing-page__wallet-amount-skeleton"
              width={200}
              borderRadius={4}
              count={1}
            />
          ) : (
            <CountUp
              className="wallet-billing-page__wallet-amount-text"
              start={_amount.lastAmount}
              end={_amount.amount}
              duration={countUpDuration}
              separator=","
              decimals={2}
              decimal="."
              delay={0}
              prefix={`${currency} `}
            >
              {({ countUpRef }) => (
                <p
                  className="wallet-billing-page__wallet-amount-text"
                  ref={countUpRef as any}
                />
              )}
            </CountUp>
          )}
        </div>

        <Button
          label={<>{'Fund Payroll'}</>}
          onClick={() => {
            NiceModal.show(WalletBillingModal);
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
