import classNames from 'classnames';
import moment from 'moment';

export const DateTimeChip = ({
  date,
  dateFormat,
  textSize,
}: {
  date: string;
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
