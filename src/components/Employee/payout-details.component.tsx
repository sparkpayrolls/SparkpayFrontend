import { usePayoutMethods } from 'src/helpers/hooks/use-payout-methods.hook';
import { Select } from '../Input/select.component';
import { IF } from '../Misc/if.component';
import { PayoutMethodMeta } from '../Payment/payoutmethodmeta.component';

type IPayoutDetails = {
  touched: Record<string, any>;
  errors: Record<string, any>;
  values: Record<string, any>;
  setTouched(_touched: Record<string, boolean>, _validate?: boolean): unknown;
  setValues(_values: Record<string, any>, _validate?: boolean): unknown;
  country?: string;
};

export const PayoutDetails = (props: IPayoutDetails) => {
  const { setTouched, setValues, country, errors, touched, values } = props;
  const [payoutMethods, loadingPayoutMethods] = usePayoutMethods(country);

  return (
    <>
      <div>
        <Select
          label="Payout Method"
          placeholder="Select Payout Method"
          onBlur={() => setTouched({ ...touched, payoutMethod: true }, true)}
          value={values.payoutMethod}
          onChange={(val: string) => {
            setValues({ ...values, payoutMethod: val }, true);
          }}
          optionFilterProp="children"
          showSearch
          disabled={!payoutMethods.length}
          loading={loadingPayoutMethods}
          error={(touched.payoutMethod && errors.payoutMethod) || ''}
        >
          {payoutMethods.map((payoutMethod) => {
            const { Option } = Select;

            return (
              <Option value={payoutMethod.id} key={payoutMethod.id}>
                {payoutMethod.name}
              </Option>
            );
          })}
        </Select>
      </div>
      <IF condition={!!values.payoutMethod}>
        <PayoutMethodMeta
          method={
            payoutMethods.find(
              (payoutMethod) => payoutMethod.id === values.payoutMethod,
            ) || null
          }
          setMeta={(payoutMethodMeta) =>
            setValues({ ...values, payoutMethodMeta })
          }
          error={touched.payoutMethodMeta && !!errors.payoutMethodMeta}
          initialValues={values.payoutMethodMeta}
        />
      </IF>
    </>
  );
};
