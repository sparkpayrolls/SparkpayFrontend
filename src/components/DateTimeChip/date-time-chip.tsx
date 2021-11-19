import moment from 'moment';

export const DateTimeChip = ({ date }: { date: string }) => {
  return (
    <span className="date-time-chip">
      <span className="date-time-chip__date">
        {moment(date).format('MMMM\xa0DD,\xa02021')}
      </span>
      {'\xa0'}|{'\xa0'}
      <span className="date-time-chip__time">
        {moment(date).format('HH:MM\xa0A')}
      </span>
    </span>
  );
};
