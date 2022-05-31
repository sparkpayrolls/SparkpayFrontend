import classNames from 'classnames';
import { FileStorageSVG } from '../svg';

export const TableEmptyState = ({
  text,
  ...props
}: {
  text?: string;
  className?: string;
}) => {
  const className = classNames('table-empty-state', props.className);

  return (
    <div className={className}>
      <FileStorageSVG />
      <span className="table-empty-state__text">{text ?? 'No data'}</span>
    </div>
  );
};
