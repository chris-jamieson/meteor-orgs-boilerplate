export default {
  // eslint-disable-next-line max-len
  email: /^([a-z0-9_-]+[.+])*[a-z0-9_-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/,

  // TODO: Chris, please verify this is correct (max 11 digits including
  // leadning zero, and never less than 7 digits?).
  // https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Kingdom#Format
  ukPhone: /^\+44[0-9]{7,11}$/,
};
