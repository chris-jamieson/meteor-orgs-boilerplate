import moment from 'moment';

export const getDateString = (date = new Date()) =>
  moment(date).format('DD/MM/YYYY');

export const getDateTimeString = (date = new Date(), withSeconds = false) => {
  if (withSeconds) {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  }
  return moment(date).format('DD/MM/YYYY HH:mm');
};
