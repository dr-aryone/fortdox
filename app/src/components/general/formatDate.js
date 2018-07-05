import moment from 'moment';

export const formatDate = date => {
  const correctTimeZone = moment(date).format();
  return moment(correctTimeZone).format('YYYY-MM-DD');
};
