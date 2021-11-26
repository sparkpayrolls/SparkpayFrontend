import moment from 'moment';

export const DateTimeChip = ({
  date,
  dateFormat,
  timeFormat,
}: {
  date: string;
  dateFormat?: string;
  timeFormat?: string;
}) => {
  return (
    <span className="date-time-chip">
      <span className="date-time-chip__date">
        {moment(date).format(dateFormat ?? 'MMMM\xa0DD,\xa0YYYY')}
      </span>
      {'\xa0'}|{'\xa0'}
      <span className="date-time-chip__time">
        {moment(date).format(timeFormat ?? 'hh:mm\xa0A')}
      </span>
    </span>
  );
};
