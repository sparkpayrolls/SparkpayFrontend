import { useAuditLogs } from 'src/helpers/hooks/use-audit-logs.hook';
import { DefaultAuditLogDescriptionPopoverContent } from './components/default-description-popover';
import { EmployeeUpdateDescriptionPopOver } from './components/employee-update-description-popover.component';
import { DescriptionPopoverComponent } from './types';

const descriptionComponents: Map<
  RegExp,
  DescriptionPopoverComponent
> = new Map();

export const getDescriptionComponent = (description: string) => {
  const keys = descriptionComponents.keys();
  let currentKey = keys.next();
  while (!currentKey.done) {
    if (currentKey.value.test(description)) {
      return descriptionComponents.get(
        currentKey.value,
      ) as DescriptionPopoverComponent;
    }

    currentKey = keys.next();
  }

  return DefaultAuditLogDescriptionPopoverContent;
};

getDescriptionComponent.register = (
  regexp: RegExp,
  component: DescriptionPopoverComponent,
) => {
  descriptionComponents.set(regexp, component);
};

export const useLogic = () => {
  const { auditLogs, loading, setParams } = useAuditLogs();
  const totalLogs = auditLogs?.meta?.total || 0;
  const isEmpty = totalLogs <= 0;
  const title = `${totalLogs} Log${totalLogs !== 0 ? 's' : ''}`;

  const onSearch = (search: string) => {
    setParams({ search, page: 1, limit: auditLogs?.meta?.perPage });
  };

  return {
    auditLogs,
    isEmpty,
    loading,
    title,
    onSearch,
    setParams,
  };
};

// Register description components
getDescriptionComponent.register(
  /^.+ updated .+'s details\.$/,
  EmployeeUpdateDescriptionPopOver,
);
