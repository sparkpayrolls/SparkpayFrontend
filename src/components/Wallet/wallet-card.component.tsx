import Image from 'next/image';
import PurpleImage from '../../../public/svgs/purplewallet.svg';
import YellowImage from '../../../public/svgs/yellowsvg.svg';
import { Button } from '../Button/Button.component';

export const WalletCard = ({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) => {
  return (
    <div>
      <div className="wallet-billing-page__wallet-amount">
        <div className="wallet-billing-page__wallet-purple-image">
          <Image src={PurpleImage} alt="purple image" />
        </div>
        <div className="wallet-billing-page__wallet-text">
          <p>{title}</p>
          <p className="wallet-billing-page__wallet-amount-text">{amount}</p>
        </div>
        <div>
          <Button
            label={<>{'Fund Wallet'}</>}
            onClick={() => {}}
            className="employee-section__submit-btn"
            primary
            type="submit"
          />
        </div>
      </div>
      <div className="wallet-billing-page__wallet-yellow-image">
        <Image src={YellowImage} alt="yellowImage" />
      </div>
    </div>
  );
};
