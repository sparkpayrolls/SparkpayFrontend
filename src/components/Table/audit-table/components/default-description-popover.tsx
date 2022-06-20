import { DescriptionPopoverComponent } from '../types';

export const DefaultAuditLogDescriptionPopoverContent: DescriptionPopoverComponent = (
  props,
) => {
  const { description } = props;

  return <p className="default-description-popover__content">{description}</p>;
};
