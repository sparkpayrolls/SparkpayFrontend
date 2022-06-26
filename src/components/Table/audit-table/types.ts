type IDescriptionPopoverComponent = {
  description: string;
  meta?: Record<string, unknown>;
};

export type DescriptionPopoverComponent = (
  _props: IDescriptionPopoverComponent,
  // eslint-disable-next-line no-undef
) => JSX.Element;
