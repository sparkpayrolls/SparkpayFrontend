import classNames from 'classnames';
import moment from 'moment';
import { RangeArrowSVG } from '../svg';

export const DateTimeChip = ({
  date,
  dateFormat,
  textSize,
}: {
  date?: string;
  dateFormat?: string;
  timeFormat?: string;
  textSize?: 'text-large';
}) => {
  const className = classNames('date-time-chip', {
    [`date-time-chip--${textSize}`]: !!textSize,
  });

  return (
    <span className={className}>
      <span className="date-time-chip__date">
        {moment(date).format(dateFormat ?? 'MMMM\xa0DD,\xa0YYYY')}
      </span>
      {/* {'\xa0'}|{'\xa0'}
      <span className="date-time-chip__time">
        {moment(date).format(timeFormat ?? 'hh:mm\xa0A')}
      </span> */}
    </span>
  );
};

const Range = (props: { date?: [string, string]; dateFormat?: string }) => {
  const { date: [start, end] = [], dateFormat } = props;
  const className = classNames('date-time-chip white-space-nowrap');

  return (
    <span className={className}>
      <span className="date-time-chip__date">
        {moment(start).format(dateFormat ?? 'MMMM DD, YYYY')}
      </span>
      <RangeArrowSVG />
      <span className="date-time-chip__date">
        {moment(end).format(dateFormat ?? 'MMMM DD, YYYY')}
      </span>
    </span>
  );
};

DateTimeChip.Range = Range;
