export type PayoutDetailFieldsComponentProps = {
  payoutMethodMeta: Record<string, unknown>;
  payoutMethod: string;
  name: string;
  onChange?(__: {
    target: {
      name: string;
      value: Record<string, unknown>;
    };
  }): unknown;
  payoutMehodContext: Record<string, unknown>;
};

export type PayoutDetailFieldsProps = PayoutDetailFieldsComponentProps & {
  payoutMethodName: string;
};
