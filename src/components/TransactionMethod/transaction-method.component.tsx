import Image from 'next/image';
import wallet from '/public/images/wallet.png';
import card from '/public/images/credit-card.png';
import bank from '/public/images/bank.png';
import cryptocurrency from '/public/images/cryptocurrency.png';
import { ITransactionMethod } from '../types';

const MethodImage = ({ method }: Pick<ITransactionMethod, 'method'>) => {
  if (new RegExp('^wallet$', 'gi').test(method)) {
    return <Image src={wallet} alt="" />;
  }
  if (new RegExp('^card$', 'gi').test(method)) {
    return <Image src={card} alt="" />;
  }
  if (new RegExp('^crypto$', 'gi').test(method)) {
    return <Image src={cryptocurrency} alt="" />;
  }
  if (new RegExp('^bank$', 'gi').test(method)) {
    return <Image src={bank} alt="" className="bank-svg" />;
  }
};

export const TransactionMethod = (props: ITransactionMethod) => {
  return (
    <span className="transaction-chip identity">
      <span className="identity__image">
        <MethodImage method={props.method} />
      </span>
      <span className="identity__name">{props.method}</span>
    </span>
  );
};
