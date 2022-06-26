export type Params = {
  transactionMethod?: string;
  createdAt?: string[];
  period?: string;
};

export type IFilterTransactionModal = {
  filter?(_params: Params): unknown;
  initialParams?: Params;
};
