import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

export const Container = (
  props: PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      loading?: boolean;
    }
  >,
) => {
  const { className, loading, children, ...divProps } = props;
  const divClassName = classNames(className, 'app-container', {
    'app-container--is-loading': loading,
  });

  return (
    <div {...divProps} className={divClassName}>
      {loading ? null : children}
    </div>
  );
};
