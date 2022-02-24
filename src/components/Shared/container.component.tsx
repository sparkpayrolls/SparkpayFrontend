import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

export const Container = (
  props: PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      loading?: boolean;
      showContent?: boolean;
    }
  >,
) => {
  const { className, loading, children, showContent, ...divProps } = props;
  const divClassName = classNames(className, 'app-container', {
    'app-container--is-loading': loading,
    'app-container--show-content': showContent,
  });

  return (
    <div {...divProps} className={divClassName}>
      {loading && !showContent ? null : children}
    </div>
  );
};
