import { PropsWithChildren } from 'react';

export const IF = (props: PropsWithChildren<{ condition?: unknown }>) => {
  if (props.condition) {
    return <>{props.children}</>;
  }

  return null;
};
