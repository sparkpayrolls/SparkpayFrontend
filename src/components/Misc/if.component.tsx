import { PropsWithChildren } from 'react';

export const IF = (props: PropsWithChildren<{ condition: boolean }>) => {
  if (props.condition) {
    return <>{props.children}</>;
  }

  return null;
};
