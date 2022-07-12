export type PayoutDetailFieldsComponentProps = {
  value: string[];
  payoutMethod: string;
  name: string;
  onChange?(__: {
    target: {
      name: string;
      value: { bankId: string; accountNumber: string };
    };
  }): unknown;
};

export type PayoutDetailFieldsProps = Omit<
  PayoutDetailFieldsComponentProps,
  'payoutMethod' | 'value'
> & {
  payoutDetails: string[];
  payoutMethod: { id: string; name: string };
};
