import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';

export type RemittanceTabProps = {
  organizationDetails: ReturnType<typeof useOrganizationDetails>;
};
