import { Text } from '@/components/Typography/Text';
import { ChangeEvent, useEffect, useState } from 'react';
import { Util } from 'src/helpers/util';
import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';

export default function PricingPage() {
  const [variables, setVariables] = useState({ amount: 1000000, size: 20 });
  const [results, setResults] = useState({ payroll: 0, transfer: 0, total: 0 });
  const [focused, setFocused] = useState({ amount: false, size: false });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    if (+value) {
      value = +value as any;
    }

    setVariables({ ...variables, [name]: value });
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setFocused({ ...focused, [name]: !focused[name as 'amount'] });
  };

  useEffect(() => {
    const amount = Math.max(+variables.amount || 0, 0);
    const size = Math.max(+variables.size || 0, 0);
    let addition = 1500;
    let capp = 4500;
    let transferFee = 75;
    if (size < 50) {
      addition = 500;
      capp = 2500;
      transferFee = 55;
    } else if (size < 500) {
      addition = 1000;
      capp = 3500;
      transferFee = 65;
    }

    const fee = Math.min((amount * 2.5) / 100 + addition, capp);
    const totalTransferFee = transferFee * size;
    setResults({
      payroll: fee,
      transfer: totalTransferFee,
      total: amount + totalTransferFee + fee,
    });
  }, [variables]);

  return (
    <DefaultLayout>
      <Title title="SparkPay | Pricing" />

      <main className="pricing__main">
        <Text
          component="h2"
          className="pricing__page-title text-center"
          variant="heading-1"
        >
          Reasonable Pricing for your Business
        </Text>
        <Text component="h3" className="text-center" variant="body-text-1">
          You only pay when you execute a payroll.
        </Text>

        <section className="pricing__tiers">
          <section className="pricing__tier">
            <header className="pricing__tier-header">
              <Text component="p" variant="body-text-1">
                if payroll size is less than 50
              </Text>

              <Text
                component="p"
                className="pricing__tier-title"
                variant="heading-2"
              >
                2.5% + NGN 500
              </Text>
            </header>

            <Text component="p" variant="body-text-1">
              capped at ₦ 2,500
            </Text>
            <Text component="p" variant="body-text-1">
              and a transfer fee of ₦ 55
            </Text>
          </section>

          <section className="pricing__tier">
            <header className="pricing__tier-header">
              <Text component="p" variant="body-text-1">
                if payroll size is greater than 499
              </Text>

              <Text
                component="p"
                className="pricing__tier-title"
                variant="heading-2"
              >
                2.5% + NGN 1,500
              </Text>
            </header>

            <Text component="p" variant="body-text-1">
              capped at ₦ 4,500
            </Text>
            <Text component="p" variant="body-text-1">
              and a transfer fee of ₦ 75
            </Text>
          </section>

          <section className="pricing__tier">
            <header className="pricing__tier-header">
              <Text component="p" variant="body-text-1">
                if payroll size is less than 500
              </Text>

              <Text
                component="p"
                className="pricing__tier-title"
                variant="heading-2"
              >
                2.5% + NGN 1,000
              </Text>
            </header>

            <Text component="p" variant="body-text-1">
              capped at ₦ 3,500
            </Text>
            <Text component="p" variant="body-text-1">
              and a transfer fee of ₦ 65
            </Text>
          </section>
        </section>

        <section className="pricing__calculator">
          <div className="pricing__calculator-container">
            <section className="pricing__calculator-titles">
              <Text
                variant="heading-1"
                className="pricing__calculator-title"
                component="p"
              >
                Do the math
              </Text>
              <Text component="p" variant="body-text-1">
                Check out the cost of using SparkPay.
                <br />
                To see our charges, enter a value into the calculator.
              </Text>
            </section>
            <section className="pricing__calculator-box">
              <div className="pricing__input pricing__input--prefixed">
                <Text className="pricing__input-label" variant="body-text-1">
                  if your payroll amount is
                </Text>

                <div className="pricing__input-container">
                  <input
                    type={focused.amount ? 'number' : 'text'}
                    min={100}
                    name="amount"
                    className="pricing__input-input"
                    value={
                      focused.amount
                        ? variables.amount
                        : Util.formatMoneyNumber(+variables.amount || 0, 2)
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleBlur}
                    autoComplete="off"
                  />
                  <Text className="pricing__input-prefix">NGN</Text>
                </div>
              </div>

              <div className="pricing__input mt-2">
                <Text className="pricing__input-label" variant="body-text-1">
                  and your payroll size is
                </Text>

                <div className="pricing__input-container">
                  <input
                    type={focused.size ? 'number' : 'text'}
                    min={1}
                    name="size"
                    className="pricing__input-input"
                    value={
                      focused.size
                        ? variables.size
                        : Util.formatNumber(+variables.size || 0)
                    }
                    onChange={handleChange}
                    onFocus={handleBlur}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mt-2">
                <Text className="pricing__input-label" variant="body-text-1">
                  Payroll Fee Will Be
                </Text>
                <Text className="pricing__input-label" variant="heading-3">
                  NGN {Util.formatMoneyNumber(results.payroll, 2)}
                </Text>

                <Text
                  className="pricing__input-label mt-1"
                  component="p"
                  variant="body-text-1"
                >
                  Transfer Fee Will Be
                </Text>
                <Text className="pricing__input-label" variant="heading-3">
                  NGN {Util.formatMoneyNumber(results.transfer, 2)}
                </Text>

                <Text
                  className="pricing__input-label mt-1"
                  component="p"
                  variant="body-text-1"
                >
                  Making the total charge
                </Text>
                <Text className="pricing__input-label" variant="heading-3">
                  NGN {Util.formatMoneyNumber(results.total, 2)}
                </Text>
              </div>
            </section>
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
}